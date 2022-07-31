import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import { log, error } from "../Logger";

import { BillingDetails } from "../interfaces/Stripe";
import { createBillingDetails } from "../model";

const stripe = require("stripe");
const endpointSecret =
  "whsec_7684b0c6ca4fcdaa6a511e4855af592342bef4911ccbedc3eaeb4e38e3f38e64";

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    let error: Error = err as Error;
    next(new Error(`stripe webhook error: ${error.message}`));
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      //   console.log("payment succeeded");
      log(`stripe webhook: payment succeeded`);
      //get the payment details of the customer
      let payment_details = paymentIntent.charges.data[0]
        .billing_details as BillingDetails;
      //add the payment data to the db
      await createBillingDetails(payment_details);
      break;
    // ... handle other event types
    default:
      //   console.log(`Unhandled event type ${event.type}`);
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

module.exports = router;
export default router;

import React, { FC, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  checkBillingDetailsExists,
  registerUser,
  result_billingDetails,
  result_register,
  billingDetails,
} from "../../API/Register";
import ErrorText from "../../components/ErrorText/ErrorText";
import InputField from "../../components/InputField/InputField";
import InputHelper from "../../components/InputHelper/InputHelper";
import Loader from "../../components/Loader/Loader";
import FlexColumn from "../../layout/FlexColumn/FlexColumn";
import FlexRow from "../../layout/FlexRow/FlexRow";
import styles from "./Register.module.scss";

interface RegisterProps {}

const passwordHelperLines = [
  "Requires:",
  "1 Capital Letter",
  "1 Lowercase Letter",
  "1 Number",
  "8 Total Characters",
];

const Register: FC<RegisterProps> = () => {
  // generic states (used for most/all forms)

  const [searchParams, setSearchParams] = useSearchParams();
  const payment_status = searchParams.get("payment_status");
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [screen, setScreen] = useState(0);
  const [error, setError] = useState("");

  //--------------- ---------------
  //--------------- First Form (Payment mail) ---------------
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentAmount, setPaymentAmount] = useState(1500);

  const handleChange_paymentemail = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9@.+_\- ]/g, "");
    setPaymentEmail(e.target.value);
  };
  // handle form submission
  const handleFormSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    setLoading(true);
    e.preventDefault();
    // check if billing data found
    await checkBillingDetailsExists(
      paymentEmail,
      (result: result_billingDetails) => {
        let nextPage = 0;
        if (result.data.account) {
          setError("An account with this email has already been created.");
          return;
        }
        setPaymentAmount(result.data.billing_details[0].payment_amount);
        // console.log(result.data.billing_details[0]);
        // console.log(result.data.billing_details[0].payment_amount);
        setEmailVerified(true);
        setScreen(nextPage);
      }
    )
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //--------------- Second Form (Personal/Academic info) ---------------
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [minor, setMinor] = useState("");
  const [gtemail, setGtemail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [newMember, setNewMember] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState([""]);
  const [interestsOtherChecked, setInterestsOtherChecked] = useState(false);
  const [interestsOther, setInterestsOther] = useState("");
  const [hearAbout, setHearAbout] = useState("");
  const [emailConsent, setEmailConsent] = useState("");

  //handle all of the form elements updating (save input to state)
  const handleChange_fname = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.target.value = e.currentTarget.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setFname(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };
  const handleChange_lname = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.target.value = e.currentTarget.value.replace(/[^a-zA-Z0-9 ]/g, "");
    setLname(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_password = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_major = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setMajor(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_minor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setMinor(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_gtemail = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^a-zA-Z0-9@.+_\- ]/g,
      ""
    );
    setGtemail(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_personalemail = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.currentTarget.value = e.currentTarget.value.replace(
      /[^a-zA-Z0-9@.+_\- ]/g,
      ""
    );
    setPersonalEmail(e.currentTarget.value);
    // console.log(e.currentTarget.value);
  };

  const handleChange_newmember = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //radio input -- get value of label (next element)
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setNewMember(newValue);
    //console.log(newValue);
  };

  const handleChange_studyyear = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //radio input -- get value of label (next element)
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setStudyYear(newValue);
    //console.log(newValue);
  };

  const handleChange_genderRadio = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.getAttribute("data-value")?.toLowerCase() === "other") {
      //set value to input value
      let input = e.currentTarget.nextElementSibling
        ?.lastChild as HTMLInputElement;
      newValue = input.value;
    }
    setGender(newValue);
    //console.log(newValue);
  };
  const handleChange_genderOther = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //other input
    let newValue = e.currentTarget.value;
    (
      e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
    ).checked = true;
    setGender(newValue);
    //console.log(newValue);
  };

  const handleChange_ethnicityRadio = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.getAttribute("data-value")?.toLowerCase() === "other") {
      //set value to input value
      let input = e.currentTarget.nextElementSibling
        ?.lastChild as HTMLInputElement;
      newValue = input.value;
    }
    setEthnicity(newValue);
    //console.log(newValue);
  };
  const handleChange_ethnicityOther = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //other input
    let newValue = e.currentTarget.value;
    (
      e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
    ).checked = true;
    setEthnicity(newValue);
    //console.log(newValue);
  };

  const handleChange_location = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setLocation(newValue);
    //console.log(newValue);
  };

  const handleChange_experience = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setExperience(newValue);
    //console.log(newValue);
  };

  const handleChange_interestsCheckbox = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.checked) {
      //add to list
      let newInterests = [...interests, newValue];
      if (interests.length === 1 && interests[0] === "") {
        newInterests = [newValue];
      }
      setInterests(newInterests);
      // console.log(newInterests);
    } else {
      //remove from list
      let index = interests.indexOf(newValue);
      let newInterests;
      if (interests.length === 1 && interests[0] === newValue) {
        newInterests = [""];
      } else if (index > -1) {
        newInterests = interests;
        newInterests.splice(index, 1);
      }

      if (newInterests) {
        setInterests(newInterests);
        // console.log(newInterests);
      }
    }
  };

  const handleChange_interestsOtherCheckbox = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    setInterestsOtherChecked(e.currentTarget.checked);
    // console.log(e.currentTarget.checked);
  };
  const handleChange_interestsOtherInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //other input
    let newValue = e.currentTarget.value;
    (
      e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
    ).checked = true;
    setInterestsOther(newValue);
    // //console.log(newValue);
  };

  const handleChange_hearaboutRadio = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.getAttribute("data-value")?.toLowerCase() === "other") {
      //set value to input value
      let input = e.currentTarget.nextElementSibling
        ?.lastChild as HTMLInputElement;
      newValue = input.value;
    }
    setHearAbout(newValue);
    //console.log(newValue);
  };
  const handleChange_hearaboutOther = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //other input
    let newValue = e.currentTarget.value;
    (
      e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement
    ).checked = true;
    setHearAbout(newValue);
    //console.log(newValue);
  };

  const handleChange_emailconsentRadio = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.getAttribute("data-value")?.toLowerCase() === "other") {
      //set value to input value
      let input = e.currentTarget.nextElementSibling
        ?.lastChild as HTMLInputElement;
      newValue = input.value;
    }
    setEmailConsent(newValue);
    //console.log(newValue);
  };

  const handleFormSubmitRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    console.log(paymentAmount);
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (
      !(
        fname &&
        lname &&
        password &&
        gtemail &&
        major &&
        newMember &&
        studyYear &&
        gender &&
        ethnicity &&
        location &&
        experience &&
        hearAbout &&
        emailConsent
      )
    ) {
      setError("Missing one or more required fields.");
      return;
    }
    if (
      (interests.length <= 0 ||
        (interests.length === 1 && interests[0] === "")) &&
      (!interestsOtherChecked || (interestsOtherChecked && !interestsOther))
    ) {
      //no interests selected
      setError("You must select at least one interest.");
      return;
    }

    // attempt to register account
    await registerUser(
      paymentEmail,
      fname,
      lname,
      password,
      major,
      minor,
      gtemail,
      personalEmail,
      newMember,
      studyYear,
      gender,
      ethnicity,
      location,
      experience,
      JSON.stringify(interests),
      hearAbout,
      emailConsent,
      paymentAmount,
      (data: result_register) => {
        //callback function
        if (data.ok) {
          //save session id and role
          localStorage.setItem("dsgt-portal-session-key", data.session_key);
          // //continue to next section
          // setScreen(1);
          // setError("");
          // END FORM HERE FOR NOW (MAY HAVE TO MOVE ALL OTHER FORMS TO PORTAL LATER)
          window.location.href = "/portal";
        }
      }
    ).catch((err) => {
      setError(err.message);
    });
  };

  // ------------------------- screen 1 -------------------------------
  const [interestedProjects, setInterestedProjects] = useState("");

  const handleChange_interestedprojects = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setInterestedProjects(newValue);
    // console.log(newValue);
  };
  const handleFormSubmitScreen1 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (interestedProjects === "") {
      setError("Missing one or more required fields.");
      return;
    }
    //save data

    //change screens
    if (interestedProjects === "true") {
      setScreen(2); // projects info page
    } else {
      setScreen(3); // bootcamp info page
    }
  };

  // ------------------------- screen 2 -------------------------------
  const [partOfProject, setPartOfProject] = useState("");
  const [interestedParticipatingProject, setInterestedParticipatingProject] =
    useState("");
  const [interestsProjects, setInterestsProjects] = useState([""]);
  const [hoursProjects, setHoursProjects] = useState("");
  const [projectsMeetings, setProjectsMeetings] = useState("");
  const [projectsResume, setProjectsResume] = useState("");

  const handleChange_partproject = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setPartOfProject(newValue);
    // console.log(newValue);
  };

  const handleChange_interestedparticipatingprojects = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setInterestedParticipatingProject(newValue);
    // console.log(newValue);
  };

  const handleChange_interestsProjectsCheckbox = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.checked) {
      //add to list
      let newInterests = [...interestsProjects, newValue];
      if (interestsProjects.length === 1 && interestsProjects[0] === "") {
        newInterests = [newValue];
      }
      setInterestsProjects(newInterests);
      // console.log(newInterests);
    } else {
      //remove from list
      let index = interestsProjects.indexOf(newValue);
      let newInterests;
      if (interestsProjects.length === 1 && interestsProjects[0] === newValue) {
        newInterests = [""];
      } else if (index > -1) {
        newInterests = interestsProjects;
        newInterests.splice(index, 1);
      }

      if (newInterests) {
        setInterestsProjects(newInterests);
        // console.log(newInterests);
      }
    }
  };

  const handleChange_hoursprojects = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setHoursProjects(newValue);
    // console.log(newValue);
  };

  const handleChange_projectsmeetings = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setProjectsMeetings(newValue);
    // console.log(newValue);
  };
  const handleChange_projectsresume = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setProjectsResume(newValue);
    // console.log(newValue);
  };

  const handleFormSubmitScreen2 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (
      !(
        partOfProject &&
        interestedParticipatingProject &&
        hoursProjects &&
        projectsMeetings &&
        projectsResume
      )
    ) {
      setError("Missing one or more required fields.");
      return;
    }

    if (
      interestsProjects.length <= 0 ||
      (interestsProjects.length === 1 && interestsProjects[0] === "")
    ) {
      //no interests selected
      setError("You must select at least one project interest.");
      return;
    }
    //save data

    setScreen(3);
  };

  // ------------------------- screen 3 -------------------------------
  const [interestedBootcamp, setInteredtedBootcamp] = useState("");

  const handleChange_interestedbootcamp = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setInteredtedBootcamp(newValue);
    // console.log(newValue);
  };
  const handleFormSubmitScreen3 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (interestedBootcamp === "") {
      setError("Missing one or more required fields.");
      return;
    }
    //save data

    //change screens
    if (interestedBootcamp === "true") {
      setScreen(4); // bootcamp info page
    } else {
      setScreen(5); // leadership start info page
    }
  };
  // ------------------------- screen 4 -------------------------------
  const [interestsBootcamp, setInterestsBootcamp] = useState([""]);
  const [bootcampMeetings, setBootcampMeetings] = useState("");
  const [bootcampConsent, setBootcampConsent] = useState("");
  const [bootcampDataConsent, setBootcampDataConsent] = useState("");

  const handleChange_interestsBootcampCheckbox = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    if (e.currentTarget.checked) {
      //add to list
      let newInterests = [...interestsBootcamp, newValue];
      if (interestsBootcamp.length === 1 && interestsBootcamp[0] === "") {
        newInterests = [newValue];
      }
      setInterestsBootcamp(newInterests);
      // console.log(newInterests);
    } else {
      //remove from list
      let index = interestsBootcamp.indexOf(newValue);
      let newInterests;
      if (interestsBootcamp.length === 1 && interestsBootcamp[0] === newValue) {
        newInterests = [""];
      } else if (index > -1) {
        newInterests = interestsBootcamp;
        newInterests.splice(index, 1);
      }

      if (newInterests) {
        setInterestsBootcamp(newInterests);
        // console.log(newInterests);
      }
    }
  };

  const handleChange_bootcampmeetings = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setBootcampMeetings(newValue);
    // console.log(newValue);
  };
  const handleChange_bootcampconsent = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setBootcampConsent(newValue);
    // console.log(newValue);
  };
  const handleChange_bootcampdataconsent = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setBootcampDataConsent(newValue);
    // console.log(newValue);
  };

  const handleFormSubmitScreen4 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (!(bootcampConsent && bootcampDataConsent)) {
      setError("Missing one or more required fields.");
      return;
    }

    if (
      interestsBootcamp.length <= 0 ||
      (interestsBootcamp.length === 1 && interestsBootcamp[0] === "")
    ) {
      //no interests selected
      setError("You must select at least one bootcamp interest.");
      return;
    }
    //save data

    setScreen(5);
  };

  // ------------------------- screen 5 -------------------------------
  const [interestedLeadership, setInterestedLeadership] = useState("");

  const handleChange_interestedleadership = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setInterestedLeadership(newValue);
    // console.log(newValue);
  };
  const handleFormSubmitScreen5 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (interestedLeadership === "") {
      setError("Missing one or more required fields.");
      return;
    }
    //save data

    //change screens
    if (interestedLeadership === "true") {
      setScreen(6); // leadership form page
    } else {
      //end the form process
      window.location.href = "/portal";
    }
  };

  // ------------------------- screen 6 -------------------------------
  const [leadershipStatus, setLeadershipStatus] = useState("");

  const handleChange_leadershipstatus = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    //radio input -- get value of label (next element)
    //check if label has input
    // console.log(e.currentTarget.nextElementSibling?.lastChild);
    let newValue =
      e.currentTarget.getAttribute("data-value") ||
      e.currentTarget.nextElementSibling?.innerHTML.toString() ||
      e.currentTarget.id;
    setLeadershipStatus(newValue);
    console.log(newValue);
  };
  const handleFormSubmitScreen6 = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    setError("");
    // setLoading(true);
    e.preventDefault();
    //confirm ALL data
    if (interestedLeadership === "") {
      setError("Missing one or more required fields.");
      return;
    }
    //save data

    //change screens
    window.location.href = "/portal";
    // if (interestedLeadership === "true") {
    //   setScreen(6); // leadership form page
    // } else {
    //   //end the form process

    // }
  };

  if (payment_status === "completed" && screen === 0) {
    //show the register form with all of the questions
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            {loading ? (
              <Loader />
            ) : !emailVerified ? (
              <form onSubmit={handleFormSubmitEmail}>
                <FlexColumn width="100%">
                  <h1 className={styles.Major}>Thank You!</h1>
                  <h2 className={styles.Minor}>
                    If you already have an account from a previous semester,
                    simply sign back in.
                  </h2>
                  <Link to="/login" className={styles.Action}>
                    Login
                  </Link>
                  <div className={styles.Divider}></div>
                  <h2 className={styles.Minor}>
                    If you need an account, please enter the email associated
                    with the payment you just made:
                  </h2>
                  <InputField
                    type="email"
                    placeholder="Email"
                    width="100%"
                    onChange={handleChange_paymentemail}
                  />
                  <ErrorText>{error}</ErrorText>
                  <FlexRow spacing="flex-end" width="100%">
                    <InputField
                      type={"submit"}
                      placeholder="Next"
                      width="fit-content"
                    />
                  </FlexRow>
                </FlexColumn>
              </form>
            ) : (
              <form onSubmit={handleFormSubmitRegister}>
                <FlexColumn width="100%" gap="10px">
                  <h1 className={styles.Minor}>
                    Please enter the following information:
                  </h1>
                  <FlexRow gap="10px" spacing={"space-between"} width="100%">
                    <InputField
                      type="text"
                      placeholder="First Name"
                      name="fname"
                      width="45%"
                      onChange={handleChange_fname}
                      validIndication
                      required
                    />
                    <InputField
                      type="text"
                      placeholder="Last Name"
                      name="lname"
                      width="45%"
                      onChange={handleChange_lname}
                      validIndication
                      required
                    />
                  </FlexRow>
                  <InputField
                    type="password"
                    placeholder="Account Password"
                    name="password"
                    onChange={handleChange_password}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    width="100%"
                    helper={<InputHelper lines={passwordHelperLines} />}
                    validIndication
                    required
                  />
                  <div className={styles.Datalist}>
                    <input
                      list="major-list"
                      id="major-choice"
                      name="major-choice"
                      placeholder=" "
                      onChange={handleChange_major}
                    />
                    <label htmlFor="major-choice">
                      What is your major?
                      <span className={styles.Required}>*</span>
                    </label>
                    <datalist id="major-list">
                      <option value={"Aerospace Engineering"} />
                      <option
                        value={"Algorithms, Combinatorics, and Optimization"}
                      />
                      <option value={"Analytics"} />
                      <option
                        value={"Applied Languages and Intercultural Studies"}
                      />
                      <option value={"Applied Physics"} />
                      <option value={"Applied Physiology"} />
                      <option value={"Architecture"} />
                      <option value={"Biochemistry"} />
                      <option value={"Bioengineering"} />
                      <option value={"Bioinformatics"} />
                      <option value={"Biology"} />
                      <option value={"Biomedical Engineering"} />
                      <option value={"Biomedical Innovation and Development"} />
                      <option value={"Building Construction"} />
                      <option
                        value={"Building Construction and Facility Management"}
                      />
                      <option value={"Business Administration"} />
                      <option value={"Chemical and Biomolecular Engineering"} />
                      <option value={"Chemical Engineering"} />
                      <option value={"Chemistry"} />
                      <option value={"City and Regional Planning"} />
                      <option value={"Civil Engineering"} />
                      <option value={"Computational Media"} />
                      <option value={"Computational Science and Engineering"} />
                      <option value={"Computer Engineering"} />
                      <option value={"Computer Science"} />
                      <option value={"Cybersecurity"} />
                      <option value={"Digital Media"} />
                      <option value={"Earth and Atmospheric Sciences"} />
                      <option value={"Economics"} />
                      <option value={"Economics and International Affairs"} />
                      <option value={"Electrical Engineering"} />
                      <option value={"Electrical and Computer Engineering"} />
                      <option value={"Engineering Science and Mechanics"} />
                      <option value={"Environmental Engineering"} />
                      <option
                        value={"Geographic Information Science and Technology"}
                      />
                      <option value={"Global Economics and Modern Languages"} />
                      <option value={"Global Media and Cultures"} />
                      <option value={"Health Systems"} />
                      <option value={"History, Technology, and Society"} />
                      <option
                        value={
                          "History and Sociology of Technology and Science"
                        }
                      />
                      <option value={"Human-Computer Interaction"} />
                      <option value={"Human-Centered Computing"} />
                      <option value={"Industrial Design"} />
                      <option value={"Industrial Engineering"} />
                      <option value={"International Affairs"} />
                      <option
                        value={"International Affairs and Modern Languages"}
                      />
                      <option
                        value={"International Affairs, Science, and Technology"}
                      />
                      <option value={"International Logistics"} />
                      <option value={"International Security"} />
                      <option value={"Literature, Media, and Communication"} />
                      <option value={"Machine Learning"} />
                      <option value={"Management"} />
                      <option value={"Materials Science and Engineering"} />
                      <option value={"Mathematics"} />
                      <option value={"Mechanical Engineering"} />
                      <option value={"Medical Physics"} />
                      <option value={"Music Technology"} />
                      <option value={"Neuroscience"} />
                      <option value={"Nuclear Engineering"} />
                      <option value={"Nuclear and Radiological Engineering"} />
                      <option value={"Ocean Science and Engineering"} />
                      <option value={"Operations Research"} />
                      <option value={"Physics"} />
                      <option value={"Psychology"} />
                      <option value={"Public Policy"} />
                      <option value={"Quantitative Biosciences"} />
                      <option
                        value={"Quantitative and Computational Finance"}
                      />
                      <option value={"Real Estate Development"} />
                      <option value={"Robotics"} />
                      <option value={"Statistics"} />
                      <option value={"Supply Chain Engineering"} />
                      <option
                        value={
                          "Sustainable Energy and Environmental Management"
                        }
                      />
                      <option value={"Urban Design"} />
                      <option value={"Urban Analytics"} />
                    </datalist>
                  </div>
                  <div className={styles.Datalist}>
                    <input
                      list="minor-list"
                      id="minor-choice"
                      name="minor-choice"
                      placeholder=" "
                      onChange={handleChange_minor}
                    />
                    <label htmlFor="minor-choice">
                      What is your minor (if applicable)?
                    </label>
                    <datalist id="minor-list">
                      <option value={"Aerospace Engineering"} />
                      <option
                        value={"Algorithms, Combinatorics, and Optimization"}
                      />
                      <option value={"Analytics"} />
                      <option
                        value={"Applied Languages and Intercultural Studies"}
                      />
                      <option value={"Applied Physics"} />
                      <option value={"Applied Physiology"} />
                      <option value={"Architecture"} />
                      <option value={"Biochemistry"} />
                      <option value={"Bioengineering"} />
                      <option value={"Bioinformatics"} />
                      <option value={"Biology"} />
                      <option value={"Biomedical Engineering"} />
                      <option value={"Biomedical Innovation and Development"} />
                      <option value={"Building Construction"} />
                      <option
                        value={"Building Construction and Facility Management"}
                      />
                      <option value={"Business Administration"} />
                      <option value={"Chemical and Biomolecular Engineering"} />
                      <option value={"Chemical Engineering"} />
                      <option value={"Chemistry"} />
                      <option value={"City and Regional Planning"} />
                      <option value={"Civil Engineering"} />
                      <option value={"Computational Media"} />
                      <option value={"Computational Science and Engineering"} />
                      <option value={"Computer Engineering"} />
                      <option value={"Computer Science"} />
                      <option value={"Cybersecurity"} />
                      <option value={"Digital Media"} />
                      <option value={"Earth and Atmospheric Sciences"} />
                      <option value={"Economics"} />
                      <option value={"Economics and International Affairs"} />
                      <option value={"Electrical Engineering"} />
                      <option value={"Electrical and Computer Engineering"} />
                      <option value={"Engineering Science and Mechanics"} />
                      <option value={"Environmental Engineering"} />
                      <option
                        value={"Geographic Information Science and Technology"}
                      />
                      <option value={"Global Economics and Modern Languages"} />
                      <option value={"Global Media and Cultures"} />
                      <option value={"Health Systems"} />
                      <option value={"History, Technology, and Society"} />
                      <option
                        value={
                          "History and Sociology of Technology and Science"
                        }
                      />
                      <option value={"Human-Computer Interaction"} />
                      <option value={"Human-Centered Computing"} />
                      <option value={"Industrial Design"} />
                      <option value={"Industrial Engineering"} />
                      <option value={"International Affairs"} />
                      <option
                        value={"International Affairs and Modern Languages"}
                      />
                      <option
                        value={"International Affairs, Science, and Technology"}
                      />
                      <option value={"International Logistics"} />
                      <option value={"International Security"} />
                      <option value={"Literature, Media, and Communication"} />
                      <option value={"Machine Learning"} />
                      <option value={"Management"} />
                      <option value={"Materials Science and Engineering"} />
                      <option value={"Mathematics"} />
                      <option value={"Mechanical Engineering"} />
                      <option value={"Medical Physics"} />
                      <option value={"Music Technology"} />
                      <option value={"Neuroscience"} />
                      <option value={"Nuclear Engineering"} />
                      <option value={"Nuclear and Radiological Engineering"} />
                      <option value={"Ocean Science and Engineering"} />
                      <option value={"Operations Research"} />
                      <option value={"Physics"} />
                      <option value={"Psychology"} />
                      <option value={"Public Policy"} />
                      <option value={"Quantitative Biosciences"} />
                      <option
                        value={"Quantitative and Computational Finance"}
                      />
                      <option value={"Real Estate Development"} />
                      <option value={"Robotics"} />
                      <option value={"Statistics"} />
                      <option value={"Supply Chain Engineering"} />
                      <option
                        value={
                          "Sustainable Energy and Environmental Management"
                        }
                      />
                      <option value={"Urban Design"} />
                      <option value={"Urban Analytics"} />
                    </datalist>
                  </div>
                  <InputField
                    type={"email"}
                    placeholder="What is your GT email address?"
                    name="Email"
                    width="100%"
                    pattern="\S+@gatech.edu"
                    validIndication
                    required
                    onChange={handleChange_gtemail}
                  />
                  <InputField
                    type={"email"}
                    placeholder="What is your personal email address? (optional)"
                    name="PersonalEmail"
                    width="100%"
                    required={false}
                    onChange={handleChange_personalemail}
                  />
                  {/* new member? */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      Are you a new member?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="member"
                      id="new-member"
                      data-value={true}
                      onChange={handleChange_newmember}
                    />
                    <label htmlFor="new-member">Yes</label>
                    <br />

                    <input
                      type="radio"
                      name="member"
                      id="existing-member"
                      data-value={false}
                      onChange={handleChange_newmember}
                    />
                    <label htmlFor="existing-member">
                      No, I'm already a member of DSGT
                    </label>
                  </div>
                  {/* what year of study? */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      What is your current year of study?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="study-year"
                      id="year-one"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-one">1st Year</label>
                    <br />

                    <input
                      type="radio"
                      name="study-year"
                      id="year-two"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-two">2nd Year</label>
                    <br />

                    <input
                      type="radio"
                      name="study-year"
                      id="year-three"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-three">3rd Year</label>
                    <br />

                    <input
                      type="radio"
                      name="study-year"
                      id="year-four"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-four">4th Year</label>
                    <br />

                    <input
                      type="radio"
                      name="study-year"
                      id="year-five"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-five">5th Year+</label>
                    <br />

                    <input
                      type="radio"
                      name="study-year"
                      id="year-masters-phd"
                      onChange={handleChange_studyyear}
                    />
                    <label htmlFor="year-masters-phd">
                      Masters/PhD Student
                    </label>
                    <br />
                  </div>
                  {/* GENDER */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      What is your gender?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="gender"
                      id="gender-female"
                      onChange={handleChange_genderRadio}
                    />
                    <label htmlFor="gender-female">Female</label>
                    <br />

                    <input
                      type="radio"
                      name="gender"
                      id="gender-male"
                      onChange={handleChange_genderRadio}
                    />
                    <label htmlFor="gender-male">Male</label>
                    <br />

                    <input
                      type="radio"
                      name="gender"
                      id="gender-prefer-none"
                      onChange={handleChange_genderRadio}
                    />
                    <label htmlFor="gender-prefer-none">
                      Prefer not to say
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="gender"
                      id="gender-other"
                      onChange={handleChange_genderRadio}
                      data-value="other"
                    />
                    <label htmlFor="gender-other">
                      Other:{" "}
                      <input
                        className={styles.InlineInput}
                        type={"text"}
                        placeholder=" "
                        autoComplete="gender"
                        onChange={handleChange_genderOther}
                      />
                    </label>
                    <br />
                  </div>
                  {/* Ethnicity */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      What is your ethnicity?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-AIAN"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-AIAN">
                      American Indian or Alaska Native
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-AA"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-AA">
                      Black or African American
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-EA"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-EA">East Asian</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-Latino"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-Latino">Hispanic or Latino</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-ME"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-ME">Middle Eastern</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-Hawaii"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-Hawaii">
                      Native Hawaiian or Other Pacific Islander
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-SA"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-SA">South Asian</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-SEA"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-SEA">Southeast Asian</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-white"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-white">White</label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-prefer-none"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-prefer-none">
                      Prefer not to say
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="ethnicity"
                      id="ethnicity-other"
                      data-value="other"
                      onChange={handleChange_ethnicityRadio}
                    />
                    <label htmlFor="ethnicity-other">
                      Other:{" "}
                      <input
                        className={styles.InlineInput}
                        type={"text"}
                        placeholder=" "
                        autoComplete="ethnicity"
                        onChange={handleChange_ethnicityOther}
                      />
                    </label>
                    <br />
                  </div>
                  {/* Instate? */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      Are you an in-state, out-of-state, or international
                      student?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="location"
                      id="location-IS"
                      onChange={handleChange_location}
                    />
                    <label htmlFor="location-IS">In-state</label>
                    <br />

                    <input
                      type="radio"
                      name="location"
                      id="location-OOS"
                      onChange={handleChange_location}
                    />
                    <label htmlFor="location-OOS">Out-of-state</label>
                    <br />

                    <input
                      type="radio"
                      name="location"
                      id="location-International"
                      onChange={handleChange_location}
                    />
                    <label htmlFor="location-International">
                      International
                    </label>
                    <br />
                  </div>
                  {/* Experience */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      How much Data Science experience would you say you have?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="experience"
                      id="experience-none"
                      onChange={handleChange_experience}
                    />
                    <label htmlFor="experience-none">No experience</label>
                    <br />

                    <input
                      type="radio"
                      name="experience"
                      id="experience-beginner"
                      onChange={handleChange_experience}
                    />
                    <label htmlFor="experience-beginner">
                      Beginner (familiar with Data Science/just started learning
                      about it)
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="experience"
                      id="experience-intermediate"
                      onChange={handleChange_experience}
                    />
                    <label htmlFor="experience-intermediate">
                      Intermediate (have worked with/taken a class in least one
                      branch of Data Science)
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="experience"
                      id="experience-advanced"
                      onChange={handleChange_experience}
                    />
                    <label htmlFor="experience-advanced">
                      Advanced (have professional experience or worked with
                      multiple branches of Data Science)
                    </label>
                    <br />

                    <input
                      type="radio"
                      name="experience"
                      id="experience-expert"
                      onChange={handleChange_experience}
                    />
                    <label htmlFor="experience-expert">
                      Expert (have multiple/many years of experience with Data
                      Science)
                    </label>
                    <br />
                  </div>
                  {/* Interests */}
                  <div className={styles.Checkbox}>
                    <p className={styles.Mini}>
                      What branch of Data Science are you interested in learning
                      about (you may choose more than one)?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-CS"
                      onChange={handleChange_interestsCheckbox}
                    />
                    <label htmlFor="interests-CS">
                      Computer Science/Programming
                    </label>
                    <br />

                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-DA"
                      onChange={handleChange_interestsCheckbox}
                    />
                    <label htmlFor="interests-DA">Data Analysis</label>
                    <br />

                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-DV"
                      onChange={handleChange_interestsCheckbox}
                    />
                    <label htmlFor="interests-DV">Data Visualization</label>
                    <br />

                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-ML"
                      onChange={handleChange_interestsCheckbox}
                    />
                    <label htmlFor="interests-ML">Machine Learning</label>
                    <br />

                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-Stats"
                      onChange={handleChange_interestsCheckbox}
                    />
                    <label htmlFor="interests-Stats">Statistics</label>
                    <br />

                    <input
                      type="checkbox"
                      name="interests"
                      id="interests-other"
                      onChange={handleChange_interestsOtherCheckbox}
                    />
                    <label htmlFor="interests-other">
                      Other:{" "}
                      <input
                        className={styles.InlineInput}
                        type={"text"}
                        placeholder=" "
                        autoComplete="interests"
                        onChange={handleChange_interestsOtherInput}
                      />
                    </label>
                    <br />
                  </div>
                  {/* Hear About */}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      How did you hear about DSGT?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-word"
                      onChange={handleChange_hearaboutRadio}
                    />
                    <label htmlFor="hearabout-word">Word of mouth</label>
                    <br />
                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-reddit"
                      onChange={handleChange_hearaboutRadio}
                    />
                    <label htmlFor="hearabout-reddit">Reddit</label>
                    <br />
                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-instagram"
                      onChange={handleChange_hearaboutRadio}
                    />
                    <label htmlFor="hearabout-instagram">Instagram</label>
                    <br />
                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-tabling"
                      onChange={handleChange_hearaboutRadio}
                    />
                    <label htmlFor="hearabout-tabling">Tabling</label>
                    <br />
                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-kickoff"
                      onChange={handleChange_hearaboutRadio}
                    />
                    <label htmlFor="hearabout-kickoff">Kickoff</label>
                    <br />

                    <input
                      type="radio"
                      name="hearabout"
                      id="hearabout-other"
                      onChange={handleChange_hearaboutRadio}
                      data-value="other"
                    />
                    <label htmlFor="hearabout-other">
                      Other:{" "}
                      <input
                        className={styles.InlineInput}
                        type={"text"}
                        placeholder=" "
                        autoComplete="hearabout"
                        onChange={handleChange_hearaboutOther}
                      />
                    </label>
                    <br />
                  </div>

                  {/* Email Consent*/}
                  <div className={styles.Radio}>
                    <p className={styles.Mini}>
                      Do you consent to being on the DSGT mailing list?
                      <span className={styles.Required}>*</span>
                    </p>
                    <input
                      type="radio"
                      name="emailconsent"
                      id="emailconsent-yes"
                      data-value={true}
                      onChange={handleChange_emailconsentRadio}
                    />
                    <label htmlFor="emailconsent-yes">Yes</label>
                    <br />
                    <input
                      type="radio"
                      name="emailconsent"
                      id="emailconsent-no"
                      data-value={false}
                      onChange={handleChange_emailconsentRadio}
                    />
                    <label htmlFor="emailconsent-no">No</label>
                  </div>
                  <ErrorText>{error}</ErrorText>
                  <FlexRow spacing="flex-end" width="100%">
                    <InputField
                      type={"submit"}
                      placeholder="Continue"
                      width="fit-content"
                    />
                  </FlexRow>
                </FlexColumn>
              </form>
            )}
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 1) {
    //---------------------------- screen 1 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen1}>
              <FlexColumn width="100%">
                {/* list of opportunities */}
                <div className={styles.ContentBlock}>
                  <h1 className={"Major"}>Get Involved!</h1>
                  <p>
                    Which DSGT opportunities are you interested in for this
                    semester? You must participate in at least one opportunity
                    below to be an active member in the club:
                    <br />
                    <br />
                    - Projects <br />
                    - Bootcamp <br />
                    - Leadership team <br />
                    <br />
                    You'll have the chance to select multiple opportunities if
                    you're interested!
                    <br />
                  </p>
                </div>
                {/* Projects */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Are you interested in projects?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="projects"
                    id="projects-yes"
                    data-value={"true"}
                    onChange={handleChange_interestedprojects}
                  />
                  <label htmlFor="projects-yes">Yes</label>
                  <br />

                  <input
                    type="radio"
                    name="projects"
                    id="projects-no"
                    data-value={"false"}
                    onChange={handleChange_interestedprojects}
                  />
                  <label htmlFor="projects-no">No</label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 2) {
    //---------------------------- screen 2 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen2}>
              <FlexColumn width="100%">
                {/* list of opportunities */}
                <div className={styles.ContentBlock}>
                  <h1 className={"Major"}>Projects</h1>
                  <p>
                    Please answer the questions below if you would like to apply
                    to join a DSGT project! There are two avenues for projects:
                    1. Application oriented Projects 2. Research Projects.
                    Application oriented Projects are those that focus on
                    exploring a dataset or collect data and attempt to create
                    something that solves a problem in a way that faces a user
                    directly. Research projects attempt to tackle unanswered
                    questions that are actively being researched or try to
                    develop new ways different from the current standard of
                    solving a problem.
                    <br />
                    <br />
                    Our typical member is passionate about the project they are
                    on, and willing to put in effort and learn new skills.
                    <br />
                    <br />
                    We currently have four active projects:
                    <br />
                    <br />
                    1. Mentra: Mentra is a startup looking to build a hiring
                    platform for neurodiverse talent. Our data science team
                    focuses on using natural language processing and statistical
                    techniques to connect neurodiverse individuals with suitable
                    jobs.
                    <br />
                    2. Stormalytics
                    <br />
                    3. Audio Segmentation Team
                    <br />
                    4. Marketing Campaign Analysis
                    <br />
                    <br />
                    We are open to you starting your own projects as well! If
                    you are willing to start your own project, please indicate
                    in the form below and reach out to Pulak Agarwal on the DSGT
                    Slack workspace.
                    <br />
                    <br />
                    We will be conducting interviews based on your responses and
                    observe what team you would be a suitable fit for!
                    <br />
                  </p>
                </div>
                {/* Part of Projects */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Have you been part of a DSGT project before?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="part-projects"
                    id="part-projects-yes"
                    data-value={"true"}
                    checked={partOfProject === "true"}
                    onChange={handleChange_partproject}
                  />
                  <label htmlFor="part-projects-yes">Yes</label>
                  <br />

                  <input
                    type="radio"
                    name="part-projects"
                    id="part-projects-no"
                    data-value={"false"}
                    checked={partOfProject === "false"}
                    onChange={handleChange_partproject}
                  />
                  <label htmlFor="part-projects-no">No</label>
                  <br />
                </div>
                {/* interested in participating in a project? */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Are you interested in participating in a DSGT Project?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="interested-participating-projects"
                    id="interested-participating-projects-yes"
                    data-value={"true"}
                    onChange={handleChange_interestedparticipatingprojects}
                  />
                  <label htmlFor="interested-participating-projects-yes">
                    Yes
                  </label>
                  <br />

                  <input
                    type="radio"
                    name="interested-participating-projects"
                    id="interested-participating-projects-no"
                    data-value={"false"}
                    onChange={handleChange_interestedparticipatingprojects}
                  />
                  <label htmlFor="interested-participating-projects-no">
                    No
                  </label>
                  <br />
                </div>
                {/* what projects interested in */}
                <div className={styles.Checkbox}>
                  <p className={styles.Mini}>
                    What project(s) are you interested in?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="checkbox"
                    name="interests-projects"
                    id="interests-projects-mentra"
                    onChange={handleChange_interestsProjectsCheckbox}
                  />
                  <label htmlFor="interests-projects-mentra">Mentra</label>
                  <br />

                  <input
                    type="checkbox"
                    name="interests-projects"
                    id="interests-projects-Stormalytics"
                    onChange={handleChange_interestsProjectsCheckbox}
                  />
                  <label htmlFor="interests-projects-Stormalytics">
                    Stormalytics
                  </label>
                  <br />

                  <input
                    type="checkbox"
                    name="interests-projects"
                    id="interests-projects-AS"
                    onChange={handleChange_interestsProjectsCheckbox}
                  />
                  <label htmlFor="interests-projects-AS">
                    Audio Segmentation
                  </label>
                  <br />

                  <input
                    type="checkbox"
                    name="interests-projects"
                    id="interests-projects-MCA"
                    onChange={handleChange_interestsProjectsCheckbox}
                  />
                  <label htmlFor="interests-projects-MCA">
                    Marketing Campaign Analysis
                  </label>
                  <br />

                  <input
                    type="checkbox"
                    name="interests-projects"
                    id="interests-projects-own"
                    onChange={handleChange_interestsProjectsCheckbox}
                  />
                  <label htmlFor="interests-projects-own">
                    Make your own project!
                  </label>
                  <br />
                </div>
                {/* hours for projects? */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Realistically, in an average week, how much time would you
                    be willing to dedicate to a DSGT project?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-1"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-1">{"<1 hour"}</label>
                  <br />
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-2"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-2">{"1-2 hours"}</label>
                  <br />
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-3"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-3">{"2-4 hours"}</label>
                  <br />
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-4"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-4">{"4-6 hours"}</label>
                  <br />
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-5"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-5">{"6-10 hours"}</label>
                  <br />
                  <input
                    type="radio"
                    name="hours-projects"
                    id="hours-projects-6"
                    onChange={handleChange_hoursprojects}
                  />
                  <label htmlFor="hours-projects-6">{">10 hours"}</label>
                  <br />
                </div>
                {/* meetings */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    We have meetings Wednesdays at 6pm. Are you available at
                    this time? Attendance is required
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="projects-meetings"
                    id="projects-meetings-yes"
                    data-value={"true"}
                    onChange={handleChange_projectsmeetings}
                  />
                  <label htmlFor="projects-meetings-yes">yes</label>
                  <br />
                  <input
                    type="radio"
                    name="projects-meetings"
                    id="projects-meetings-no"
                    data-value={"false"}
                    onChange={handleChange_projectsmeetings}
                  />
                  <label htmlFor="projects-meetings-no">no</label>
                  <br />
                </div>
                {/* uploaded resume */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Please upload your resume{" "}
                    <a
                      className={styles.InlineLink}
                      href="https://forms.gle/7nWcCpimq6x291vD8"
                    >
                      here
                    </a>
                    .
                    <br /> Did you submit your resume?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="projects-resume"
                    id="projects-resume-yes"
                    data-value={"true"}
                    onChange={handleChange_projectsresume}
                  />
                  <label htmlFor="projects-resume-yes">yes</label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 3) {
    //---------------------------- screen 3 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen3}>
              <FlexColumn width="100%">
                {/* list of opportunities */}
                <div className={styles.ContentBlock}>
                  <h1 className={"Major"}>Get Involved!</h1>
                  <p>
                    Which DSGT opportunities are you interested in for this
                    semester? You must participate in at least one opportunity
                    below to be an active member in the club:
                    <br />
                    <br />
                    - Projects <br />
                    - Bootcamp <br />- Leadership team
                  </p>
                </div>
                {/* Bootcamp */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Are you interested in bootcamp?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="bootcamp"
                    id="bootcamp-yes"
                    data-value="true"
                    checked={interestedBootcamp === "true"}
                    onChange={handleChange_interestedbootcamp}
                  />
                  <label htmlFor="bootcamp-yes">Yes</label>
                  <br />

                  <input
                    type="radio"
                    name="bootcamp"
                    id="bootcamp-no"
                    data-value="false"
                    checked={interestedBootcamp === "false"}
                    onChange={handleChange_interestedbootcamp}
                  />
                  <label htmlFor="bootcamp-no">No</label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 4) {
    //---------------------------- screen 4 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen4}>
              <FlexColumn width="100%">
                {/* list of opportunities */}
                <div className={styles.ContentBlock}>
                  <h1 className={"Major"}>Bootcamp</h1>
                  <p>
                    Please answer the questions below if you would like to apply
                    for our bootcamp program!
                    <br />
                    <br />
                    NOTE: This semester, we are offering both our in-person
                    bootcamp as well as a new self-paced Udemy course that
                    covers a similar curriculum. Our in-person bootcamp consists
                    of biweekly workshops (held every other Monday at 6:30 PM
                    EST) and a team project component, while the Udemy course is
                    fully self-guided and will not include the opportunity to
                    work with other bootcamp students on a project. If you
                    indicate that you are applying to both in-person bootcamp
                    and our self-paced Udemy course, we will first consider you
                    for in-person bootcamp and then for our Udemy course.
                    <br />
                    <br />
                    More information about our in-person bootcamp and Udemy
                    course can be found{" "}
                    <a
                      className={styles.InlineLink}
                      href="https://dsgtbootcamp.netlify.app/options"
                    >
                      here
                    </a>
                    .
                  </p>
                </div>
                {/* which bootcamp applying to? */}
                <div className={styles.Checkbox}>
                  <p className={styles.Mini}>
                    I am applying to (may select one or both options)
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="checkbox"
                    name="interests-bootcamp"
                    id="interests-bootcamp-IP"
                    onChange={handleChange_interestsBootcampCheckbox}
                  />
                  <label htmlFor="interests-bootcamp-IP">
                    In-person bootcamp
                  </label>
                  <br />
                  <input
                    type="checkbox"
                    name="interests-bootcamp"
                    id="interests-bootcamp-SP"
                    onChange={handleChange_interestsBootcampCheckbox}
                  />
                  <label htmlFor="interests-bootcamp-SP">
                    Self-paced Udemy bootcamp course
                  </label>
                  <br />
                </div>
                {/* meetings */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    (If applying to in-person bootcamp) Are you available on
                    Mondays at 6:30pm for our meetings? Attendance is required
                  </p>
                  <input
                    type="radio"
                    name="bootcamp-meetings"
                    id="bootcamp-meetings-yes"
                    data-value={"true"}
                    onChange={handleChange_bootcampmeetings}
                  />
                  <label htmlFor="bootcamp-meetings-yes">yes</label>
                  <br />
                  <input
                    type="radio"
                    name="bootcamp-meetings"
                    id="bootcamp-meetings-no"
                    data-value={"false"}
                    onChange={handleChange_bootcampmeetings}
                  />
                  <label htmlFor="bootcamp-meetings-no">no</label>
                  <br />
                </div>
                {/* bootcamp consent */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Bootcamp sessions may be recorded and shared with DSGT
                    members. By attending, I consent to the recording of
                    bootcamp sessions.
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="bootcamp-consent"
                    id="bootcamp-consent-yes"
                    data-value={"true"}
                    onChange={handleChange_bootcampconsent}
                  />
                  <label htmlFor="bootcamp-consent-yes">I agree</label>
                  <br />
                </div>
                {/* bootcamp data consent */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Do you consent to us recording your data during meetings for
                    recruitment and marketing opportunities? (Including
                    Photos/Videos)
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="bootcamp-consent-data"
                    id="bootcamp-consent-data-yes"
                    data-value={"true"}
                    onChange={handleChange_bootcampdataconsent}
                  />
                  <label htmlFor="bootcamp-consent-data-yes">Yes</label>
                  <br />

                  <input
                    type="radio"
                    name="bootcamp-consent-data"
                    id="bootcamp-consent-data-no"
                    data-value={"false"}
                    onChange={handleChange_bootcampdataconsent}
                  />
                  <label htmlFor="bootcamp-consent-data-no">No</label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 5) {
    //---------------------------- screen 5 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen5}>
              <FlexColumn width="100%">
                {/* list of opportunities */}
                <div className={styles.ContentBlock}>
                  <h1 className={"Major"}>Get Involved!</h1>
                  <p>
                    Which DSGT opportunities are you interested in for this
                    semester? You must participate in at least one opportunity
                    below to be an active member in the club:
                    <br />
                    <br />
                    - Projects <br />
                    - Bootcamp <br />- Leadership team
                  </p>
                </div>
                {/* leadership */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Are you interested in joining our leadership team?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="leadership"
                    id="leadership-yes"
                    data-value="true"
                    onChange={handleChange_interestedleadership}
                    checked={interestedLeadership === "true"}
                  />
                  <label htmlFor="leadership-yes">Yes</label>
                  <br />

                  <input
                    type="radio"
                    name="leadership"
                    id="leadership-no"
                    data-value="false"
                    onChange={handleChange_interestedleadership}
                    checked={interestedLeadership === "false"}
                  />
                  <label htmlFor="leadership-no">No</label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else if (emailVerified && screen === 6) {
    //---------------------------- screen 6 ----------------------------
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow spacing="center" align="center" height="100vh" padding="1em">
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <form onSubmit={handleFormSubmitScreen6}>
              <FlexColumn width="100%">
                {/* leadership team */}
                <div className={styles.ContentBlock}>
                  <h1 className={styles.Major}>Leadership Team</h1>
                </div>
                {/* leadership status */}
                <div className={styles.Radio}>
                  <p className={styles.Mini}>
                    Are you currently on our leadership team?
                    <span className={styles.Required}>*</span>
                  </p>
                  <input
                    type="radio"
                    name="leadership-status"
                    id="leadership-status-yes-keep"
                    onChange={handleChange_leadershipstatus}
                  />
                  <label htmlFor="leadership-status-yes-keep">
                    Yes, and I would like to keep my existing position
                  </label>
                  <br />
                  <input
                    type="radio"
                    name="leadership-status"
                    id="leadership-status-yes-new"
                    onChange={handleChange_leadershipstatus}
                  />
                  <label htmlFor="leadership-status-yes-new">
                    Yes, but I would like to apply for a new position
                  </label>
                  <br />
                  <input
                    type="radio"
                    name="leadership-status"
                    id="leadership-status-no"
                    onChange={handleChange_leadershipstatus}
                  />
                  <label htmlFor="leadership-status-no">
                    No, but I would like to apply
                  </label>
                  <br />
                </div>
                <ErrorText>{error}</ErrorText>
                <FlexRow spacing="flex-end" width="100%">
                  <InputField
                    type={"submit"}
                    placeholder="Continue"
                    width="fit-content"
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </div>
        </FlexRow>
      </div>
    );
  } else {
    //show the payment initialization screen
    //-- Link to the stripe payment service
    return (
      <div className={styles.Register} data-testid="Register">
        <FlexRow
          width="100%"
          height="100vh"
          spacing="center"
          align="center"
          padding="1em"
        >
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <FlexColumn width="100%">
              {/* <h1 className={styles.Major}>Register</h1> */}
              <h2 className={styles.Minor}>
                In order to become a registered member of DSGT, you first need
                to pay the membership dues.
              </h2>
              <div className={styles.Divider}></div>
              <p className={styles.Mini}>
                Accepting new members for the Spring 2025 semester! After paying
                the dues, your account will automatically be activated. Make
                sure to use the email associated with your previous account on
                Stripe. Click{" "}
                <a className={styles.LinkText} href="/register">
                  here
                </a>{" "}
                to pay dues. For help, please email{" "}
                <a
                  className={styles.LinkText}
                  href="mailto:lvivekan3@gatech.edu"
                >
                  lvivekan3@gatech.edu
                </a>
                . Welcome to the DSGT Family!
              </p>
              <a
                className={styles.Link}
                href="https://buy.stripe.com/aEUbKAeO80T19GgcMP"
              >
                Pay semesterly dues on Stripe ($15/sem) →
              </a>
              <a
                className={styles.Link}
                href="https://buy.stripe.com/fZe8yo8pK45d7y85kq"
              >
                Pay annual dues on Stripe ($25/year) →
              </a>
              <a
                className={styles.Link2}
                href="/register?payment_status=completed"
              >
                Already Paid? Continue Registration →
              </a>
            </FlexColumn>
          </div>
        </FlexRow>
      </div>
    );
  }
};

export default Register;

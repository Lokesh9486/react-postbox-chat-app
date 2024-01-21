import "../styles/pages/signup.scss";
import { useEffect, useState } from "react";
import registerSubmit from "../utils/forSubmit";
import { useSignUpMutation } from "../services/authApi";
// import { useRouter } from 'next/navigation'
import AuthStructure from "../HOC/AuthStructure";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState([
    {
      id: "firstName",
      type: "text",
      label: "First Name",
      value: "",
      image: "nameIcon",
      error: false,
      errMessage: "First Name must contain 3-15 character",
    },
    {
      id: "lasttName",
      type: "text",
      label: "Last Name",
      value: "",
      image: "nameIcon",
      error: false,
      errMessage: "Last Name must contain 3-15 character",
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      value: "",
      image: "email",
      error: false,
      errMessage: "Please enter proper email address",
    },
    {
      id: "password",
      type: "password",
      label: "Passsword",
      value: "",
      image: "eye",
      error: false,
      errMessage: "Password must contain 8-15 character",
    },
  ]);

  const routes=useNavigate();

  const [signUp, {data, isSuccess,isLoading,error,isError }] = useSignUpMutation();

  function formSubmitFunc(e) {
    const errorValu = registerSubmit(e, formData, setFormData).every(
      ({ error }) => !error
    );
    if (errorValu) {
      signUp({
        firstName: formData[0].value,
        lastName: formData[1].value,
        email: formData[2].value,
        password: formData[3].value,
      });
    }
  }

  useEffect(() => {
    if (isSuccess){
      localStorage.setItem("postman",JSON.stringify({email:formData[2].value,OTP:data.OTPExpries}));
      dispatch(emailAction(formData[2].value));
      setTimeout(()=>routes.push('/otp'),1000);
    }
  },[isSuccess]);

  const option={
    signUp,
    formData,
    setFormData,
    formSubmitFunc,
    data, 
    isSuccess,
    error,
    isError,
    message:"Registered Successfully",
    topic:"Create new account.",
    subtopic:"Already have a Account?",
    navigateTo:"/signin",
    navDiscribe:"Log In"
  }

  return (
    <AuthStructure {...option}/>
  );
};

export default Signup;

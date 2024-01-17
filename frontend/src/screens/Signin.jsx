import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSignInMutation } from "../services/authApi";
import registerSubmit from "../utils/forSubmit";
import { chatApi } from "../services/chatApi";
import AuthStructure from "../HOC/AuthStructure";

const SignIn = () => {
    const [formData, setFormData] = useState([
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
    const dispatch=useDispatch();
  
    const [signin, {data, isSuccess,isLoading,error,isError }] = useSignInMutation();
  
    function formSubmitFunc(e) {
      const errorValu = registerSubmit(e, formData, setFormData).every(
        ({ error }) => !error
      );
      if (errorValu) {
        signin({
          email: formData[0].value,
          password: formData[1].value,
        });
      }
    }
  
    useEffect(() => {
      if (data){
        document.cookie = `token= ${data.token}; expires= ${new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ) }; path=/;`;
        if(data?.message===`Login successfully and OTP send ${formData[0].value}`){
          localStorage.setItem("postman",JSON.stringify({email:formData[0].value,OTP:data.user.OTPExpries}));
          setTimeout(()=>routes.push('/otp'),1000);
        }
        else{
          dispatch(chatApi.util.invalidateTags(['User']))
          setTimeout(()=>{
            routes.push('/chat')
          },1000);
        }
      }
    },[isSuccess]);
  
  
    const option={
      isSignIn:true,
      formData,
      setFormData,
      formSubmitFunc,
      data, 
      isSuccess,
      error,
      isError,
      message:data?.message||"Login Successfully",
      topic:"Already have a Account",
      subtopic:"Create new account.",
      navigateTo:"/signup",
      navDiscribe:"Sign up"
    }
  
    return (
      <AuthStructure {...option}/>
    );
  };

  export default SignIn;
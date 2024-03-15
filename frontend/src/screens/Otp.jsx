import { useNavigate } from "react-router-dom";
import "../styles/pages/otp.scss";
import { Logo } from "../components/Logo";
import { useState } from "react";
import { useEffect } from "react";
import { useOtpVerificationMutation, useResendOTPMutation } from "../services/authApi";
import SuccessMsg from "../components/SuccessMsg";


const Otp = () => {
  const navigate = useNavigate();
// if(!localStorage.getItem("postman")) return redirect("/signup");
// const {email,OTP}=JSON.parse(localStorage.getItem("postman"));
// if(!email||!OTP)return redirect("/signup");

  const [time,setTime]=useState({min:0,sec:0});
  const [code, setcode] = useState(new Array(6).fill(""));
  const [email,setEmail]=useState();
  const [formSubmit,setFormSubmit]=useState(false);
  const [otpVerification,{data,isSuccess,isError,error}]=useOtpVerificationMutation();
  const [resendOTP,{data:resendOTPData}]=useResendOTPMutation();

  const handleChange = (element, index) => {
    if (isNaN(element.target.value)) return false;

    setcode([...code.map((d, indx) => (indx === index ? element.target.value : d))]);

    if (element.target.value&&element.target.nextSibling) {
      element.target.nextSibling.focus();
    }
  };

  const keyUpFunc = (e, index) => {

    if (!e.target.value&&(e.key === "Delete" || e.key === "Backspace")) {
     if(index){
        return e.target.form.elements[index-1].focus()
     }
    }
  };

  const formSubmitFunc=(e)=>{
    e.preventDefault();
    setFormSubmit(true);
    if(code.every(key=>key!=="")){
      otpVerification({email,otp:code.reduce((string,data)=>string+=data.toString(),"")});
    }
  };

  useEffect(() =>{
    if(!localStorage.getItem("postman")) return navigate("/signup");
        const {email,OTP}=JSON.parse(localStorage.getItem("postman"));
        if(!email||!OTP)return navigate("/signup");
        setEmail(email);
        const gettedDate=new Date(OTP);
        const interval= setInterval(() =>{
         const curretnDate=new Date();
         const diffMs=gettedDate.getTime() - curretnDate.getTime();
         if (diffMs<=0){return clearInterval(interval)}
         const min = ~~+(diffMs / (1000 * 60) % 60);
         const sec = ~~+(diffMs / (1000) % 60); 
         setTime({min,sec});
      } , 1000);

   return()=>{
    clearInterval(interval);
    localStorage.removeItem("postman");
  }
  },[]);

  useEffect(()=>{
    if(isSuccess){
      // setCookie('token', data.token,{maxAge: 7 * 24 * 60 * 60 * 1000,path:"/"  });
      // document.cookie = `token= ${data.token}; expires= ${new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ) }; path=/;`;
      // localStorage.removeItem("postman");
      setTimeout(()=>navigate('/chat'),1000);
    }
  },[isSuccess]);

  return (
    <section className="otp-section">
      <SuccessMsg isSuccess={isSuccess} message={data?.message}/>
      <Logo />
      <form onSubmit={formSubmitFunc}>
        <div className="otp-input-container">
        {code.map((data, index) => {
          return (
            <input
              //   disabled={second <= 0 ? true : false}
              type="text"
              className={`form-control ${(formSubmit&&!data)?"err-border":""}`}
              name="otp"
              maxLength={1}
              key={index}
              value={data}
              onKeyDown={(e) => keyUpFunc(e, index)}
              onChange={(e) => handleChange(e, index)}
              autoFocus={index === 0}
              onFocus={(e) => e.target.select}
            />
          );
        })}
        </div>
        <div className="position-relative">
      <p>Otp expires in {time.min || "00"}:{time.sec || "00"} </p>
      <button type="button" className="resend_otp_btn" onClick={()=> resendOTP({email:"ABCD@gmail.com"})}>Resend OTP</button>
        </div>
      {isError&&<div className="position-relative">
             <p className="error-msg">{error.data.message}</p>
            </div>}
        <button type="submit" className="primary-btn">Submit</button>
      </form>
    </section>
  );
};

export default Otp;

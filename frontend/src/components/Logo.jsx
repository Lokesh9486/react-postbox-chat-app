// import Image from "next/legacy/image";
import  "../styles/components/logo.scss";
// import { Black_Ops_One } from "next/font/google";

// const black_ops = Black_Ops_One({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
// });

export const Logo = () => {
  return (
    <div className="logo-container">
      <div className="image-container">
      <img src="/images/postboxlogo.png" />
      </div>
      <span className="logo-text">POSTBOX<strong>.</strong></span> 
    </div>
  );
};

import Image from "next/legacy/image";
import  "@/styles/components/logo.scss";
import { Black_Ops_One } from "next/font/google";

const black_ops = Black_Ops_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const Logo = () => {
  return (
    <div className={`${black_ops.className} logo-container`}>
      <div className="image-container">
      <Image src="/images/postboxlogo.png" width="100%" height="100%"  objectFit="contain"/>
      </div>
      <span className="logo-text">POSTBOX<strong>.</strong></span> 
    </div>
  );
};

import Image from "next/legacy/image";
import "@/styles/components/successMsg.scss";
// import  "@/styles/components/logo.scss";
const SucccessMsg = ({isSuccess,message}) => {
  return (
    <div
      className={`message-con ${isSuccess?"active":""}`}
      >
        <div className="image-con">
        <Image src="/images/success.png" width="100%" height="100%"  objectFit="contain"/>
        </div>
        <div>
          <h5>Success</h5>
          <p>{message}</p>
        </div>
        </div>
  )
}

export default SucccessMsg
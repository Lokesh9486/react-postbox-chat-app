// import Image from "next/legacy/image";
import "../styles/components/successMsg.scss";
// import  "@/styles/components/logo.scss";
const SucccessMsg = ({isSuccess,message}) => {
  return (
    <div
      className={`message-con ${isSuccess?"active":""}`}
      >
        <div className="image-con">
        <img src="assets/images/success.png"/>
        </div>
        <div>
          <h5>Success</h5>
          <p>{message}</p>
        </div>
        </div>
  )
}

export default SucccessMsg
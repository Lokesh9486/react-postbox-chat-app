import "../styles/components/anotherUserDetails.scss";

const AnotherUserDetails = ({img,topic,data}) => {
  return <div className="another_userDetails">
  <div className="topic"><img src={img} alt="user-image"/> : {topic}</div>
  <p className="another-email">{data}</p>
 </div> ;
};

export default AnotherUserDetails;
import { Logo } from "../components/Logo";
import {Link} from "react-router-dom";
import "../styles/pages/signup.scss";
import InputField from "../components/InputField";
import SuccessMsg from "../components/SuccessMsg";

const AuthStructure = ({
  isSignIn,
  formData,
  setFormData,
  formSubmitFunc,
  data,
  isSuccess,
  error,
  isError,
  isLoading,
  message,
  navDiscribe,
  navigateTo,
  subtopic,
  topic
}) => {
  function inputChange(idForMatch, value) {
    const filterData = formData.map((item) => {
      if (item.id === idForMatch) {
        item["value"] = value;
        return item;
      }
      return item;
    });
    setFormData(filterData);
  }

  return (
    <section className="signup-section">
      <SuccessMsg isSuccess={isSuccess} message={message} />
      <nav className="top_nav">
        <ul>
          <li>
            <Link to="/">
              <Logo />
            </Link>
          </li>
          <li className="home-li">
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <form onSubmit={formSubmitFunc}>
        <p className="secondary-topic">Start for free</p>
        <h1 className="big-topic">{topic}</h1>
        <p className="common-text">
          {subtopic} <Link to={navigateTo}>{navDiscribe}</Link>{" "}
        </p>
        <div className={`input-container ${isSignIn?"this_is_signIn":""}`}>
          {formData.map((item, index) => (
            <InputField {...{ ...item, inputChange, index }} key={index} />
          ))}
        </div>
        <div className="btn-container">
          <button type="reset" className="reset-btn">
            Reset form
          </button>
          <button type="submit" className="submit-btn">
            {isLoading?
          <img src="assets/images/dotloader.gif" alt="loader" className="loader-img m-auto"/>:
            "Create account"
          }
            {/* Create account */}
          </button>
        </div>
      </form>
      {console.log(error)}
      {isError && (
        <div className="position-relative">
          <p className="error-msg">{error.data.message}</p>
        </div>
      )}
    </section>
  );
};

export default AuthStructure;

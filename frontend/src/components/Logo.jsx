import  "../styles/components/logo.scss";

export const Logo = () => {
  return (
    <div className="logo-container">
      <div className="image-container">
      <img src="assets\images\postboxlogo.png" alt=" postbox"/>
      </div>
      <span className="logo-text">POSTBOX<strong>.</strong></span> 
    </div>
  );
};

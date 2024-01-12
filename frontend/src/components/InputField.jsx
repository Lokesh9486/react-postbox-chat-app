import "@/styles/components/inputField.scss";

const InputField = ({inputChange,...item}) => {
  const {id, type, label, value,image,index,error,errMessage}=item;

  return (
    <div className={`form-floating input-field item${index+1}`}>
      <input
        type={type}
        className={`form-control ${error?"is-invalid":""}`}
        id={id}
        placeholder={label}
        value={value}
        onChange={(e)=> inputChange(id, e.target.value)}
        style={{backgroundImage:!error?`url(images/${image}.png)`:""}}
      />
      <label htmlFor="floatingPassword">{label}</label>
      {error&&<p className="error-messsage">{errMessage}</p>}
    </div>
  );
};

export default InputField;

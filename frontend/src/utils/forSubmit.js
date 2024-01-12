export default function registerSubmit(e,formData,setFormData) {
  e.preventDefault();

  const errorFunc = (patt, value, item) => {
    if (!value?.match(patt)) {
      item["error"] = true;
    } else {
      item["error"] = false;
    }
    return item;
  };

  const errorMap = formData.map((item) => {
    const { type, value } = item;
    if (type === "text") {
      return errorFunc(/[a-zA-Z]{3,15}/, value, item);
    }
    if (type === "email") {
      return errorFunc(
        /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
        value,
        item
      );
    }
    if (type === "password") {
      return errorFunc(/[A-Za-z\d]{8,}/, value, item);
    }
    return item;
  });
  setFormData(errorMap);

  return errorMap;
//   const errorValu = errorMap.every(({ error }) => !error);
//   if (errorValu) {
//     const formData = new FormData();
//     formData.append("name", signUpdetail[0].value);
//     formData.append("email", signUpdetail[1].value);
//     formData.append("password", signUpdetail[2].value);
//     formData.append("profile", proifle);
//     signUp(formData);
//   }
}

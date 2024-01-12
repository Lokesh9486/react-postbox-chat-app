
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // 500 is internal server error
  if(process.env.NODE_ENV=='developement'){
    res.status(err.statusCode).json({
      success:false,
      message:err.message,
      stack: err.stack,
      error:err
    })
  }
  else{
    let message=err.message;
    let error=new Error(message);
    if(err.name=="ValidationError"){
      message=Object.values(err.errors).map(value=>value.message)
      error=new Error(message);
      err.statusCode=400
    }
    if(err.name==="CastError"){
      message=`Resource not found : ${err.path}`; 
      error=new Error(message);
      err.statusCode=400
    }
    if(err.code===11000){
      let message=`Duplicate ${Object.keys(err.keyValue)} error`
      error=new Error(message)
    }
    if(err.name=="JSONWebTokenError"){
      let message=`JSON Web Token is invalid . Try again`;
      error=new Error(message);
    }
    if(err.name=="TokenExpiredError"){
      let message=`JSON Web Token is expired . Try again`;
      error=new Error(message);
    }
    console.log(error.message)
    res.status(err.statusCode).json({
      success:false,
      message:error.message || "Internal Server Error",
    })

  }
};

const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter First Name"],
      maxLength: [20, "First name cannot exceed 20 Characters"],
      minLength: [3, "First name must be at least 3 Characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter Last Name"],
      maxLength: [20, "Last name cannot exceed 20 characters"],
      minLength: [3, "Last name must be at least 3 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter Email address"],
      validate: [emailValidater, "Please enter a valid email address"],
    },
    password: {
      type: String,
      unique: true,
      required: [true, "Please enter Password"],
      maxLength: [15, "Password cannot exceed 15 characters"],
      minLength: [8, "Passwordmust be at least 8 characters"],
      select: false,
    },
    avator: String,
    about: {
      type: String,
      maxLength: [100, "about cannot exceed 100 characters"],
    },
    phoneNumber: {
      type: Number,
      validate: [mobileValidater, "Please enter a valid Phone number"],
    },
    role: {
      type: String,
      default: "user",
    },
    isOnline:Boolean,
    lastSeen:Date,
    OTP: Number,
    OTPExpries: Date,
    IsOTPVerfied: Boolean,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.jsonwebtoken=function(){
  return jwt.sign({id:this.id},process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRES_TIME
  })
}

userSchema.methods.isValidPassword=async function(password){
  return await bcrypt.compare(password,this.password);
}

function emailValidater(email) {
  return /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(email);
}

function mobileValidater(number) {
  return /^[6-9][0-9]{9}$/.test(number);
}

module.exports = model("user", userSchema);

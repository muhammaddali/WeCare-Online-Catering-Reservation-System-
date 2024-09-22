import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name can't be left empty."],
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email."],
    lowercase: true,
    validate: {
      validator: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value),
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Password can't be left empty."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

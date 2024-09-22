import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import { isAuth, generateToken, isAdmin } from "../utils.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const pageSize = Number(req.query?.pageSize) || 10;
    const page = Number(req.query?.page) || 1;

    const count = await User.countDocuments({});
    const users = await User.find({})
      .sort({ createdDate: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    res.send({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      totalUsers: count,
    });
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);
    const currentUser = req.user;

    if (!userToDelete) {
      return res.status(404).send({ message: "User Not Found" });
    }

    if (userToDelete._id.toString() === currentUser._id.toString()) {
      return res.status(403).send({ message: "You cannot delete yourself." });
    }

    const ordersCount = await Order.countDocuments({ user: userToDelete._id });
    if (ordersCount > 0) {
      return res.status(403).send({
        message: "User cannot be deleted because they have placed orders.",
      });
    }

    await userToDelete.deleteOne();
    res.status(204).send({ message: "User Deleted" });
  })
);

export default userRouter;

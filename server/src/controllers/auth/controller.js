import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "../../models/User.js";

export const SignIn = async (req, res) => {
  try {
    const { collegeid, password } = req.body;
    const user = await User.findOne({ collegeid });
    if (!user) {
      res.status(404).json({ message: "User Not Registered" });
      return;
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Id or Password Incorrect" });
    }

    const access_token = jwt.sign(
      {
        userid: user._id,
        collegeid: user.collegeid,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "10m",
      }
    );

    const refresh_token = jwt.sign(
      {
        collegeid: user.collegeid,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "15d" }
    );

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 10 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login Successful",
      access_token,
      // data: { userid: user._id, collegeid: user.collegeid, role: user.role },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SignUp = async (req, res) => {
  try {
    const { name, collegeid, password, role } = req.body;
    const existingUser = await User.findOne({ collegeid });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    //hashing the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      name,
      collegeid,
      password: hashedPassword,
      role,
    });
    if (!newUser) {
      return res.status(424).json({ message: "Error at Creating The Account" });
    }
    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        name: newUser.name,
        collegeid: newUser.collegeid,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SignOut = (req, res) => {
  try {
    res.cookie("access_token", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1,
    });
    res.cookie("refresh_token", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 1,
    });
    res.status(200).json({ message: "successfully deleted cookies" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const ForgetPassword = async () => {};

export const GenerateAccessToken = async (req, res, next) => {
  try {
    if (!req.cookies?.refresh_token) {
      res.status(406).json({ message: "Unauthorized" });
      return false;
    }
    const refresh_token = req.cookies.refresh_token;
    jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) {
          res.status(406).json({ message: "Unauthorized" });
          return false;
        } else {
          const user = await User.findOne({
            collegeid: decoded.collegeid,
          });

          const access_token = jwt.sign(
            {
              userid: user._id,
              collegeid: user.collegeid,
              role: user.role,
            },
            process.env.JWT_ACCESS_TOKEN,
            {
              expiresIn: "10m",
            }
          );
          res.cookie("access_token", access_token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 10 * 60 * 1000,
          });
          req.isLoggedIn = true;
          req.access_token = access_token;
          next(); // Call next to move to the next middleware
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return false;
  }
};

export const isAuthorised = async (req, res, next) => {
  console.log("req.body.collegeid");

  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;
  // console.log(access_token, refresh_token);
  if (!refresh_token) {
    return res.status(406).json({ logged: false, message: "Unauthorised" });
  }
  if (!access_token) {
    GenerateAccessToken(req, res, next); // Pass next to GenerateAccessToken
  } else {
    jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(406)
          .json({ logged: false, message: "Invalid Token" });
      } else {
        req.isLoggedIn = true;
        req.access_token = access_token;
        next();
      }
    });
  }
};

export const isLoggedIn = async (req, res) => {
  try {
    if (req.isLoggedIn) {
      return res
        .status(200)
        .json({ logged: true, access_token: req.access_token });
    } else {
      return res.status(200).json({ logged: false });
    }
  } catch (error) {
    res.status(500).json({ logged: false, message: "Internal server error" });
  }
};

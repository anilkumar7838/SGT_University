import { User } from "../../models/User.js";

export const getAllusers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ message: `List of Users`, data: allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getUser = async (req, res) => {
  try {
    var user = await User.findOne({
      collegeid: req.body.collegeid,
    });
    var { password, ...user } = user._doc;
    if (!user) {
      return res.status(404).json({ message: `User Not Found` });
    }
    res.status(200).json({ message: `user`, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { collegeid, ...data } = req.body;
    const user = await User.findOneAndUpdate({
      collegeid: req.body.collegeid,
      data,
    });
    if (!user) {
      res.status(404).json({ message: `User not Found` });
    }
    res.status(200).json({ message: `updated user`, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteUser = async (req, res) => {
  const { collegeid } = req.body;
  try {
    const response = await User.findOneAndDelete({ collegeid });
    if (response) res.status(200).json({ message: `user deleted succesfully` });
    else res.status(404).json({ message: `user not found` });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

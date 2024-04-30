import jwt from "jsonwebtoken";
import { Project } from "../../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    if (!project) {
      return res.status(400).json({ message: "something went wrong" });
    }
    res.status(201).json({ message: "project created successfully", project });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "interval server error" });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find();
    res.status(200).json({ message: `List of Projects`, allProjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      student_collegeid: req.body.collegeid,
    });
    if (!project) {
      return res.status(404).json({ message: `Project Not Found` });
    }
    res.status(200).json({ message: `project`, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { projectid, ...data } = req.body;
    const project = await Project.findOneAndUpdate({
      _id: projectid,
      data,
    });
    if (!project) {
      res.status(404).json({ message: `Project not Found` });
    }
    res.status(200).json({ message: `updated project`, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  const { projectid } = req.body;
  try {
    const response = await Project.findOneAndDelete({ projectid });
    if (response)
      res.status(200).json({ message: `project deleted succesfully` });
    else res.status(404).json({ message: `project not found` });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const varifyFaculty = (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: "Invalid Token" });
      } else {
        if (decoded.role === "faculty") {
          next();
          return;
        }
        return res.status(406).json({ message: "Unauthorised" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};
export const varifyStudent = (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    jwt.verify(access_token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: "Invalid Token" });
      } else {
        if (
          decoded.role === "faculty" ||
          req.body.collegeid === decoded.collegeid
        ) {
          next();
          return;
        }
        return res.status(406).json({ message: "Unauthorised" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
};

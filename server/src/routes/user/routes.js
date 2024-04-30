import express from "express";

import {
  deleteUser,
  getAllusers,
  getUser,
  updateUser,
} from "../../controllers/user/controller.js";

export const router = express.Router();
// router.post("/create", GenerateRefreshToken);
router.get("/getall", getAllusers);
router.post("/getone", getUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

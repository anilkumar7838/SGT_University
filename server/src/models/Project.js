import mongoose, { Types } from "mongoose";

const ProjectSchema = mongoose.Schema(
  {
    student_collegeid: {
      type: String,
    },
    mentor: {
      type: String,
      required: true,
    },
    faculty_name: {
      type: String,
      required: true,
    },
    project_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    budget_requested: {
      type: String,
      required: true,
    },
    budget_status: {
      type: String,
      enum: ["approved", "pending", "cancelled"],
      required: true,
    },
    stall_number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "Project" }
);

export const Project = mongoose.model("Project", ProjectSchema);

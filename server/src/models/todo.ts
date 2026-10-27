import mongoose, { Schema } from "mongoose";

const toDoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  
});

export const ToDo = mongoose.model("ToDo", toDoSchema);

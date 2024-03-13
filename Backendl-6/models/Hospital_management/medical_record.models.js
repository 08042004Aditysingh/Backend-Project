import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({});

export const MedicalRecord = mongoose.model("MedicalRecord",medicalRecordSchema);
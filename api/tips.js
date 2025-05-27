import mongoose from "mongoose";
import Tip from "../models/Tip.js"; // copy your Mongoose model there

// connect once
mongoose.connect(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const tips = await Tip.find().sort({ createdAt: -1 });
    return res.status(200).json(tips);
  }
  if (req.method === "POST") {
    const tip = await Tip.create(req.body);
    return res.status(201).json(tip);
  }
  res.status(405).end();
}

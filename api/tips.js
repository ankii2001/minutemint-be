import mongoose from "mongoose";
import Tip from "../models/Tip.js";  // adjust path/model import

// Connect once
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  // 1) CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2) Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      const tips = await Tip.find().sort({ createdAt: -1 });
      return res.status(200).json(tips);
    }
    if (req.method === "POST") {
      const created = await Tip.create(req.body);
      return res.status(201).json(created);
    }
    res.setHeader("Allow", ["GET","POST","OPTIONS"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("Error in /api/tips:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

import Tip from "../models/Tip.js";
import dbConnect from "../utils/dbConnect.js";

export default async function handler(req, res) {
  await dbConnect();
  // 1) CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2) Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      const tips = await Tip.find().sort({ createdAt: -1 });
      return res.status(200).json(tips);
    } catch (err) {
      console.error("Error in GET /api/tips:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  if (req.method === "POST") {
    try {
      const created = await Tip.create(req.body);
      return res.status(201).json(created);
    } catch (err) {
      console.error("Error in POST /api/tips:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

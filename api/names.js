
import Name from "../models/Name.js";
import dbConnect from "../utils/dbConnect.js";

export default async function handler(req, res) {
  await dbConnect();
  // 1) CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2) Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      const docs = await Name.find().sort({ createdAt: -1 });
      return res.status(200).json(docs.map(d => d.name));
    } catch (err) {
      console.error("Error in GET /api/names:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  if (req.method === "POST") {
    try {
      const payload = req.body;
      let saved;
      if (Array.isArray(payload)) {
        await Name.deleteMany({});
        const docs = payload.map(n => ({ name: n }));
        saved = await Name.insertMany(docs);
        return res.status(201).json(saved.map(d => d.name));
      } else {
        saved = await Name.create({ name: payload });
        return res.status(201).json(saved.name);
      }
    } catch (err) {
      console.error("Error in POST /api/names:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

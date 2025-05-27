import mongoose from "mongoose";

const NameSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

const Name = mongoose.models.Name || mongoose.model("Name", NameSchema);

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

export default async function handler(req, res) {
  // 1) CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2) Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    if (req.method === "GET") {
      const docs = await Name.find().sort({ createdAt: -1 });
      return res.status(200).json(docs.map(d => d.name));
    }
    if (req.method === "POST") {
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
    }
    res.setHeader("Allow", ["GET","POST","OPTIONS"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("Error in /api/names:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

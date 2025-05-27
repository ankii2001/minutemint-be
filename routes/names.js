// api/names.js
import mongoose from "mongoose";

// 1) Define (or import) your Name schema/model.
//    If you already have a Mongoose model in your server,
//    copy it here (e.g. move models/Name.js → api/models/Name.js).
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { timestamps: true });

const Name = mongoose.models.Name || mongoose.model("Name", NameSchema);

// 2) Connect once to MongoDB
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    // these flags are now defaults in Mongoose 6+
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  });
}

// 3) The serverless function handler
export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const names = await Name.find().sort({ createdAt: -1 });
      return res.status(200).json(names.map(n => n.name));
    }

    if (req.method === "POST") {
      // expect body: an array of strings, or a single string?
      // here we assume an array: ["Alice","Bob",...]
      const payload = req.body;
      let saved;

      if (Array.isArray(payload)) {
        // Clear existing and insert new list
        await Name.deleteMany({});
        const docs = payload.map(n => ({ name: n }));
        saved = await Name.insertMany(docs);
      } else {
        // Single name
        saved = await Name.create({ name: payload });
      }

      return res.status(201).json(
        Array.isArray(saved)
          ? saved.map(d => d.name)
          : saved.name
      );
    }

    res.setHeader("Allow", ["GET","POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error("Error in /api/names:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

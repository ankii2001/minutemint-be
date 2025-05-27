import express from 'express';
import Name from '../models/Name.js';
const router = express.Router();

// fetch all names
router.get('/', async (_,res)=> {
  const docs = await Name.find();
  res.json(docs.map(d=>d.name));
});

// overwrite with new array
router.post('/', async (req,res)=> {
  await Name.deleteMany({});
  await Name.insertMany(req.body.map(n=>({name:n})));
  res.status(201).json({count:req.body.length});
});

export default router;

import express from 'express';
import Tip from '../models/Tip.js';
const router = express.Router();

router.get('/', async (_,res)=> res.json(await Tip.find()));
router.post('/', async (req,res)=> {
  const t = await Tip.create(req.body);
  res.status(201).json(t);
});

export default router;

import axios from 'axios';
import { Request, Response } from 'express';
import { getAIAction } from '../services/ppo.service';


export const predictDiabetes = async (req: Request, res: Response) => {
  try {
    const userInput = req.body; 
    const flaskRes = await axios.post('https://happyclinic-ai-backend.onrender.com/predict', userInput);

     res.status(200).json(flaskRes.data);
     return;
  } catch (err: any) {
    console.error("Flask error:", err?.response?.data || err.message);
     res.status(500).json({ error: 'AI prediction failed', details: err?.response?.data || err.message });
     return;
  }
};
export const predictResourcePPO = async (req: Request, res: Response) => {
  const aiResult = await getAIAction(req.body);

  res.json({
    success: true,
    decision: aiResult.action
  });
};


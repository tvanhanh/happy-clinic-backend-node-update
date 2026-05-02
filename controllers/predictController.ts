import axios from 'axios';
import { Request, Response } from 'express';



export const predictDiabetes = async (req: Request, res: Response) => {
  try {
    const userInput = req.body;

    console.log("INPUT:", userInput);

    const flaskRes = await axios.post(
      'https://happyclinic-ai-backend.onrender.com/api/predict',
      userInput
    );

    console.log("FLASK RESPONSE:", flaskRes.data);

    return res.status(200).json(flaskRes.data);

  } catch (err: any) {
    console.log("STATUS:", err?.response?.status);
    console.log("DATA:", err?.response?.data);
    console.log("MESSAGE:", err.message);

    return res.status(500).json({
      error: 'AI prediction failed',
      debug: err?.response?.data || err.message
    });
  }
};
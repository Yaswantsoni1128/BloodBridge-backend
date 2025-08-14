import express, { response } from 'express';
import { sendSms } from '../services/sendSms.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const smsRoutes = express.Router();

smsRoutes.post('/send-sms', async (req, res, next) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return next(new ApiError(400, "'to' and 'message' are required"));
  }

  try {
    const result = await sendSms(to, message);
    console.log("SMS sent successfully:", result);

    return res
      .status(200)
      .json(result);

  } catch (error) {
    next(new ApiError(500, "SMS sending failed", error.message));
  }
});

export default smsRoutes;

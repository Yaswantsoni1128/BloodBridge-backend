import twilio from 'twilio';
import dotenv from 'dotenv';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
dotenv.config();

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sendSms = async (to, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    return response;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new ApiError(500, "SMS sending failed", error.message);
  }
};

export { sendSms };
import nodemailer from "nodemailer";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const sendOTPEmail = async (to) => {
  const otp = generateOTP();
  const message = `Your Salon Booking OTP is ${otp}. It expires in 10 minutes.`;

  // Using Gmail service config, so host and port are not mandatory
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "salonslotease@gmail.com",
      pass: "#slotease123"  // Be sure to use app password for Gmail
    }
  });

  await transporter.sendMail({
    from: '"Salon Booking" <no-reply@salon.com>',
    to,
    subject: "Your OTP Code",
    text: message
  });

  console.log("OTP email sent to:", to);

  return otp;  // return OTP for storing in DB or further verification
};

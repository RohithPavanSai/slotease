import nodemailer from "nodemailer";

export const sendEmail = async (from, to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "salonslotease@gmail.com",
      pass: process.env.EMAIL_PASSWORD, // set Gmail app password
    },
  });

  await transporter.sendMail({ from, to, subject, text });
};

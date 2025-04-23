// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import process from "process";
import validator from "validator";

dotenv.config();

const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE } =
  process.env;

if (!EMAIL_USER || !EMAIL_PASSWORD) {
  console.error(
    "Missing EMAIL_USER or EMAIL_PASSWORD environment variables for mailer configuration."
  );
  throw new Error(
    "Missing EMAIL_USER or EMAIL_PASSWORD environment variables for mailer configuration."
  );
}

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST || "smtp.gmail.com",
  port: EMAIL_PORT || 587,
  secure: EMAIL_SECURE === "true",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error(
      "Error with mailer configuration:",
      error.stack || error.message
    );
  } else {
    console.log("Mailer is ready to send emails:", success);
  }
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendWithRetry = async (mailOptions, retries = 3, delayMs = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.stack || error.message);
      if (i === retries - 1) throw error;
      await delay(delayMs * Math.pow(2, i)); // Exponential backoff
    }
  }
};

const sendAppointmentConfirmation = async (appointment) => {
  try {
    if (!appointment.email || !validator.isEmail(appointment.email)) {
      throw new Error(`Invalid email address: ${appointment.email}`);
    }
    const mailOptions = {
      from: `"University Health Services" <${EMAIL_USER}>`,
      to: appointment.email,
      subject: "Appointment Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Confirmation</h2>
          <p>Dear ${appointment.fullName},</p>
          <p>Your appointment has been confirmed. Please check your portal for more details.</p>
        </div>
      `,
    };

    await sendWithRetry(mailOptions);
    console.log(`Confirmation email sent to ${appointment.email}`);
  } catch (error) {
    console.error(
      "Error sending confirmation email:",
      error.stack || error.message
    );
  }
};

const sendAppointmentReminder = async (appointment) => {
  try {
    if (!appointment.email || !validator.isEmail(appointment.email)) {
      throw new Error(`Invalid email address: ${appointment.email}`);
    }
    const mailOptions = {
      from: `"University Health Services" <${EMAIL_USER}>`,
      to: appointment.email,
      subject: "Appointment Reminder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Reminder</h2>
          <p>Dear ${appointment.fullName},</p>
          <p>This is a reminder for your upcoming appointment. Please be on time and reach out if you need to reschedule.</p>
        </div>
      `,
    };

    await sendWithRetry(mailOptions);
    console.log(`Reminder email sent to ${appointment.email}`);
  } catch (error) {
    console.error(
      "Error sending reminder email:",
      error.stack || error.message
    );
  }
};

// ES6 exports
export { sendAppointmentConfirmation, sendAppointmentReminder };

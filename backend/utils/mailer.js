// backend/utils/mailer.js
import { createTransport } from "nodemailer";

// Create transporter (configure with your email service)
const transporter = createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "false", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Enable debug output
  logger: true, // Log SMTP communication
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with mailer configuration:", error);
  } else {
    console.log("Mailer is ready to send emails:", success);
  }
});

const sendWithRetry = async (mailOptions, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      return;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
    }
  }
};

const sendAppointmentConfirmation = async (appointment) => {
  try {
    const mailOptions = {
      from: `"University Health Services" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject: "Appointment Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Confirmation</h2>
          <p>Dear ${appointment.fullName},</p>
          
          <p>Your appointment with University Health Services has been confirmed:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Student ID</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                appointment.studentId
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                appointment.service
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date & Time</td>
              <td style="padding: 8px; border: 1px solid #ddd;">
                ${new Date(appointment.appointmentDateTime).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
                at
                ${new Date(appointment.appointmentDateTime).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </td>
            </tr>
          </table>
          
          <p style="margin-top: 20px;">
            <strong>Important:</strong> Please arrive 10 minutes before your scheduled time.
            Bring your student ID and any relevant medical documents.
          </p>
          
          <p>To reschedule or cancel your appointment, please contact healthservices@university.edu</p>
          
          <p style="margin-top: 30px;">Best regards,<br>University Health Services Team</p>
        </div>
      `,
    };

    await sendWithRetry(mailOptions);
    console.log(`Confirmation email sent to ${appointment.email}`);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    // Don't throw error - we don't want failed email to fail the appointment booking
  }
};

// Add to mailer.js
const sendAppointmentReminder = async (appointment) => {
  try {
    const mailOptions = {
      from: `"University Health Services" <${process.env.EMAIL_USER}>`,
      to: appointment.email,
      subject: "Appointment Reminder",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Appointment Reminder</h2>
            <p>Dear ${appointment.fullName},</p>
            
            <p>This is a reminder for your upcoming appointment tomorrow:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  appointment.service
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Time</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${new Date(
                    appointment.appointmentDateTime
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            </table>
            
            <p>Location: University Health Center, Room 205</p>
            
            <p style="margin-top: 30px;">Best regards,<br>University Health Services Team</p>
          </div>
        `,
    };

    await sendWithRetry(mailOptions);
    console.log(`Reminder email sent to ${appointment.email}`);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};

export default { sendAppointmentConfirmation, sendAppointmentReminder };

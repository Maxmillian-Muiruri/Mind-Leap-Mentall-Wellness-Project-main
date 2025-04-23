import { schedule } from "node-cron";
import Appointment from "../models/Appointment.js";
import mailer from "../utils/mailer.js";

const startReminderService = () => {
  if (process.env.ENABLE_REMINDERS !== "true") {
    console.log("Appointment reminders are disabled (ENABLE_REMINDERS ≠ true)");
    return;
  }

  console.log("Starting appointment reminder service...");

  // Run every day at 9am
  schedule(
    "0 9 * * *",
    async () => {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
        const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

        const appointments = await Appointment.find({
          appointmentDateTime: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          status: "booked",
        });

        console.log(`Found ${appointments.length} appointments to remind`);

        for (const appointment of appointments) {
          try {
            await mailer.sendAppointmentReminder(appointment);
            console.log(`Sent reminder for appointment ID: ${appointment._id}`);
          } catch (emailError) {
            console.error(
              `Failed to send reminder for ${appointment._id}:`,
              emailError.message
            );
          }
        }

        console.log(
          `[${new Date().toISOString()}] Completed sending ${
            appointments.length
          } reminders`
        );
      } catch (error) {
        console.error("Error in reminder job:", error.message);
      }
    },
    {
      scheduled: true,
      timezone: "Africa/Nairobi", // Set your preferred timezone
    }
  );

  console.log("Appointment reminder service started (runs daily at 9:00 AM)");
};

export const start = startReminderService;

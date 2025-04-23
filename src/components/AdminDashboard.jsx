import { useEffect, useState } from "react";
import api from "../api";
import { format } from "date-fns";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await api.get("/api/admin/users");
        setUsers(usersResponse.data.data);

        const appointmentsResponse = await api.get("/api/admin/appointments");
        setAppointments(appointmentsResponse.data.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        if (error.response?.status === 401) {
          console.error("Token expired. Redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6" align="center">
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Users Section */}
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      {users.length === 0 ? (
        <Alert severity="info">No users found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Appointments Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
        Appointments
      </Typography>
      {appointments.length === 0 ? (
        <Alert severity="info">No appointments found.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Appointment Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.fullName}</TableCell>
                  <TableCell>
                    {format(new Date(app.appointmentDateTime), "PPpp")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminDashboard;

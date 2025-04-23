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
  Card,
  CardContent,
  Box,
  Divider,
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
      <Container sx={{ textAlign: "center", marginTop: "2rem" }}>
        <CircularProgress />
        <Typography variant="h6" align="center" sx={{ marginTop: "1rem" }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: "2rem" }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
      {/* Dashboard Header */}
      <Box
        sx={{
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage users and appointments efficiently
        </Typography>
      </Box>

      {/* Users Section */}
      <Card sx={{ marginBottom: "2rem", padding: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Users
          </Typography>
          <Divider sx={{ marginBottom: "1rem" }} />
          {users.length === 0 ? (
            <Alert severity="info">No users found.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
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
        </CardContent>
      </Card>

      {/* Appointments Section */}
      <Card sx={{ padding: "1rem", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Appointments
          </Typography>
          <Divider sx={{ marginBottom: "1rem" }} />
          {appointments.length === 0 ? (
            <Alert severity="info">No appointments found.</Alert>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Appointment Date
                    </TableCell>
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminDashboard;

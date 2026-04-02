import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validate input
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  // ✅ Login function
  const login = async (data) => {
    if (!validateInput(data)) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${config.endpoint}/auth/login`,
        {
          username: data.username,
          password: data.password,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Logged in successfully", {
          variant: "success",
        });

        // save auth details
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("balance", response.data.balance);

      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />

      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>

          <TextField
            label="username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="button"
            variant="contained"
            fullWidth
            onClick={() =>
              login({
                username,
                password,
              })
            }
          >
            {loading ? <CircularProgress size={24} /> : "LOGIN TO QKART"}
          </Button>

          <p className="secondary-action">
            Don’t have an account?{" "}
            <Link to="/register">Register now</Link>
          </p>
        </Stack>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;

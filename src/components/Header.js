import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, Box } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const handleRegister = () => history.push("/register");
  const handleLogin = () => history.push("/login");
  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };
  const handleBack = () => history.push("/");

  /* ---------------- LOGIN / REGISTER PAGES ---------------- */
  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon" />
        </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to explore
        </Button>
      </Box>
    );
  }

  /* ---------------- PRODUCTS PAGE ---------------- */
  return (
    <>
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon" />
        </Box>

        {/* 🔍 SEARCH BAR (DESKTOP ONLY) */}
        {children && (
          <Box className="search-desktop">
            {children}
          </Box>
        )}

        {/* AUTH BUTTONS */}
        {localStorage.getItem("username") ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username")}
            />
            <span>{localStorage.getItem("username")}</span>
            <Button className="explore-button" onClick={handleLogout}>
              LOGOUT
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button className="explore-button" onClick={handleLogin}>
              LOGIN
            </Button>
            <Button
              variant="contained"
              className="button"
              onClick={handleRegister}
            >
              REGISTER
            </Button>
          </Stack>
        )}
      </Box>
    </>
  );
};

export default Header;

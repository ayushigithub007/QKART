import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React ,{useState} from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  const[username,setUsername] = useState("");
  const[password,setPassword] = useState("");
  const[confirmPassword,setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const register = async (formData) => {
    if (!validateInput(formData)) return;


    setLoading(true);


    try {
      const response = await axios.post(`${config.endpoint}/auth/register`,{
        username: formData.username,
        password: formData.password,
      });


      if (response.status === 201) {
        enqueueSnackbar("Registered successfully", {
          variant: "success",
        });
        history.push("/login")
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


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
 
  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }
    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={username}
  onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            fullWidth
          />
           <Button className="button" variant="contained" onClick={() =>  register({
      username,
      password,
      confirmPassword,
    })}>
            {loading ? <CircularProgress size={24} /> : "Register"}
           </Button>
          <p className="secondary-action">
            Already have an account?
             <Link to="/login" className="explore-button">Login</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};


export default Register;

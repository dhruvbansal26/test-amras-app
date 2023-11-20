import { Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.ts";
import { userState } from "../store/atoms/userState.ts";
import { useSetRecoilState } from "recoil";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  return (
    <>
      <Card variant={"outlined"} style={{ width: 400, padding: 20 }}>
        <TextField
          fullWidth={true}
          label="Email"
          variant="outlined"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <br />
        <br />
        <TextField
          fullWidth={true}
          label="Password"
          variant="outlined"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <br />
        <br />
        <Button
          variant="contained"
          onClick={async () => {
            try {
              const response = await axios.post(`${BASE_URL}/auth/login`, {
                email: email,
                password: password,
              });
              let data = response.data;
              if (response.status == 200) {
                localStorage.setItem("token", data.token);
                setUser({
                  isLoading: false,
                  userEmail: response.data.email,
                  userPassword: response.data.password,
                  userName: response.data.name,
                });
                toast.success("User logged in.", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                navigate("/me");
              }
            } catch (error: any) {
              if (error.response) {
                toast.error(error.response.data.msg, {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
                console.log(error.response.data.msg);
              }
            }
          }}
        >
          Login
        </Button>
      </Card>
    </>
  );
};

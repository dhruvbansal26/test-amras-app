import { Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <>
      <Card variant={"outlined"} style={{ width: 400, padding: 20 }}>
        <TextField
          fullWidth={true}
          label="Username"
          variant="outlined"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <br />
        <br />
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
              const response = await axios.post(`${BASE_URL}/auth/signup`, {
                name: name,
                email: email,
                password: password,
              });
              let data = response.data;
              if (response.status == 200) {
                localStorage.setItem("token", data.token);
                console.log(data.msg);
                toast.success(data.msg, {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
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
          Signup
        </Button>
      </Card>
    </>
  );
};

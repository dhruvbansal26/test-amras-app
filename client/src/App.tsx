import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Landing } from "./components/Landing";
import { Signup } from "./components/Signup";
import { Login } from "./components/Login";
import Profile from "./components/Profile";
import Appbar from "./components/Appbar";
import { userState } from "./store/atoms/userState";
import { BASE_URL } from "./config";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Appbar />
      <InitUser></InitUser>
      <Routes>
        <Route path={"/"} element={<Landing />} />
        <Route path={"/me"} element={<Profile />} />
        <Route path={"/signup"} element={<Signup />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </Router>
  );
}

function InitUser() {
  const setUser = useSetRecoilState(userState);
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.name) {
        setUser({
          isLoading: false,
          userName: response.data.name,
          userEmail: response.data.email,
          userPassword: response.data.password,
        });
      } else {
        setUser({
          isLoading: false,
          userEmail: null,
          userName: null,
          userPassword: null,
        });
      }
    } catch (e) {
      setUser({
        isLoading: false,
        userEmail: null,
        userName: null,
        userPassword: null,
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return <></>;
}

export default App;

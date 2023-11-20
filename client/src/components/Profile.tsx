import { Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userState } from "../store/atoms/userState";

function Profile() {
  const userName = useRecoilValue(userState).userName;
  const userEmail = useRecoilValue(userState).userEmail;
  const userPassword = useRecoilValue(userState).userPassword;
  return (
    <Card variant={"outlined"} style={{ width: 400, padding: 20 }}>
      <Typography variant={"h6"}>Name: {userName}</Typography>
      <br />
      <br />
      <Typography variant={"h6"}>Email: {userEmail}</Typography>
      <br />
      <br />
      <Typography variant={"h6"}>Password: {userPassword}</Typography>
      <br />
      <br />
    </Card>
  );
}
export default Profile;

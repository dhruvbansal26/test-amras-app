import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.get("/", async (req, res) => {
  res.json("hello world!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

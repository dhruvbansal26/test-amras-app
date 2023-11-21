"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
require("dotenv").config();
const path = require("path");
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
// app.get("/", async (req, res) => {
//   res.json("hello world for final test2");
// });
// app.use(express.static("public"));
// app.use("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

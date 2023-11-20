"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware/");
const types_1 = require("../types");
require("dotenv").config();
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = types_1.SignupSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({
            msg: "Invalid signup input data.",
            errors: parsedInput.error,
        });
    }
    const { name, email, password } = parsedInput.data;
    function main(inputName, inputEmail, inputPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield prisma.user.findUnique({
                    where: {
                        email: inputEmail,
                    },
                });
                if (existingUser) {
                    return res.status(400).json({ msg: "Email address already exists." });
                }
                // If email is unique, create the user
                const user = yield prisma.user.create({
                    data: {
                        name: inputName,
                        email: inputEmail,
                        password: inputPassword, // Make sure to hash the password before saving it in production
                    },
                });
                const token = jsonwebtoken_1.default.sign({ name: user.name }, middleware_1.SECRET, { expiresIn: "1h" });
                res.status(200).json({ msg: "User created successfully.", token });
            }
            catch (error) {
                console.error("Error creating user:", error);
                return res.status(500).json({ msg: "User registration failed." });
            }
        });
    }
    main(name, email, password)
        .then(() => {
        console.log("Query executed!");
    })
        .catch((e) => {
        console.error(e);
    })
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = types_1.LoginSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(400).json({
            msg: "Invalid login input data.",
            errors: parsedInput.error,
        });
    }
    const { email, password } = parsedInput.data;
    function main(inputEmail, inputPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // In a real-world scenario, you should hash the password before comparing.
                const user = yield prisma.user.findFirst({
                    where: {
                        email: inputEmail,
                        password: inputPassword, // Again, make sure to hash the password
                    },
                });
                if (user) {
                    const token = jsonwebtoken_1.default.sign({ name: user.name }, middleware_1.SECRET, {
                        expiresIn: "1h",
                    });
                    const { name, email, password } = user;
                    return res.status(200).json({
                        msg: "Logged in successfully",
                        token,
                        name,
                        email,
                        password,
                    });
                }
                else {
                    return res.status(401).json({ msg: "Login failed" });
                }
            }
            catch (error) {
                console.error("Error during login:", error);
                return res.status(500).json({ msg: "Login failed" });
            }
        });
    }
    main(email, password)
        .then(() => {
        console.log("Query executed!");
    })
        .catch((e) => {
        console.error(e);
    })
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
}));
router.get("/me", middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userIdHeader = req.headers["userId"];
    try {
        const user = yield prisma.user.findFirst({
            where: {
                //@ts-ignore
                id: userIdHeader,
            },
        });
        if (user) {
            res.json({
                name: user.name,
                email: user.email,
                // Do NOT include the password in the response for security reasons
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    finally {
        yield prisma.$disconnect();
    }
}));
exports.default = router;

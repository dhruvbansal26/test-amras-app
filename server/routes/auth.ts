import jwt from "jsonwebtoken";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { SECRET, authenticateJwt } from "../middleware/";
import { SignupSchema, LoginSchema } from "../types";
require("dotenv").config();

const prisma = new PrismaClient();
const router = express.Router();

router.post("/signup", async (req, res) => {
  const parsedInput = SignupSchema.safeParse(req.body);

  if (!parsedInput.success) {
    return res.status(400).json({
      msg: "Invalid signup input data.",
      errors: parsedInput.error,
    });
  }

  const { name, email, password } = parsedInput.data;

  async function main(
    inputName: string,
    inputEmail: string,
    inputPassword: string
  ) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: inputEmail,
        },
      });

      if (existingUser) {
        return res.status(400).json({ msg: "Email address already exists." });
      }

      // If email is unique, create the user
      const user = await prisma.user.create({
        data: {
          name: inputName,
          email: inputEmail,
          password: inputPassword, // Make sure to hash the password before saving it in production
        },
      });

      const token = jwt.sign({ name: user.name }, SECRET, { expiresIn: "1h" });
      res.status(200).json({ msg: "User created successfully.", token });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ msg: "User registration failed." });
    }
  }

  main(name, email, password)
    .then(() => {
      console.log("Query executed!");
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

router.post("/login", async (req, res) => {
  const parsedInput = LoginSchema.safeParse(req.body);

  if (!parsedInput.success) {
    return res.status(400).json({
      msg: "Invalid login input data.",
      errors: parsedInput.error,
    });
  }
  const { email, password } = parsedInput.data;

  async function main(inputEmail: string, inputPassword: string) {
    try {
      // In a real-world scenario, you should hash the password before comparing.
      const user = await prisma.user.findFirst({
        where: {
          email: inputEmail,
          password: inputPassword, // Again, make sure to hash the password
        },
      });

      if (user) {
        const token = jwt.sign({ name: user.name }, SECRET, {
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
      } else {
        return res.status(401).json({ msg: "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ msg: "Login failed" });
    }
  }

  main(email, password)
    .then(() => {
      console.log("Query executed!");
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
});

router.get("/me", authenticateJwt, async (req, res) => {
  const userIdHeader = req.headers["userId"];

  try {
    const user = await prisma.user.findFirst({
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
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;

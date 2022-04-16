import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "@libs/clients/client";
import apiCaller from "@libs/servers/apiCaller";
import { JoinForm } from "../../../auth/join";

interface JoinRequestBody extends NextApiRequest {
  body: JoinForm;
}

export interface JoinResultData {
  id: number;
  email: string;
  name: string;
  token: string;
}

async function authJoin(request: JoinRequestBody, response: NextApiResponse) {
  try {
    const {
      body: { email, username, password },
    } = request;

    // Check the email already exists.
    const isUserExists = await client.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Found any user?
    if (isUserExists) {
      return response.status(400).json({
        ok: false,
        error: {
          code: "002",
          message: "The email already exist.",
        },
      });
    }

    // Create a new account.
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await client.user.create({
      data: {
        name: username,
        password: hashedPassword,
        email,
        isDormant: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Create user access token.
    const token = jwt.sign({ id: createdUser.id }, process.env.SECRET_KEY + "");

    return response.status(201).json({
      ok: true,
      data: {
        ...createdUser,
        token,
      },
    });
  } catch (error) {
    console.error("[authJoin]", error);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed create a new account.",
      },
    });
  }
}

export default apiCaller({
  methods: ["POST"],
  handler: authJoin,
  isPrivate: false,
});

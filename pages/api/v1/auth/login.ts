import apiCaller from "@libs/servers/apiCaller";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/clients/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginForm } from "./../../../auth/login";
import withSession from "@libs/servers/withSession";

interface LoginRequestBody extends NextApiRequest {
  body: LoginForm;
}

export interface LoginResultData {
  userId: number;
  token: string;
}

async function authLogin(request: LoginRequestBody, response: NextApiResponse) {
  try {
    const { email, password } = request.body;

    const foundUser = await client.user.findUnique({
      where: { email },
      select: { id: true, name: true, password: true },
    });

    if (!foundUser) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "002",
          message: "Does not found the user.",
        },
      });
    }

    // Check user password.
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return response.status(401).json({
        ok: false,
        error: {
          code: "003",
          message: "The password is incorrect.",
        },
      });
    }

    // Update dormant.
    await client.user.update({
      where: { id: foundUser.id },
      data: { isDormant: true },
    });

    // Set session.
    request.session.user = { id: foundUser.id };
    await request.session.save();

    // jwt.sign()
    const token = jwt.sign({ id: foundUser.id }, process.env.SECRET_KEY + "");

    return response.status(200).json({
      ok: true,
      data: {
        token,
      },
    });
  } catch (e) {
    console.error("[authLogin]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed the user login.",
      },
    });
  }
}

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler: authLogin,
    isPrivate: false,
  })
);

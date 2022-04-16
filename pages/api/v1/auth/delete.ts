import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";
import client from "@libs/clients/client";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
  }
}

const authDelete = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    // Has token?
    const { authorization } = request.headers;
    if (!authorization) {
      return response.status(401).json({
        ok: false,
        error: {
          code: "002",
          message: "Does not found user access token.",
        },
      });
    }

    let tokenId = undefined;
    // Token is valid?
    try {
      const { id } = <jwt.JwtPayload>(
        jwt.verify(authorization, process.env.SECRET_KEY!)
      );
      if (!id) {
        return response.status(401).json({
          ok: false,
          error: {
            code: "003",
            message: "The user access token is invalid.",
          },
        });
      }

      tokenId = id;
    } catch (e) {
      console.error("[authDelete]", e);
    }

    // Has session?
    if (!request.session.user) {
      return response.status(401).json({
        ok: false,
        error: {
          code: "004",
          message: "Does not found user session.",
        },
      });
    }

    // Find user by token value.
    const foundUserId = await client?.user.findUnique({
      where: { id: tokenId },
      select: { id: true },
    });
    if (!foundUserId) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "005",
          message: "Does not found the user.",
        },
      });
    }

    // Is same token value with session data.
    if (request.session.user.id !== foundUserId.id) {
      return response.status(400).json({
        ok: false,
        error: {
          code: "006",
          message: "Authorization token value is not same with found user.",
        },
      });
    }

    // Delete user.
    try {
      await client.user.delete({ where: { id: foundUserId?.id } });
    } catch (e) {
      console.error("authDelete:", e);
      return response.status(400).json({
        ok: false,
        error: {
          code: "007",
          message: "Failed delete user account.",
        },
      });
    }

    // Clear session.
    request.session.destroy();

    return response.status(200).json({ ok: true });
  } catch (e) {
    console.error("[authDelete]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed delete the user account.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler: authDelete,
  })
);

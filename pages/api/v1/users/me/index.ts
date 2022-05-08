import client from "@libs/clients/client";
import withSession from "@libs/servers/withSession";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";

const usersMe = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const { id } = request.session.user!;
    const foundUser = await client.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        avatar: true,
        gender: true,
        updatedAt: true,
        followings: {
          select: {
            id: true,
            avatar: true,
            name: true,
            locations: { orderBy: { createdAt: "desc" } },
            updatedAt: true,
          },
        },
        followers: {
          select: {
            id: true,
            avatar: true,
            name: true,
            locations: { orderBy: { createdAt: "desc" } },
            updatedAt: true,
          },
        },
        locations: { orderBy: { createdAt: "desc" } },
      },
    });

    // There is no user?
    if (!foundUser) {
      return response.status(500).json({
        ok: false,
        error: {
          code: "002",
          message: "Does not found user.",
        },
      });
    }

    return response.status(200).json({
      ok: true,
      me: foundUser,
    });
  } catch (e) {
    console.error("[usersMe]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed getting me data.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["GET"],
    handler: usersMe,
  })
);

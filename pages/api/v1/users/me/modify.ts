import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";
import client from "@libs/clients/client";

const usersModify = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    // Check user.
    const foundUser = await client.user.findUnique({
      where: { id: request.session.user?.id },
      select: { id: true },
    });
    if (!foundUser) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "001",
          message: "Does not found user.",
        },
      });
    }

    await client.user.update({
      where: { id: foundUser.id },
      data: {
        email: request.body?.email,
        name: request.body?.name,
        phone: request.body?.phone,
        gender: request.body?.gender,
        avatar: request.body?.avatar,
      },
    });

    return response.status(200).json({
      ok: true,
    });
  } catch (e) {
    console.error("[usersModify]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed modify the user information.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["PATCH"],
    handler: usersModify,
  })
);

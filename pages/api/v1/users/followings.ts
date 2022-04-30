import client from "@libs/clients/client";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";

interface UsersFollowingsRequest extends NextApiRequest {
  body: {
    id: any;
  };
}

const usersFollowings = async (
  request: UsersFollowingsRequest,
  response: NextApiResponse
) => {
  try {
    let isFollowing = false;
    let targetUser = undefined;
    switch (request.method) {
      case "GET":
        break;

      case "POST":
        const { id } = request.body;
        if (id) {
          targetUser = await client.user.findUnique({
            where: { id },
            select: { id: true },
          });
          const alreadyFollowed = await client.user.findFirst({
            where: {
              id: request.session.user?.id,
              followings: { some: { id } },
            },
            select: { id: true },
          });
          if (!alreadyFollowed) {
            isFollowing = true;
            await client.user.update({
              where: { id: request.session.user?.id },
              data: {
                followings: {
                  connect: { id },
                },
              },
            });
          } else {
            await client.user.update({
              where: { id: request.session.user?.id },
              data: {
                followings: {
                  disconnect: { id },
                },
              },
            });
          }
        }
        break;
    }
    return response.status(200).json({
      ok: true,
      data: {
        isFollowing,
        targetUser,
      },
    });
  } catch (e) {
    console.error("[usersFollowings]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed follow the user.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["GET", "POST"],
    handler: usersFollowings,
  })
);

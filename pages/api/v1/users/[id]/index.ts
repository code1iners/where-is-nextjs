import { NextApiResponse, NextApiRequest } from "next";
import client from "@libs/clients/client";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";

interface FindUserByIdRequest extends NextApiRequest {
  query: {
    id: any;
  };
}

const findUserById = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    const foundUser = await client.user.findUnique({
      where: { id: +request.query.id },
      include: { followings: true, followers: true },
    });

    // There is no user?
    if (!foundUser) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "002",
          message: "The user does not found.",
        },
      });
    }

    // Is following?
    const isFollowing = foundUser.followers.some(
      (follower) => follower.id === request.session.user?.id
    );

    const data = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      avatar: foundUser.avatar,
      gender: foundUser.gender,
      followings: foundUser.followings,
      followers: foundUser.followers,
      isFollowing,
    };

    return response.status(200).json({
      ok: true,
      data,
    });
  } catch (e) {
    console.error("[findUserById]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed find the user.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["GET"],
    handler: findUserById,
  })
);

import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";
import client from "@libs/clients/client";

interface UserSearchQueries {
  q?: string;
  lastId?: string;
  followers?: boolean;
  followings?: boolean;
}

const usersSearch = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    const { q, lastId }: UserSearchQueries = request.query;

    // Compose cursor options.
    const cursorOptions = lastId
      ? {
          skip: 1,
          cursor: {
            ...(lastId && { id: +lastId }),
          },
        }
      : undefined;

    const foundUsers = await client.user.findMany({
      ...cursorOptions,
      take: 10,
      where: {
        OR: [{ name: { startsWith: q } }, { email: { startsWith: q } }],
        NOT: { id: request.session.user?.id },
      },
      include: {
        followers: true,
        receiveFollowingOffers: { select: { id: true } },
      },
    });

    const parsedUser = foundUsers.map(
      ({ id, avatar, name, email, followers, receiveFollowingOffers }) => {
        const isFollower = followers?.some(
          (followersUser) => followersUser.id === request.session.user?.id
        );

        const received = receiveFollowingOffers.some(
          ({ id }) => id === request.session.user.id
        );

        return {
          id,
          avatar,
          name,
          email,
          followStatus: isFollower
            ? "FOLLOW"
            : received
            ? "PENDING"
            : "UNFOLLOW",
        };
      }
    );

    return response.status(200).json({
      ok: true,
      users: parsedUser ?? [],
    });
  } catch (e) {
    console.error("[usersSearch]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed search user.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["GET"],
    handler: usersSearch,
  })
);

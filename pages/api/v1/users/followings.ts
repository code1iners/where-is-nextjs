import { PrismaClient } from "@prisma/client";
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
    const { id } = request.body;

    if (!id) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "002",
          message: "The target user does not found.",
        },
      });
    }

    const targetUser = await client.user.findUnique({
      where: { id },
      select: {
        id: true,
        settings: { select: { id: true, isReceiveFollowOffer: true } },
        receiveFollowingOffers: { select: { id: true } },
      },
    });

    if (!targetUser) {
      return response.status(404).json({
        ok: false,
        error: {
          code: "003",
          message: "The user does not found.",
        },
      });
    }

    const alreadyFollowed = await client.user.findFirst({
      where: {
        id: request.session.user.id,
        followings: { some: { id } },
      },
      select: { id: true },
    });

    if (!alreadyFollowed) {
      // Checked take offer
      if (targetUser.settings && targetUser.settings.isReceiveFollowOffer) {
        // Say yes.

        // Check already sended offer.
        const alreadySended = targetUser.receiveFollowingOffers.some(
          ({ id: offerUserId }) => offerUserId === request.session.user.id
        );

        if (alreadySended) {
          // Cancel offer.
          await client.user.update({
            where: { id: request.session.user.id },
            data: {
              sendFollowingOffers: {
                disconnect: { id: targetUser.id },
              },
            },
          });
        } else {
          // Send offer.
          await client.user.update({
            where: { id: request.session.user.id },
            data: {
              sendFollowingOffers: {
                connect: { id: targetUser.id },
              },
            },
          });
        }
      } else {
        // Say no.
        await client.user.update({
          where: { id: request.session.user.id },
          data: {
            followings: {
              connect: { id: targetUser.id },
            },
          },
        });
      }
    } else {
      await client.user.update({
        where: { id: request.session.user.id },
        data: {
          followings: {
            disconnect: { id: targetUser.id },
          },
        },
      });
    }

    const me = await client.user.findUnique({
      where: { id: request.session.user.id },
      select: {
        id: true,
        sendFollowingOffers: { select: { id: true } },
        followings: { select: { id: true } },
      },
    });

    // Parse follow status.
    const isFollowing = me?.followings.some(
      (followingUser) => followingUser.id === me.id
    );
    const isPending = me?.sendFollowingOffers.some(
      (pendingUser) => pendingUser.id === targetUser.id
    );
    const followStatus = isFollowing
      ? "FOLLOW"
      : isPending
      ? "PENDING"
      : "UNFOLLOW";

    return response.status(200).json({
      ok: true,
      data: {
        followStatus,
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
    methods: ["POST"],
    handler: usersFollowings,
  })
);

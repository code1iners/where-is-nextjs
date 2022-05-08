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
      select: { id: true, locations: true },
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

    const {
      email,
      name,
      phone,
      gender,
      avatar,
      latitude,
      longitude,
      receiveOfferReaction,
      sendOfferResponse,
    } = request.body;
    const locations = latitude &&
      longitude && {
        create: {
          latitude,
          longitude,
        },
      };

    // Parse receive follow offers.
    const receiveFollowingOffers =
      receiveOfferReaction && receiveOfferReaction.targetUserId
        ? {
            disconnect: {
              id: receiveOfferReaction.targetUserId,
            },
          }
        : undefined;
    const followers =
      receiveOfferReaction && receiveOfferReaction.isAgree
        ? {
            connect: {
              id: receiveOfferReaction.targetUserId,
            },
          }
        : undefined;

    // Parse send follow offers.
    const sendFollowingOffers =
      sendOfferResponse && sendOfferResponse.targetUserId
        ? {
            disconnect: {
              id: sendOfferResponse.targetUserId,
            },
          }
        : undefined;

    await client.user.update({
      where: { id: foundUser.id },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(phone && { phone }),
        ...(gender && { gender }),
        ...(avatar && { avatar }),
        ...(locations && { locations }),
        ...(followers && { followers }),
        ...(receiveFollowingOffers && { receiveFollowingOffers }),
        ...(sendFollowingOffers && { sendFollowingOffers }),
      },
    });

    // Data which 1 week ago will be deleted.
    const now = new Date();
    await client.location.deleteMany({
      where: {
        userId: foundUser.id,
        createdAt: {
          lt: new Date(
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
              2,
              "0"
            )}-${String(now.getDate() - 7).padStart(2, "0")}`
          ),
        },
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

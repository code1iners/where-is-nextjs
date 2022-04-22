import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";
import client from "@libs/clients/client";

interface UserSearchQueries {
  name?: string;
}

const usersSearch = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    const { name }: UserSearchQueries = request.query;
    const foundUsers = await client.user.findMany({
      where: { name: { startsWith: name } },
    });
    return response.status(200).json({
      ok: true,
      users: foundUsers || [],
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

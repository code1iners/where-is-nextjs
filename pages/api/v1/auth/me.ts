import withSession from "@libs/servers/withSession";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";

const authMe = (request: NextApiRequest, response: NextApiResponse) => {
  try {
  } catch (e) {
    console.error("[authMe]", e);
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
    handler: authMe,
  })
);

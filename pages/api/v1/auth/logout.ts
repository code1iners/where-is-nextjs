import withSession from "@libs/servers/withSession";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";

async function authLogout(request: NextApiRequest, response: NextApiResponse) {
  try {
    // Clear user session.
    request.session?.destroy();
    return response.status(200).json({ ok: true });
  } catch (e) {
    console.error("[authLogout]", e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed user logout.",
      },
    });
  }
}

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler: authLogout,
  })
);

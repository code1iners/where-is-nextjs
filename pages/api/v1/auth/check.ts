import type { NextApiResponse, NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import jwt from "jsonwebtoken";
import withSession from "@libs/servers/withSession";

async function authCheck(request: NextApiRequest, response: NextApiResponse) {
  const { authorization } = request.headers;

  if (!authorization)
    return response.status(401).json({
      ok: false,
      error: {
        code: "001",
        message: "Does not found user access token.",
      },
    });

  let isValid = undefined;

  try {
    isValid = jwt.verify(authorization, process.env.SECRET_KEY + "");
  } catch (e) {
    console.error("[authCheck]", e);
    return response.status(401).json({ ok: false });
  }

  if (!isValid) return response.status(401).json({ ok: false });

  return response.status(200).json({ ok: true });
}

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler: authCheck,
  })
);

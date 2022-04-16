import type { NextApiResponse, NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import jwt from "jsonwebtoken";
import withSession from "@libs/servers/withSession";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { authorization } = request.headers;
  console.log("authorization", authorization);

  if (!authorization) return response.status(401).json({ ok: false });

  let isValid = undefined;

  try {
    isValid = jwt.verify(authorization, process.env.SECRET_KEY + "");
  } catch (e) {
    return response.status(401).json({ ok: false });
  }

  if (!isValid) return response.status(401).json({ ok: false });

  console.log("isValid", isValid);

  return response.status(200).json({ ok: true });
}

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler,
  })
);

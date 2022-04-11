import type { NextApiResponse, NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import jwt from "jsonwebtoken";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  const { authorization } = request.headers;
  if (!authorization) return response.status(401).json({ ok: false });

  let isValid = undefined;

  try {
    isValid = jwt.verify(authorization, process.env.SECRET_KEY + "");
  } catch (e) {
    return response.status(401).json({ ok: false });
  }

  if (!isValid) return response.status(401).json({ ok: false });

  return response.status(200).json({ ok: true });
}

export default apiCaller({
  methods: ["POST"],
  handler,
});

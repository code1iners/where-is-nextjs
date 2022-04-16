import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  try {
    console.log(request.headers);

    return response.status(200).json({
      ok: true,
    });
  } catch (e) {
    console.error(e);
    return response.status(500).json({
      ok: false,
      error: {
        code: "001",
        message: "Failed delete the user account.",
      },
    });
  }
};

export default withSession(
  apiCaller({
    methods: ["POST"],
    handler,
  })
);

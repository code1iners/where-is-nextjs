import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
type method = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

interface CallerProps {
  methods: method[];
  handler: (request: NextApiRequest, response: NextApiResponse) => void;
  isPrivate?: boolean;
}

export default function apiCaller({
  methods,
  handler,
  isPrivate = true,
}: CallerProps) {
  return async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method && !methods.includes(request.method as any)) {
      return response.status(405).json({
        ok: false,
        error: {
          code: "002",
          message: "The http method not allowed.",
        },
      });
    }

    if (isPrivate && !request.session.user) {
      return response.status(401).json({
        ok: false,
        error: {
          code: "003",
          message: "Does not found user access token.",
        },
      });
    }

    try {
      handler(request, response);
    } catch (error) {
      console.error("[caller]", error);
      return response.status(500).json({
        ok: false,
        error: {
          code: "001",
          message: "Failed call the api service.",
        },
      });
    }
  };
}

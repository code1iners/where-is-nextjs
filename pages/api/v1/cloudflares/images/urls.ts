import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import client from "@libs/clients/client";
import apiCaller from "@libs/servers/apiCaller";
import withSession from "@libs/servers/withSession";

interface CloudflareImagesDirectEndpointResponse {
  success: boolean;
  result: {
    id: string;
    uploadUrl: string;
  };
  errors: {
    code: number;
    message: string;
  };
}
interface CloudflareImageDeleteResponse {
  result: any;
  result_info: any;
  success: true;
  errors: CloudflareImageDeleteError[];
  messages: any[];
}

type CloudflareImageDeleteError = {
  code: number;
  message: string;
};

const cloudflareImagesUrls = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  switch (request.method) {
    case "GET":
      try {
        const {
          success,
          result,
          errors,
        }: CloudflareImagesDirectEndpointResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
            },
          }
        ).then((res) => res.json());

        if (!success) {
          console.error("[cloudflareImagesUrls]", errors);
          return response.status(400).json({
            ok: false,
            error: {
              code: "002",
              message: "Failed create direct upload url.",
            },
          });
        }

        return response.status(200).json({
          ok: true,
          result,
        });
      } catch (e) {
        console.error("[cloudflareImagesUrls:get]", e);
        return response.status(500).json({
          ok: false,
          error: {
            code: "001",
            message: "Failed upload cloudflare images.",
          },
        });
      }

    case "DELETE":
      try {
        const res: CloudflareImageDeleteResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${request.body.imageId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}`,
            },
          }
        ).then((res) => res.json());

        const { success, errors } = res;
        // Is failed?
        if (!success) {
          return response.status(400).json({
            ok: false,
            error: {
              code: "002",
              message: errors.map((error) => error.message).join(", "),
            },
          });
        }

        return response.status(200).json({
          ok: true,
        });
      } catch (e) {
        console.error("[cloudflareImagesUrls:delete]", e);
        return response.status(500).json({
          ok: false,
          error: {
            code: "001",
            message: "Failed delete cloudflare images.",
          },
        });
      }
  }
};

export default withSession(
  apiCaller({
    methods: ["GET", "DELETE"],
    handler: cloudflareImagesUrls,
  })
);

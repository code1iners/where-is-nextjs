import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user: {
      id: number;
    };
  }
}

export const sessionOptions = {
  cookieName: "where_is_session",
  password: process.env.SECRET_KEY!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export default function withSession(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

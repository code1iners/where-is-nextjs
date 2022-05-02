import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";
import { User } from "@prisma/client";
import MobileLayout from "@components/mobile-layout";
import UserDetail from "@components/user-detail";

export interface CustomUser extends User {
  followings: User[];
  followers: User[];
}
export interface UserMeResult {
  ok: boolean;
  me: CustomUser;
}

export default function Me() {
  const { data, error } = useSWR<UserMeResult>("/api/v1/users/me");

  useEffect(() => {
    // Has error?
    if (error) console.error("[me]", error);
  }, [error]);

  return (
    <MobileLayout seoTitle="내 정보">
      <article className="flex flex-col divide-y">
        {data ? <UserDetail user={data?.me} /> : null}
      </article>
    </MobileLayout>
  );
}

import { useEffect } from "react";
import useSWR from "swr";
import { Location, User } from "@prisma/client";
import MobileLayout from "@components/mobile-layout";
import UserDetail from "@components/user-detail";

export interface UserWithLocations extends User {
  locations: Location[];
}

export interface CustomUser extends User {
  followings: UserWithLocations[];
  followers: UserWithLocations[];
  sendFollowingOffers: UserWithLocations[];
  receiveFollowingOffers: UserWithLocations[];
  locations: Location[];
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

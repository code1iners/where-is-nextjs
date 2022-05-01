import LoadingTextWavy from "@components/loading-text-wavy";
import MobileLayout from "@components/mobile-layout";
import UserDetail from "@components/user-detail";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const UserRetrieve = () => {
  const { query, back } = useRouter();
  const { name, id } = query;

  const { data: foundUser } = useSWR(`/api/v1/users/${id}`);
  const { data: meData } = useSWR(`/api/v1/users/me`);
  console.log(meData?.me?.id, foundUser?.data?.id);

  if (!foundUser) return <LoadingTextWavy />;

  return (
    <MobileLayout seoTitle={(name as string) ?? "User Retrieve"}>
      <article className="flex flex-col divide-y">
        {foundUser?.ok ? (
          <UserDetail
            user={foundUser?.data}
            isMe={foundUser?.data?.id === meData?.me?.id}
          />
        ) : (
          <section
            className="flex justify-center items-center cursor-pointer hover:text-purple-500"
            onClick={() => back()}
          >
            <span>404 | {foundUser?.error?.message}</span>
          </section>
        )}
      </article>
    </MobileLayout>
  );
};

export default UserRetrieve;

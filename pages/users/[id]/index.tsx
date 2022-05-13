import LoadingTextWavy from "@components/loading-text-wavy";
import MobileLayout from "@components/mobile-layout";
import UserDetail from "@components/user-detail";
import { useRouter } from "next/router";
import useSWR from "swr";

const UserRetrieve = () => {
  const { query, back } = useRouter();
  const { name, id } = query;

  const { data: foundUser, mutate: foundUserMutate } = useSWR(
    `/api/v1/users/${id}`
  );
  const { data: meData } = useSWR(`/api/v1/users/me`);

  if (!foundUser) return <LoadingTextWavy />;

  return (
    <MobileLayout seoTitle={(name as string) ?? "User Retrieve"}>
      <article className="flex flex-col divide-y">
        {foundUser?.ok ? (
          <UserDetail user={foundUser?.data} me={meData?.me} />
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

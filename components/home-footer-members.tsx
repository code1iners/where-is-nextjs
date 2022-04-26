import Link from "next/link";
import UserAvatar from "./user-avatar";
import EmptyAvatar from "./empty-avatar";
import { CustomUser, UserMeResult } from "pages/users/me";
import { useSetRecoilState } from "recoil";
import { selectedMemberAtom } from "atoms";
import useSWR from "swr";

const HomeFooterMembers = () => {
  const { data } = useSWR<UserMeResult>("/api/v1/users/me");
  const setSelectedMember = useSetRecoilState(selectedMemberAtom);

  return (
    <ul className="absolute left-3 bottom-3 flex items-center gap-2">
      <Link href={"/members/additions"}>
        <a>
          <li className="p-2 bg-white rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[30px] w-[30px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </li>
        </a>
      </Link>

      {data ? (
        data?.me?.avatar ? (
          <li key={data?.me?.id}>
            <UserAvatar
              imageId={data?.me.avatar}
              width={50}
              height={50}
              variant="avatar"
              alt="Avatar"
              onClick={() => setSelectedMember(data?.me)}
            />
          </li>
        ) : (
          <li key={data?.me?.id}>
            <EmptyAvatar
              name={data?.me?.name}
              size="md"
              isCursorPointer={true}
              onClick={() => setSelectedMember(data?.me)}
            />
          </li>
        )
      ) : null}

      {data?.me?.following?.length
        ? data?.me?.following.map((user) =>
            user?.avatar ? (
              <li key={user?.id}>
                <UserAvatar
                  imageId={user?.avatar}
                  width={50}
                  height={50}
                  variant="avatar"
                  alt="Avatar"
                  onClick={() => setSelectedMember(user)}
                />
              </li>
            ) : (
              <li key={user?.id}>
                <EmptyAvatar
                  name={user?.name}
                  size="md"
                  isCursorPointer={true}
                  onClick={() => setSelectedMember(user)}
                />
              </li>
            )
          )
        : null}
    </ul>
  );
};

export default HomeFooterMembers;

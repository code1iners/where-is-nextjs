import Link from "next/link";
import UserImageAvatar from "./user-image-avatar";
import EmptyAvatar from "./empty-avatar";
import { CustomUser, UserMeResult } from "pages/users/me";
import { useSetRecoilState } from "recoil";
import { selectedMemberAtom } from "atoms";
import useSWR from "swr";
import UserAvatar from "./user-avatar";

const HomeFooterMembers = () => {
  const { data } = useSWR<UserMeResult>("/api/v1/users/me");
  const setSelectedMember = useSetRecoilState(selectedMemberAtom);

  return (
    <ul className="absolute bottom-3 flex items-center gap-2 w-screen p-2 overflow-x-scroll no-scrollbar">
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

      {data ? <UserAvatar user={data?.me} hover /> : null}

      {data?.me?.followings?.length
        ? data?.me?.followings.map((user) => (
            <UserAvatar
              key={user.id}
              user={user}
              onClick={() => setSelectedMember(user)}
              hover
            />
          ))
        : null}
    </ul>
  );
};

export default HomeFooterMembers;

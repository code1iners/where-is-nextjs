import Link from "next/link";
import UserAvatar from "./user-avatar";
import EmptyAvatar from "./empty-avatar";
import { CustomUser } from "pages/users/me";
import { User } from "@prisma/client";

interface HomeFooterMembersProps {
  me: CustomUser;
  onSelectMember: (me: User) => void;
}

const HomeFooterMembers = ({ me, onSelectMember }: HomeFooterMembersProps) => {
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

      {me.avatar ? (
        <li key={me.id}>
          <UserAvatar
            imageId={me.avatar}
            width={50}
            height={50}
            variant="avatar"
            alt="Avatar"
            onClick={() => onSelectMember(me)}
          />
        </li>
      ) : (
        <li key={me.id}>
          <EmptyAvatar
            name={me.name}
            size="md"
            isCursorPointer={true}
            onClick={() => onSelectMember(me)}
          />
        </li>
      )}

      {me.following.length
        ? me.following.map((user) =>
            user.avatar ? (
              <li key={user.id}>
                <UserAvatar
                  imageId={user.avatar}
                  width={50}
                  height={50}
                  variant="avatar"
                  alt="Avatar"
                  onClick={() => onSelectMember(user)}
                />
              </li>
            ) : (
              <li key={user.id}>
                <EmptyAvatar
                  name={user.name}
                  size="md"
                  isCursorPointer={true}
                  onClick={() => onSelectMember(user)}
                />
              </li>
            )
          )
        : null}
    </ul>
  );
};

export default HomeFooterMembers;
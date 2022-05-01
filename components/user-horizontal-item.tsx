import Link from "next/link";
import { User } from "@prisma/client";
import UserAvatar from "@components/user-avatar";

interface UserHorizontalItemProps {
  user: User;
}

const UserHorizontalItem = ({ user }: UserHorizontalItemProps) => {
  return (
    <Link
      key={user.id}
      href={{
        pathname: `/users/${user.id}`,
        query: {
          name: user.name,
        },
      }}
    >
      <a>
        <li
          key={user.id}
          className="p-2 flex justify-between items-center hover:text-purple-500"
        >
          <div className="flex space-x-2 items-center grow cursor-pointer">
            <UserAvatar user={user} />

            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-400">{user.email}</span>
              <span className="text-sm tracking-wider">{user.name}</span>
            </div>
          </div>
          <div className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </li>
      </a>
    </Link>
  );
};

export default UserHorizontalItem;

import { User } from "@prisma/client";
import UserAvatar from "@components/user-avatar";

export interface UserHorizontalFollowConfirmItemProps {
  user: User;
  isLoading?: boolean;
  enableAgreeButton?: boolean;
  enableDisagreeButton?: boolean;
  onUserClick?: () => void;
  onAgreeClick?: () => void;
  onDisagreeClick?: () => void;
}

const UserHorizontalFollowConfirmItem = ({
  user,
  isLoading,
  enableAgreeButton,
  enableDisagreeButton,
  onUserClick,
  onAgreeClick,
  onDisagreeClick,
}: UserHorizontalFollowConfirmItemProps) => {
  return (
    <li className="flex justify-between items-center py-2" key={user.id}>
      <div
        onClick={onUserClick}
        className="flex grow items-center space-x-2 cursor-pointer"
      >
        <div>
          <UserAvatar user={user} hover />
        </div>
        <span>{user.name}</span>
      </div>
      <div className="flex justify-center items-center gap-2">
        {enableAgreeButton ? (
          <button
            onClick={onAgreeClick}
            className="border border-green-400 text-green-500 rounded-md p-0.5 transition-all hover:scale-105 hover:text-white hover:bg-green-500"
          >
            {isLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
        ) : null}

        {enableDisagreeButton ? (
          <button
            onClick={onDisagreeClick}
            className="border border-red-400 text-red-500 rounded-md p-0.5 transition-all hover:scale-105 hover:text-white hover:bg-red-500"
          >
            {isLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            )}
          </button>
        ) : null}
      </div>
    </li>
  );
};

export default UserHorizontalFollowConfirmItem;

import UserAvatar from "@components/user-avatar";
import clazz from "@libs/clients/clazz";
import { Member } from "@pages/members/additions";

interface UserHorizontalFollowItemProps {
  user: Member;
  isFollowLoading: boolean;
  onItemClick: () => void;
  onFollowClick: () => void;
}

const UserHorizontalFollowItem = ({
  user,
  isFollowLoading,
  onItemClick,
  onFollowClick,
}: UserHorizontalFollowItemProps) => {
  return (
    <div className="flex justify-between items-center pt-1" key={user.id}>
      <div className="flex items-center gap-3">
        <UserAvatar user={user} onClick={onItemClick} hover />

        <div className="flex flex-col" onClick={onItemClick}>
          <span className="tracking-wider text-md cursor-pointer">
            {user.name}
          </span>
          <span className="tracking-wider text-gray-400 text-sm cursor-pointer">
            {user.email}
          </span>
        </div>
      </div>
      {/* Add user button */}
      <button
        className={clazz(
          "p-1 rounded-md border hover:text-white transition-colors",
          user.isFollower
            ? "border-red-500 hover:bg-red-500"
            : "border-purple-600 hover:bg-purple-600"
        )}
        onClick={onFollowClick}
      >
        {isFollowLoading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 animate-spin hover:text-white"
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
        ) : user.isFollower ? (
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
              d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default UserHorizontalFollowItem;

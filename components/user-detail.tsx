import Link from "next/link";
import UserAvatar from "@components/user-avatar";
import { CustomUser } from "@pages/users/me";

interface UserDetailProps {
  user: CustomUser;
  isMe: boolean;
}

const UserDetail = ({ user, isMe }: UserDetailProps) => {
  console.log(isMe);

  return (
    <>
      {/* Avatar. */}
      <section className="flex flex-col justify-center items-center mb-5">
        <UserAvatar
          user={user}
          wrapperClass="scale-[2.5] m-10 cursor-default"
        />

        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-xl tracking-wider">{user.name}</h1>
          {isMe ? (
            <Link href={"/users/me/modify"}>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </a>
            </Link>
          ) : null}
        </div>

        <span className="text-gray-400 tracking-wide text-sm cursor-default">
          {user.email}
        </span>

        <div className="grid grid-cols-2 gap-2 mt-5 text-xs text-gray-500 tracking-wider cursor-default">
          <div className="space-x-1">
            <label>Phone:</label>
            <span>{user.phone ? user.phone : "정보 없음"}</span>
          </div>
          <div className="space-x-1">
            <label>Gender:</label>
            <span>{user.gender ? user.gender : "정보 없음"}</span>
          </div>
          {isMe ? (
            <>
              <Link href="/users/me/follows?access-type=followings">
                <a className="space-x-1 cursor-pointer hover:text-black transition">
                  <label className="cursor-pointer">Followings:</label>
                  <span>{user?.followings?.length || 0}</span>
                </a>
              </Link>
              <Link href="/users/me/follows?access-type=followers">
                <a className="space-x-1 cursor-pointer hover:text-black transition">
                  <label className="cursor-pointer">Followers:</label>
                  <span>{user?.followers?.length || 0}</span>
                </a>
              </Link>
            </>
          ) : null}
        </div>
      </section>
      <section></section>
    </>
  );
};

export default UserDetail;

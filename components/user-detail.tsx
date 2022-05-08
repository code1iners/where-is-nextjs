import Link from "next/link";
import UserAvatar from "@components/user-avatar";
import { CustomUser } from "@pages/users/me";
import { useEffect, useState } from "react";
import useMutation from "@libs/clients/useMutation";

interface UserDetailProps {
  user: CustomUser;
  me?: CustomUser;
  onRefresh?: () => void;
}

const UserDetail = ({ user, me, onRefresh }: UserDetailProps) => {
  const [isMe, setIsMe] = useState(false);
  const [
    follow,
    {
      ok: followOk,
      data: followData,
      error: followError,
      loading: followLoading,
    },
  ] = useMutation("/api/v1/users/followings");

  useEffect(() => {
    if (user && me) {
      setIsMe(user.id === me.id);
    } else {
      setIsMe(true);
    }
  }, [user, me]);

  const onFollowClick = () => {
    if (followLoading) return;
    follow({ data: { id: user.id } });
  };

  useEffect(() => {
    if (followOk && followData) {
      if (onRefresh) onRefresh();
    }

    if (followError) {
      console.error("[follow]", followError);
    }
  }, [followOk, followData, followError, followLoading, onRefresh]);

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
          ) : (
            <button
              onClick={onFollowClick}
              className="col-span-2 w-full py-2 tracking-wider rounded-md border border-purple-400 hover:bg-purple-500 hover:text-white transition-colors text-center text-xs flex justify-center items-center"
            >
              {followLoading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 animate-spin hover:text-white"
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
              ) : user.followStatus === "FOLLOW" ? (
                "UNFOLLOW"
              ) : user.followStatus === "PENDING" ? (
                "PENDING"
              ) : (
                "FOLLOW"
              )}
            </button>
          )}
        </div>
      </section>
      <section></section>
    </>
  );
};

export default UserDetail;

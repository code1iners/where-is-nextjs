import clazz from "@libs/clients/clazz";
import useCloudflare from "@libs/clients/useCloudflare";
import { User } from "@prisma/client";

interface UserAvatarProps {
  user: User;
  hover?: boolean;
  wrapperClass?: string;
  onClick?: () => void;
}

const UserAvatar = ({
  user,
  hover,
  wrapperClass,
  onClick,
}: UserAvatarProps) => {
  const { createImageUrl } = useCloudflare();

  return (
    <div className={wrapperClass ? clazz(wrapperClass) : ""} onClick={onClick}>
      {user?.avatar ? (
        <img
          className={clazz(
            "w-10 h-10 rounded-full object-cover",
            hover ? "cursor-pointer" : "cursor-default"
          )}
          src={createImageUrl({
            imageId: user.avatar,
            variant: "avatar",
          })}
        />
      ) : (
        <div
          className={clazz(
            `w-10 h-10 rounded-full bg-purple-400 flex justify-center items-center text-black ${
              hover ? "hover:bg-purple-600 cursor-pointer" : "cursor-default"
            }`
          )}
        >
          <span
            className={clazz(
              "font-bold text-lg",
              hover ? "cursor-pointer" : "cursor-default"
            )}
          >
            {user.name[0].toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

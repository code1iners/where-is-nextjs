import clazz from "@libs/clients/clazz";
import useCloudflare from "@libs/clients/useCloudflare";
import { User } from "@prisma/client";

interface UserAvatarProps {
  user: User;
  hover?: boolean;
  needBaam?: boolean;
  needReverseY?: boolean;
  wrapperClass?: string;
  index?: number;
  onClick?: () => void;
}

const UserAvatar = ({
  user,
  hover,
  wrapperClass,
  onClick,
  needBaam,
  needReverseY,
  index,
}: UserAvatarProps) => {
  const { createImageUrl } = useCloudflare();

  return (
    <div className={wrapperClass ? clazz(wrapperClass) : ""} onClick={onClick}>
      {user?.avatar ? (
        <div
          className={clazz(
            "w-10 h-10",
            hover ? "cursor-pointer" : "cursor-default",
            needBaam ? "animate-baam" : "",
            needReverseY ? "animate-reverse-y" : "",
            index ? `animation-delay-${index + 1}00` : ""
          )}
        >
          <img
            className="w-full h-full object-cover rounded-full"
            src={createImageUrl({
              imageId: user.avatar,
              variant: "avatar",
            })}
          />
        </div>
      ) : (
        <div
          className={clazz(
            "w-10 h-10 rounded-full bg-purple-400 flex justify-center items-center text-black",
            hover ? "hover:bg-purple-500 cursor-pointer" : "cursor-default",
            needBaam ? "animate-baam" : "",
            needReverseY ? "animate-reverse-y" : "",
            index ? `animation-delay-${index + 1}00` : ""
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

import clazz from "@libs/clients/clazz";
import useCloudflare from "@libs/clients/useCloudflare";
import { User } from "@prisma/client";

interface UserAvatarProps {
  user: User;
  hover?: boolean;
  wrapperClass?: string;
}

const UserAvatar = ({ user, hover, wrapperClass }: UserAvatarProps) => {
  const { createImageUrl } = useCloudflare();

  return (
    <div className={wrapperClass ? clazz(wrapperClass) : ""}>
      {user?.avatar ? (
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={createImageUrl({
            imageId: user.avatar,
            variant: "avatar",
          })}
        />
      ) : (
        <div
          className={clazz(
            `w-10 h-10 rounded-full bg-purple-500 flex justify-center items-center text-black ${
              hover ? "hover:bg-purple-600" : ""
            }`
          )}
        >
          <span className="font-bold text-lg">
            {user.name[0].toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

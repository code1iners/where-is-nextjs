import useCloudflare from "@libs/clients/useCloudflare";
import { User } from "@prisma/client";

interface UserAvatarProps {
  user: User;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const { createImageUrl } = useCloudflare();
  return user?.avatar ? (
    <img
      className="w-10 h-10 rounded-full object-cover"
      src={createImageUrl({
        imageId: user.avatar,
        variant: "avatar",
      })}
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-purple-500 flex justify-center items-center text-black">
      <span className="font-bold text-lg">{user.name[0].toUpperCase()}</span>
    </div>
  );
};

export default UserAvatar;

import useCloudflare from "@libs/clients/useCloudflare";
import Image from "next/image";

interface UserAvatarProps {
  imageId: string;
  variant?: string;
  width: number;
  height: number;
  alt?: string;
  onClick?: () => void;
}

const UserAvatar = ({
  imageId,
  variant = "public",
  width,
  height,
  alt,
  onClick,
}: UserAvatarProps) => {
  const { createImageUrl } = useCloudflare();

  return (
    <div
      className="rounded-full overflow-hidden hover:scale-105 transition flex justify-center items-center"
      onClick={onClick}
    >
      <Image
        className="object-cover"
        src={createImageUrl({
          imageId,
          variant,
        })}
        width={width}
        height={height}
        alt={alt}
      />
    </div>
  );
};

export default UserAvatar;

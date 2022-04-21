interface EmptyAvatarProps {
  name?: string;
}

const EmptyAvatar = ({ name }: EmptyAvatarProps) => {
  return (
    <div className="flex justify-center items-center w-[120px] h-[120px] rounded-full bg-purple-400 hover:bg-purple-500 cursor-pointer">
      {name && name.length ? (
        <span className="text-6xl font-bold">{name.toUpperCase()[0]}</span>
      ) : null}
    </div>
  );
};

export default EmptyAvatar;

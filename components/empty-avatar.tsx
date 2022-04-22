import clazz from "@libs/clients/clazz";
import { useEffect, useState } from "react";

interface EmptyAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const EmptyAvatar = ({ name, size = "md", onClick }: EmptyAvatarProps) => {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fontSize, setFontSize] = useState("");
  useEffect(() => {
    if (size) {
      switch (size) {
        case "sm":
          setWidth("w-[35px]");
          setHeight("h-[35px]");
          setFontSize("text-md");
          break;
        case "md":
          setWidth("w-[70px]");
          setHeight("h-[70px]");
          setFontSize("text-4xl");
          break;
        case "lg":
          setWidth("w-[120px]");
          setHeight("h-[120px]");
          setFontSize("text-6xl");
          break;
      }
    }
  }, [size]);

  return (
    <div
      onClick={onClick}
      className={clazz(
        `flex justify-center items-center ${width} ${height} rounded-full bg-purple-400 hover:bg-purple-500 ${
          onClick ? "cursor-pointer" : ""
        }`
      )}
    >
      {name && name.length ? (
        <span className={clazz(`${fontSize} font-bold cursor-default`)}>
          {name.toUpperCase()[0]}
        </span>
      ) : null}
    </div>
  );
};

export default EmptyAvatar;

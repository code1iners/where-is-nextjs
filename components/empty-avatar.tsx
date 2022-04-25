import clazz from "@libs/clients/clazz";
import { useEffect, useState } from "react";

interface EmptyAvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  isCursorPointer?: boolean;
  onClick?: () => void;
}

const EmptyAvatar = ({
  name,
  size = "md",
  isCursorPointer = false,
  onClick,
}: EmptyAvatarProps) => {
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
          setWidth("w-[50px]");
          setHeight("h-[50px]");
          setFontSize("text-2xl");
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
        `flex justify-center items-center rounded-full bg-purple-400 hover:bg-purple-500 hover:scale-105 transition
        ${height} ${width} ${
          isCursorPointer ? "cursor-pointer" : "cursor-default"
        }`
      )}
    >
      {name && name.length ? (
        <span className={clazz(`${fontSize} font-bold`)}>
          {name.toUpperCase()[0]}
        </span>
      ) : null}
    </div>
  );
};

export default EmptyAvatar;

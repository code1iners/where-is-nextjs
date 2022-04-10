import clazz from "../libs/clients/clazz";

interface HorizontalLineProps {
  margin?: "sm" | "md" | "lg";
}

export default function HorizontalDivider({ margin }: HorizontalLineProps) {
  let my = "my-2";
  switch (margin) {
    case "sm":
      my = "my-4";
      break;
    case "md":
      my = "my-6";
      break;
    case "lg":
      my = "my-10";
      break;
  }

  return <div className={clazz(`border-t border-gray-300 w-full`, my)} />;
}

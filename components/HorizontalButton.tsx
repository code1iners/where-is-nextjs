interface HorizontalButtonProps {
  text?: string;
}

export default function HorizontalButton({ text }: HorizontalButtonProps) {
  return (
    <button className="rounded-md bg-purple-500 text-white text-lg font-semibold tracking-widest p-2 cursor-pointer hover:bg-purple-600 focus:bg-purple-600">
      {text ? text : "Button"}
    </button>
  );
}

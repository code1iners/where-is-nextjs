const LoadingTextWavy = () => {
  return (
    <div className="flex justify-center items-center tracking-[2px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="animate-[loading_1s_ease-in-out_infinite]">L</span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-100">
        o
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-200">
        a
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-300">
        d
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-400">
        i
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-500">
        n
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-600">
        g
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-700">
        .
      </span>
      <span className="animate-[loading_1s_ease-in-out_infinite] animation-delay-800">
        .
      </span>
    </div>
  );
};

export default LoadingTextWavy;

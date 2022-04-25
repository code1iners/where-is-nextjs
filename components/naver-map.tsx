import { useEffect, useRef } from "react";

interface NaverMapProps {
  onLoad: () => void;
}

const NaverMap = ({ onLoad }: NaverMapProps) => {
  const div = useRef(null);

  useEffect(() => {
    if (div.current) {
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            onLoad();
          } else if (mutation.type === "attributes") {
            onLoad();
          }
        }
      });

      // Start observing the target node for configured mutations
      observer.observe(div.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // setInterval(() => {

    // }, 1000)
  }, [div]);
  return (
    <div
      ref={div}
      id="map"
      className="absolute"
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
};

export default NaverMap;

import useNaverMap from "@libs/clients/useNaverMap";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { createCenter, setCurrentPosition, createMarker } = useNaverMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const center = createCenter(coords.latitude, coords.longitude);
      const map = setCurrentPosition({
        center,
        zoom: 17,
      });

      var marker = createMarker({
        map,
        position: center.destinationPoint(90, 15),
        icon: {
          url: "IMAGE",
          size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 26),
        },
      });
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Home | Where is</title>
      </Head>

      <main className="text-red-500">
        <div
          id="map"
          style={{
            width: "100%",
            height: "100vh",
          }}
        ></div>
      </main>

      {/* <footer>
        <a
          href="https://github.com/code1iners/where-is-nextjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <span>Codeliners</span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;

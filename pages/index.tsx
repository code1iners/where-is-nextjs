import HomeFooterMembers from "@components/home-footer-members";
import NaverMap from "@components/naver-map";
import SettingFloatingButton from "@components/setting-floating-button";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Home | Where is</title>
      </Head>

      <main className="">
        {/* Header setting button */}
        <SettingFloatingButton position="top-right" />

        {/* Naver map */}
        <NaverMap />

        {/* Footer members */}
        <HomeFooterMembers />

        {/* Refresh geolocation button */}
        {/* <div
          className="absolute right-5 bottom-20 bg-white rounded-full p-2 cursor-pointer"
          // onClick={onRefreshClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div> */}
      </main>
    </>
  );
};

export default Home;

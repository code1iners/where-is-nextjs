import HomeFooterMembers from "@components/home-footer-members";
import LoadingTextWavy from "@components/loading-text-wavy";
import NaverMap from "@components/naver-map";
import SettingFloatingButton from "@components/setting-floating-button";
import useCloudflare from "@libs/clients/useCloudflare";
import useMutation from "@libs/clients/useMutation";
import useNaverMap from "@libs/clients/useNaverMap";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { UserMeResult } from "./users/me";

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
      </main>
    </>
  );
};

export default Home;

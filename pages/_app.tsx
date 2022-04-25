import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import useAuth from "@libs/clients/useAuth";
import { SWRConfig } from "swr";
import { RecoilRoot } from "recoil";

const noCheckUrls = ["/auth/login", "/auth/join"];

function MyApp({ Component, pageProps, router }: AppProps) {
  const [showing, setShowing] = useState(false);
  const { checker } = useAuth();

  const checkUserAuthorization = async () => {
    const needCheck = noCheckUrls.some((url) => !router.pathname.includes(url));
    if (needCheck) {
      const { ok, error } = await checker();

      if (!ok) {
        console.error("_app", error);
        sessionStorage.removeItem("ACCESS_TOKEN");
        router.replace("/auth/login");
      } else {
        router.replace("/");
      }
    }

    setShowing(true);
  };

  useEffect(() => {
    checkUserAuthorization();
  }, []);

  return showing ? (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SWRConfig>
  ) : null;
}

export default MyApp;

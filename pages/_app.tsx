import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import useAuth from "@libs/clients/useAuth";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [showing, setShowing] = useState(false);
  const { checker } = useAuth();

  useEffect(() => {
    (async () => {
      const { ok, error } = await checker();
      if (!ok) {
        console.error(error);
        sessionStorage.removeItem("ACCESS_TOKEN");
        router.replace("/auth/login");
      } else {
        const prohibitedArea = ["/auth/join", "/auth/login"];
        const include = prohibitedArea.includes(router.route);
        if (include) router.replace("/");
      }

      setShowing(true);
    })();
  }, []);

  return showing ? (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  ) : null;
}

export default MyApp;

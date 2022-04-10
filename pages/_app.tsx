import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import useAuth from "@libs/clients/useAuth";

function MyApp({ Component, pageProps, router }: AppProps) {
  const { checker } = useAuth();
  const isNotPrivateUrls = ["/auth/login", "/auth/join"];
  useEffect(() => {
    (async () => {
      const isNotPrivateUrl = isNotPrivateUrls.includes(router.route);
      if (!isNotPrivateUrl) {
        const { ok, error } = await checker();
        if (!ok) {
          console.error(error);
          router.push("/auth/login");
        }
      }
    })();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import useAuth from "@libs/clients/useAuth";

function MyApp({ Component, pageProps, router }: AppProps) {
  const [showing, setShowing] = useState(false);
  const { checker } = useAuth();

  useEffect(() => {
    (async () => {
      const { ok, error } = await checker();
      if (!ok) {
        console.error(error);
        router.replace("/auth/login");
      } else {
        const prohibitedArea = ["/auth/join", "/auth/login"];
        const include = prohibitedArea.includes(router.route);
        if (include) router.replace("/");
      }

      setShowing(true);
    })();
  }, []);

  return showing ? <Component {...pageProps} /> : null;
}

export default MyApp;

import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps, router }: AppProps) {
  // if (typeof window !== undefined) {
  //   (async () => {
  //     const token = sessionStorage.getItem("ACCESS_TOKEN") + "";
  //     const res = await fetch("/api/v1/auth/check", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: token,
  //       },
  //     });
  //   })();
  // }

  return <Component {...pageProps} />;
}

export default MyApp;

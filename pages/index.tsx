import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Home | Where is</title>
      </Head>

      <main className="text-red-500">
        <span>hello tailwind CSS</span>
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

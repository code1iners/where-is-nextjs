import clazz from "@libs/clients/clazz";
import Head from "next/head";

interface MobileLayoutProps {
  seoTitle: string;
  children: React.ReactNode;
  className?: string;
}

export default function MobileLayout({
  seoTitle,
  children,
  className,
}: MobileLayoutProps) {
  return (
    <>
      <Head>
        <title>{seoTitle} | Where is</title>
      </Head>
      <main className={clazz("p-5", className ? className : "")}>
        {children}
      </main>
    </>
  );
}

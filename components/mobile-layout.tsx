import Head from "next/head";

interface MobileLayoutProps {
  seoTitle: string;
  children: React.ReactNode;
}

export default function MobileLayout({
  seoTitle,
  children,
}: MobileLayoutProps) {
  return (
    <>
      <Head>
        <title>{seoTitle} | Where is</title>
      </Head>
      <main className="p-5">{children}</main>
    </>
  );
}

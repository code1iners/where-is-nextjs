import useMutation from "@libs/clients/useMutation";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Settings: NextPage = () => {
  const router = useRouter();
  const [deleteAccount, { ok, error, loading }] = useMutation(
    "/api/v1/auth/delete"
  );
  const [logout, { ok: logoutOk, error: logoutError, loading: logoutLoading }] =
    useMutation("/api/v1/auth/logout");

  const onLogoutClick = () => {
    if (logoutLoading) return;
    logout();

    sessionStorage.removeItem("ACCESS_TOKEN");
    router.replace("/auth/login");
  };

  const onDeleteAccountClick = async () => {
    if (loading) return;

    try {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        await deleteAccount();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!logoutOk && logoutError) console.error("[settings]", logoutError);
  }, [logoutOk, logoutError]);

  return (
    <main>
      <article>
        <section>
          <ul className="p-5 space-y-2 text-sm tracking-wide">
            <li
              onClick={onLogoutClick}
              className="cursor-pointer transition-all hover:text-lg"
            >
              로그아웃
            </li>
            <li
              onClick={onDeleteAccountClick}
              className="cursor-pointer transition-all hover:text-lg text-red-500"
            >
              계정 삭제
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
};

export default Settings;

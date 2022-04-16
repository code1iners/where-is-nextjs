import useMutation from "@libs/clients/useMutation";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

const Settings: NextPage = () => {
  const router = useRouter();
  const [deleteAccount, { ok, error, loading }] = useMutation(
    "/api/v1/auth/delete"
  );

  const onLogoutClick = () => {
    sessionStorage.removeItem("ACCESS_TOKEN");
    router.reload();
  };

  const onDeleteAccountClick = async () => {
    console.log("onDeleteAccountClick", loading);
    if (loading) return;

    try {
      if (window.confirm()) {
        await deleteAccount({});
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <main>
      <article>
        <section>
          <ul className="p-5 space-y-2 text-sm tracking-wide">
            <li
              onClick={onLogoutClick}
              className="cursor-pointer transition-all hover:text-lg"
            >
              Logout
            </li>
            <li
              onClick={onDeleteAccountClick}
              className="cursor-pointer transition-all hover:text-lg text-red-500"
            >
              Delete account
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
};

export default Settings;

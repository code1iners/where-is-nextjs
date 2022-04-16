import { NextPage } from "next";
import { useRouter } from "next/router";

const Settings: NextPage = () => {
  const router = useRouter();
  const onLogoutClick = () => {
    sessionStorage.removeItem("ACCESS_TOKEN");
    router.reload();
  };

  const onDeleteAccountClick = () => {
    console.log("onDeleteAccountClick");
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

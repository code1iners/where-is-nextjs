import MobileLayout from "@components/mobile-layout";
import UserAvatar from "@components/user-avatar";
import clazz from "@libs/clients/clazz";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserMeResult } from "@pages/users/me";
import Link from "next/link";
import { userInfo } from "os";

type AccessType = "followings" | "followers";
interface FollowSearchForm {
  search: string;
}

const UsersMeFollows = () => {
  const { query } = useRouter();
  const [accessType, setAccessType] = useState<AccessType>(
    query["access-type"] as any
  );
  const onTabClick = (accessType: AccessType) => setAccessType(accessType);
  const { data } = useSWR<UserMeResult>("/api/v1/users/me");
  const [filteredUsers, setFilteredUsers] = useState<User[]>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FollowSearchForm>();

  const isFormValid = async ({ search }: FollowSearchForm) => {
    try {
      console.log(search);
    } catch (e) {
      console.error("[isFormValid]", e);
    } finally {
    }
  };

  useEffect(() => {
    switch (accessType) {
      case "followers":
        setFilteredUsers(data?.me.followers);
        break;

      case "followings":
        setFilteredUsers(data?.me.followings);
        break;
    }
  }, [accessType]);

  return (
    <MobileLayout seoTitle="Followings">
      <article className="space-y-5">
        {/* Search */}
        <section className="w-full">
          <form onSubmit={handleSubmit(isFormValid)}>
            <div className="flex items-center relative">
              <input
                className="input-text"
                {...register("search", {
                  required: "Enter email or username to find user.",
                })}
                type="text"
                placeholder="Email or Username.."
                autoCapitalize="off"
                autoComplete="off"
                required
                list="user-list"
              />

              <datalist id="user-list">
                {filteredUsers?.map((user) => (
                  <option key={user.id} value={user.name} />
                ))}
              </datalist>

              <button type="submit" className="cursor-pointer absolute right-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            {errors?.search ? (
              <span className="block mt-2 mx-2 error-message">
                {errors.search.message}
              </span>
            ) : null}
          </form>
        </section>

        <section className="border border-gray-500 rounded-md">
          {/* Tabs */}
          <div className="flex justify-around items-center border-black relative">
            <button
              onClick={() => onTabClick("followings")}
              className="p-2 grow border-b transition-all"
            >
              Followings
            </button>
            <button
              onClick={() => onTabClick("followers")}
              className="p-2 grow border-b transition-all"
            >
              Followers
            </button>
            <div
              className={clazz(`
                w-1/2 absolute bottom-0 h-[1px] bg-purple-500 transition-all 
                ${
                  accessType === "followers"
                    ? "translate-x-1/2"
                    : "-translate-x-1/2"
                }
              `)}
            ></div>
          </div>

          {/* User list */}
          <div>
            <ul>
              {filteredUsers?.length ? (
                filteredUsers?.map((user) => (
                  <Link
                    key={user.id}
                    href={{
                      pathname: `/users/${user.id}`,
                      query: {
                        name: user.name,
                      },
                    }}
                  >
                    <a>
                      <li
                        key={user.id}
                        className="p-2 flex justify-between items-center hover:text-purple-500"
                      >
                        <div className="flex space-x-2 items-center grow cursor-pointer">
                          <UserAvatar user={user} />

                          <div className="flex flex-col justify-center">
                            <span className="text-sm text-gray-400">
                              {user.email}
                            </span>
                            <span className="text-sm tracking-wider">
                              {user.name}
                            </span>
                          </div>
                        </div>
                        <div className="cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </li>
                    </a>
                  </Link>
                ))
              ) : (
                <div className="flex justify-center items-center p-4">
                  <h1 className="text-gray-400 text-sm tracking-wider">
                    Try to search to find specific user.
                  </h1>
                </div>
              )}
            </ul>
          </div>
        </section>
      </article>
    </MobileLayout>
  );
};

export default UsersMeFollows;

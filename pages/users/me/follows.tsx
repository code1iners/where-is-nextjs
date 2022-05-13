import MobileLayout from "@components/mobile-layout";
import clazz from "@libs/clients/clazz";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserMeResult, UserWithLocations } from "@pages/users/me";
import useMutation from "@libs/clients/useMutation";
import UserHorizontalItemWithAnimation from "@components/user-horizontal-item-with-animation";
import UserHorizontalFollowConfirmItemWithAnimation from "@components/user-horizontal-follow-confirm-item-with-animation";

type AccessType = "followings" | "followers";
interface FollowSearchForm {
  search: string;
}

const UsersMeFollows = () => {
  const { query, push } = useRouter();
  const { register, watch, getValues } = useForm<FollowSearchForm>();
  const [accessType, setAccessType] = useState<AccessType>(
    query["access-type"] as any
  );
  const onTabClick = (accessType: AccessType) => setAccessType(accessType);
  const { data, mutate } = useSWR<UserMeResult>("/api/v1/users/me");

  const [filteredFollowUsers, setFilteredFollowUsers] = useState<User[]>();
  const [typedUsers, setTypedUsers] = useState<User[]>();
  const [receiveFollowingOffers, setReceiveFollowingOffers] = useState<
    UserWithLocations[]
  >([]);
  const [sendFollowingOffers, setSendFollowingOffers] = useState<
    UserWithLocations[]
  >([]);
  const [
    modify,
    {
      ok: modifyOk,
      error: modifyError,
      loading: modifyLoading,
      data: modifyData,
    },
  ] = useMutation("/api/v1/users/me/modify");

  // Watch search keyword
  useEffect(() => {
    const searched = getValues("search");
    if (filteredFollowUsers?.length && !!searched) {
      const typedUsers = filteredFollowUsers.filter((user) =>
        user.name?.toLowerCase().startsWith(searched.toLowerCase())
      );
      setTypedUsers(typedUsers);
    } else {
      setTypedUsers([]);
    }
  }, [watch("search"), filteredFollowUsers]);

  useEffect(() => {
    if (data && data.me) {
      switch (accessType) {
        case "followers":
          setFilteredFollowUsers(data.me.followers);
          break;

        case "followings":
          setFilteredFollowUsers(data.me.followings);
          break;
      }

      setReceiveFollowingOffers(data.me.receiveFollowingOffers);
      setSendFollowingOffers(data.me.sendFollowingOffers);
    }
  }, [accessType, setFilteredFollowUsers, data]);

  const onUserClick = (user: UserWithLocations) => {
    push({ pathname: `/users/${user.id}`, query: { name: user.name } });
  };

  const onReceiveReactionClick = (
    user: UserWithLocations,
    isAgree: boolean
  ) => {
    if (modifyLoading) return;

    setReceiveFollowingOffers((previous) => {
      return previous.filter(({ id }) => id !== user.id);
    });

    modify({
      method: "PATCH",
      data: {
        receiveOfferReaction: {
          targetUserId: user.id,
          isAgree,
        },
      },
    });
  };

  const onSendReactionClick = (user: User) => {
    if (modifyLoading) return;

    console.log(sendFollowingOffers, user);
    setSendFollowingOffers((previous) => {
      return previous.filter(({ id }) => id !== user.id);
    });

    modify({
      method: "PATCH",
      data: {
        sendOfferResponse: {
          targetUserId: user.id,
        },
      },
    });
  };

  useEffect(() => {
    if (modifyOk) {
      mutate();
    }

    if (modifyError) {
      console.error("[modify]", modifyError);
    }
  }, [modifyOk, modifyError, modifyLoading]);

  return (
    <MobileLayout seoTitle="Follow information">
      <article className="space-y-5">
        {/* Search */}
        <section className="w-full shadow-md">
          <div>
            <div className="flex items-center relative">
              <input
                className="input-text grow"
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
                {filteredFollowUsers?.map((user) => (
                  <option key={user.id} value={user.name} />
                ))}
              </datalist>
            </div>
          </div>
        </section>

        {/* Follow section */}
        <section className="border border-gray-500 rounded-md shadow-md">
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
            <div>
              {getValues("search") ? (
                typedUsers?.length ? (
                  typedUsers?.map((user, index) => (
                    <UserHorizontalItemWithAnimation
                      key={user.id}
                      user={user}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center p-4">
                    <h1 className="text-gray-400 text-sm tracking-wider">
                      Does not found any users.
                    </h1>
                  </div>
                )
              ) : filteredFollowUsers?.length ? (
                filteredFollowUsers?.map((user, index) => (
                  <UserHorizontalItemWithAnimation
                    key={user.id}
                    user={user}
                    index={index}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center p-4">
                  <h1 className="text-gray-400 text-sm tracking-wider">
                    Try to search to find specific user.
                  </h1>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Received offers section */}
        {receiveFollowingOffers.length ? (
          <section className="border border-gray-500 rounded-md shadow-md">
            <div className="border border-b-gray-500 p-2 flex justify-between items-center cursor-default">
              <h3 className="text-sm hover:text-purple-500 transition-colors">
                받은 팔로우 요청
              </h3>
              <span className="text-xs hover:text-purple-500 transition-colors">
                총 {receiveFollowingOffers.length} 개의 요청
              </span>
            </div>

            <div className="divide-y divide-gray-300 flex flex-col mx-2">
              {receiveFollowingOffers.map((user, index) => (
                <UserHorizontalFollowConfirmItemWithAnimation
                  key={user.id}
                  index={index}
                  user={user}
                  onUserClick={() => onUserClick(user)}
                  onAgreeClick={() => onReceiveReactionClick(user, true)}
                  onDisagreeClick={() => onReceiveReactionClick(user, false)}
                  isLoading={modifyLoading}
                  enableAgreeButton
                  enableDisagreeButton
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Received offers section */}
        {sendFollowingOffers.length ? (
          <section className="border border-gray-500 rounded-md shadow-md">
            <div className="border border-b-gray-500 p-2 flex justify-between items-center cursor-default">
              <h3 className="text-sm hover:text-purple-500 transition-colors">
                보낸 팔로우 요청
              </h3>
              <span className="text-xs hover:text-purple-500 transition-colors">
                총 {sendFollowingOffers.length} 개의 요청
              </span>
            </div>

            <div className="divide-y divide-gray-300 flex flex-col mx-2">
              {sendFollowingOffers.map((user, index) => (
                <UserHorizontalFollowConfirmItemWithAnimation
                  key={user.id}
                  index={index}
                  user={user}
                  onUserClick={() => onUserClick(user)}
                  onDisagreeClick={() => onSendReactionClick(user)}
                  isLoading={modifyLoading}
                  enableDisagreeButton
                />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </MobileLayout>
  );
};

export default UsersMeFollows;

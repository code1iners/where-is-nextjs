import { NextPage } from "next";
import MobileLayout from "@components/mobile-layout";
import HorizontalDivider from "@components/horizontal-divider";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import EmptyAvatar from "@components/empty-avatar";
import UserImageAvatar from "@components/user-image-avatar";
import LoadingTextWavy from "@components/loading-text-wavy";
import useMutation from "@libs/clients/useMutation";
import UserAvatar from "@components/user-avatar";
import { useRouter } from "next/router";

interface MemberSearchForm {
  memberName: string;
}

interface Member extends User {
  isFollower: boolean;
}

const Additions: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm<MemberSearchForm>();
  const [foundMembers, setFoundMembers] = useState<Member[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [
    membership,
    {
      ok: membershipOk,
      data: membershipData,
      error: membershipError,
      loading: membershipLoading,
    },
  ] = useMutation("/api/v1/users/followings");

  const isFormValid = async ({ memberName }: MemberSearchForm) => {
    // Is loading?
    if (isSearchLoading) return;

    setIsSearchLoading(true);
    try {
      const { ok, users, error } = await fetch(
        `/api/v1/users/search?q=${memberName}`
      ).then((res) => res.json());
      if (!ok) return console.error("[isFormValid]", error);

      console.log(users);

      setFoundMembers(users);
    } catch (e) {
      console.error("[isFormValid]", e);
    } finally {
      setIsSearchLoading((previous) => !previous);
    }
  };

  const onFollowingClick = (id: number) => {
    try {
      if (membershipLoading) return;
      membership({ data: { id } });

      const originMembers = [...foundMembers];
      const updatedMembers = originMembers.map((member) => {
        if (member.id === id) member.isFollower = !member.isFollower;
        return member;
      });
      setFoundMembers(updatedMembers);
    } catch (e) {
      console.error("[onFollowingClick]", e);
    }
  };

  useEffect(() => {
    if (membershipOk && membershipData) {
      const {
        isFollowing,
        targetUser: { id },
      } = membershipData;
      setFoundMembers((previous) => {
        const foundMemberIndex = previous.findIndex(
          (member) => member.id === id
        );
        previous[foundMemberIndex].isFollower = isFollowing;
        return [...previous];
      });
    }

    if (membershipError) {
      console.error(membershipError);
    }
  }, [membershipOk, membershipData, membershipError]);

  const onMemberClick = (member: User) =>
    router.push({
      pathname: `/users/${member.id}`,
      query: { name: member.name },
    });

  return (
    <MobileLayout seoTitle="Member additions">
      <header className="flex flex-col items-center gap-2">
        {/* Title */}
        <h1 className="text-lg tracking-wider">멤버 추가</h1>
        {/* Search */}
        <form
          className="flex justify-between items-center border rounded-md w-full px-4 py-2"
          onSubmit={handleSubmit(isFormValid)}
        >
          <input
            {...register("memberName", {
              required: "Member name is required.",
            })}
            className="focus:outline-0 flex-grow"
            type="text"
            placeholder="Search.."
            autoCapitalize="off"
            autoComplete="off"
            required
          />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 cursor-pointer"
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
        </form>
      </header>

      <HorizontalDivider margin="sm" />

      <article>
        <section className="flex flex-col gap-3 divide-y">
          {isSearchLoading ? (
            <LoadingTextWavy />
          ) : foundMembers.length ? (
            foundMembers.map((member) => (
              <div
                className="flex justify-between items-center pt-1"
                key={member.id}
              >
                <div className="flex items-center gap-3">
                  <UserAvatar
                    user={member}
                    onClick={() => onMemberClick(member)}
                    hover
                  />

                  <div
                    className="flex flex-col"
                    onClick={() => onMemberClick(member)}
                  >
                    <span className="tracking-wider text-md cursor-pointer">
                      {member.name}
                    </span>
                    <span className="tracking-wider text-gray-400 text-sm cursor-pointer">
                      {member.email}
                    </span>
                  </div>
                </div>
                {/* Add member button */}
                <button onClick={() => onFollowingClick(member.id)}>
                  {member.isFollower ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 border border-red-500 p-1 rounded-md hover:bg-red-500 hover:text-white transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 border border-purple-500 p-1 rounded-md hover:bg-purple-500 hover:text-white transition"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))
          ) : (
            <span className="flex justify-center m-20 text-gray-400 tracking-widest text-sm cursor-default whitespace-nowrap hover:scale-105 transition">
              Try find member to follow.
            </span>
          )}
        </section>
      </article>
    </MobileLayout>
  );
};

export default Additions;

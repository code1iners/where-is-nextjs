import { NextPage } from "next";
import MobileLayout from "@components/mobile-layout";
import HorizontalDivider from "@components/horizontal-divider";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import LoadingTextWavy from "@components/loading-text-wavy";
import useMutation from "@libs/clients/useMutation";
import { useRouter } from "next/router";
import UserHorizontalFollowItem from "@components/user-horizontal-follow-item";

interface MemberSearchForm {
  memberName: string;
}

export interface Member extends User {
  isFollower: boolean;
}

const Additions: NextPage = () => {
  const router = useRouter();

  const { register, handleSubmit, getValues } = useForm<MemberSearchForm>();
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

  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const onMoreClick = async () => {
    if (isMoreLoading) return;

    const lastUser = foundMembers[foundMembers.length - 1];
    if (lastUser) {
      setIsMoreLoading(true);
      const q = getValues("memberName");
      try {
        const { ok, users, error } = await fetch(
          `/api/v1/users/search?q=${q}&lastId=${lastUser?.id}`
        ).then((res) => res.json());
        if (!ok) return console.error("[onMoreClick]", error);
        setFoundMembers((previous) => [...previous, ...users]);
      } catch (e) {
        console.error("[onMoreClick]", e);
      } finally {
        setIsMoreLoading(false);
      }
    }
  };

  return (
    <MobileLayout seoTitle="Member additions" className="h-screen">
      <header className="flex flex-col items-center">
        {/* Title */}
        <h1 className="text-lg tracking-wider">멤버 추가</h1>
        {/* Search */}
        <form
          className="flex justify-between items-center border rounded-md w-full"
          onSubmit={handleSubmit(isFormValid)}
        >
          <input
            {...register("memberName", {
              required: "Member name is required.",
            })}
            className="focus:outline-0 grow px-4 py-2"
            type="text"
            placeholder="Search.."
            autoCapitalize="off"
            autoComplete="off"
            required
          />
          <button type="submit" className="absolute right-8">
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

      <article className="h-4/5 overflow-y-scroll no-scrollbar border border-gray-2200 rounded-md px-3 py-2">
        <section>
          {isSearchLoading ? (
            <LoadingTextWavy />
          ) : foundMembers.length ? (
            <div className="flex flex-col gap-3 divide-y">
              {foundMembers.map((member) => (
                <UserHorizontalFollowItem
                  key={member.id}
                  user={member}
                  isFollowLoading={membershipLoading}
                  onItemClick={() => onMemberClick(member)}
                  onFollowClick={() => onFollowingClick(member.id)}
                />
              ))}
              <div className="pt-2 flex justify-center items-center">
                {isMoreLoading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <button
                    className="w-full text-purple-500 tracking-widest hover:scale-110 hover:text-purple-600 transition-transform"
                    onClick={onMoreClick}
                  >
                    more
                  </button>
                )}
              </div>
            </div>
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

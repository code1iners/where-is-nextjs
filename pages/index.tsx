import EmptyAvatar from "@components/empty-avatar";
import UserAvatar from "@components/user-avatar";
import useCloudflare from "@libs/clients/useCloudflare";
import useMutation from "@libs/clients/useMutation";
import useNaverMap from "@libs/clients/useNaverMap";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { UserMeResult } from "./users/me";

const Home: NextPage = () => {
  const {
    createCenter,
    setCurrentPosition,
    createMarker,
    makeCircleMarkerIconContentByUrl,
    makeCircleMarkerIconContentByName,
  } = useNaverMap();
  const { data } = useSWR<UserMeResult>("/api/v1/users/me");
  const [
    updateCoords,
    {
      ok: updateCoordsOk,
      error: updateCoordsError,
      loading: updateCoordsLoading,
    },
  ] = useMutation("/api/v1/users/me/modify");
  const { createImageUrl } = useCloudflare();
  const [naverMap, setNaverMap] = useState<naver.maps.Map>();
  const [myMarker, setMyMarker] = useState<naver.maps.Marker>();

  useEffect(() => {
    if (data) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        // Update my coords.
        await updateUserCoords(coords.latitude, coords.longitude);

        const center = createCenter(coords.latitude, coords.longitude);
        const map = setCurrentPosition({
          center,
          zoom: 17,
        });
        map.setMapTypeId(naver.maps.MapTypeId.TERRAIN);

        // Set marker
        createMarker({
          map,
          position: center.destinationPoint(90, 15),
          ...(data.me.avatar && {
            icon: {
              content: makeCircleMarkerIconContentByUrl(
                createImageUrl({
                  imageId: data.me.avatar + "",
                  variant: "avatar",
                })
              ),
            },
          }),
          zIndex: 100,
        });

        // Map click event listener.
        // const clickListener = naver.maps.Event.addListener(
        //   map,
        //   "click",
        //   function (e) {
        //     console.log(e);
        //   }
        // );

        data.me.following.forEach((followingUser) => {
          const center = createCenter(
            Number(followingUser.latitude),
            Number(followingUser.longitude)
          );

          createMarker({
            map,
            position: center.destinationPoint(90, 15),
            title: followingUser.name,
            icon: {
              content: followingUser.avatar
                ? makeCircleMarkerIconContentByUrl(
                    createImageUrl({
                      imageId: followingUser.avatar + "",
                      variant: "avatar",
                    })
                  )
                : makeCircleMarkerIconContentByName(followingUser.name),
            },
          });
        });
      });
    }
  }, [data]);

  const updateUserCoords = (latitude: number, longitude: number) => {
    if (updateCoordsLoading) return;
    updateCoords({
      method: "PATCH",
      data: {
        latitude,
        longitude,
      },
    });
  };

  useEffect(() => {
    if (updateCoordsOk) {
    }

    if (updateCoordsError) {
      console.error("[updateCoordsError]", updateCoordsError);
    }
  }, [updateCoordsOk, updateCoordsError]);

  const onMemberClick = (id: number) => {
    console.log(id);
  };

  return (
    <div>
      <Head>
        <title>Home | Where is</title>
      </Head>

      <main className="relative w-full h-screen z-0">
        <div
          id="map"
          className="absolute"
          style={{
            width: "100%",
            height: "100vh",
          }}
        ></div>

        <Link href={"/settings"}>
          <a className="absolute right-2 top-2 p-2 cursor-pointer rounded-full bg-white transition duration-300 border-gray-300 border-2 hover:border-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
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
          </a>
        </Link>

        <ul className="absolute left-3 bottom-3 flex items-center gap-2">
          <Link href={"/members/additions"}>
            <a>
              <li className="p-2 bg-white rounded-full">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </li>
            </a>
          </Link>

          {data?.me.following.length
            ? data?.me.following.map((user) =>
                user.avatar ? (
                  <li key={user.id}>
                    <UserAvatar
                      imageId={user.avatar}
                      width={35}
                      height={35}
                      variant="avatar"
                      alt="Avatar"
                      onClick={() => onMemberClick(user.id)}
                    />
                  </li>
                ) : (
                  <li key={user.id}>
                    <EmptyAvatar
                      name={user.name}
                      size="sm"
                      onClick={() => onMemberClick(user.id)}
                    />
                  </li>
                )
              )
            : null}
        </ul>
      </main>
    </div>
  );
};

export default Home;

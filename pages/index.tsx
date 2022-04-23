import EmptyAvatar from "@components/empty-avatar";
import HomeFooterMembers from "@components/home-footer-members";
import UserAvatar from "@components/user-avatar";
import useCloudflare from "@libs/clients/useCloudflare";
import useMutation from "@libs/clients/useMutation";
import useNaverMap from "@libs/clients/useNaverMap";
import { User } from "@prisma/client";
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
  const [selectedMember, setSelectedMember] = useState<User>();
  const [naverMap, setNaverMap] = useState<naver.maps.Map>();

  useEffect(() => {
    let onMapClickListener: naver.maps.MapEventListener;
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
        map.panBy(new naver.maps.Point(35, 30));

        naver.maps.Event.addListener(map, "drag", (e) => {
          console.log("dragging");
        });

        setNaverMap(map);

        // Set marker
        const myMarker = createMarker({
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
        myMarker.set("data", data.me);
        naver.maps.Event.addListener(myMarker, "click", (e) => {
          setSelectedMember(data.me);
        });

        // Map click event listener.
        onMapClickListener = naver.maps.Event.addListener(map, "click", (e) => {
          setSelectedMember(undefined);
        });

        data.me.following.forEach((followingUser) => {
          const center = createCenter(
            Number(followingUser.latitude),
            Number(followingUser.longitude)
          );

          const marker = createMarker({
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
          marker.set("data", followingUser);
          naver.maps.Event.addListener(marker, "click", (e) => {
            setSelectedMember(followingUser);
          });
        });
      });
    }

    return () => {
      naver.maps.Event.removeListener(onMapClickListener);
    };
  }, []);

  useEffect(() => {
    if (selectedMember && naverMap) {
      console.log(selectedMember);
      const { latitude, longitude } = selectedMember;
      console.log(Number(latitude), Number(longitude));

      const center = new naver.maps.LatLng(Number(latitude), Number(longitude));
      naverMap.setCenter(center);
      naverMap.panBy(new naver.maps.Point(35, 30));
    }
  }, [selectedMember, naverMap]);

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

        {/* Footer members */}
        {data?.me ? (
          <HomeFooterMembers me={data.me} onSelectMember={setSelectedMember} />
        ) : null}
      </main>
    </div>
  );
};

export default Home;

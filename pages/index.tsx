import HomeFooterMembers from "@components/home-footer-members";
import LoadingTextWavy from "@components/loading-text-wavy";
import NaverMap from "@components/naver-map";
import SettingFloatingButton from "@components/setting-floating-button";
import useCloudflare from "@libs/clients/useCloudflare";
import useMutation from "@libs/clients/useMutation";
import useNaverMap from "@libs/clients/useNaverMap";
import { User } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
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
  const [mapReady, setMapReady] = useState(false);

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
        map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
        map.panBy(new naver.maps.Point(35, 30));

        naver.maps.Event.addListener(map, "drag", (e) => {
          console.log("dragging");
        });

        naver.maps.Event.addListener(map, "load", (e) => {
          console.log("loaded");
        });

        setNaverMap(map);

        // Set marker
        const myMarker = createMarker({
          map,
          position: center.destinationPoint(90, 15),
          icon: {
            content: data.me.avatar
              ? makeCircleMarkerIconContentByUrl(
                  createImageUrl({
                    imageId: data.me.avatar + "",
                    variant: "avatar",
                  })
                )
              : makeCircleMarkerIconContentByName(data.me.name),
          },
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

          setMapReady(true);
        });
      });
    }

    return () => {
      naver.maps.Event.removeListener(onMapClickListener);
    };
  }, [data]);

  useEffect(() => {
    if (selectedMember && mapReady && naverMap) {
      const { latitude, longitude } = selectedMember;
      const center = new naver.maps.LatLng(Number(latitude), Number(longitude));
      naverMap.setCenter(center);
      naverMap.panBy(new naver.maps.Point(35, 30));
    }
  }, [selectedMember, mapReady, naverMap]);

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
    if (updateCoordsError)
      console.error("[updateCoordsError]", updateCoordsError);
  }, [updateCoordsError]);

  return (
    <>
      <Head>
        <title>Home | Where is</title>
      </Head>

      <main className="">
        {/* Header setting button */}
        <SettingFloatingButton position="top-right" />

        {/* Naver map */}
        <NaverMap onLoad={() => setMapReady(true)} />
        {mapReady ? null : <LoadingTextWavy />}

        {/* Footer members */}
        {data?.me ? (
          <HomeFooterMembers me={data.me} onSelectMember={setSelectedMember} />
        ) : null}
      </main>
    </>
  );
};

export default Home;

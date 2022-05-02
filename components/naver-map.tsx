import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useRecoilState } from "recoil";
import { selectedMemberAtom } from "atoms";
import { motion, AnimatePresence } from "framer-motion";
import { UserMeResult } from "@pages/users/me";
import LoadingTextWavy from "@components/loading-text-wavy";
import useCloudflare from "@libs/clients/useCloudflare";
import useNaverMap from "@libs/clients/useNaverMap";
import useMutation from "@libs/clients/useMutation";
import clazz from "@libs/clients/clazz";
import usePrisma from "@libs/clients/usePrisma";

const NaverMap = () => {
  const { data } = useSWR<UserMeResult>("/api/v1/users/me");

  const [selectedMember, setSelectedMember] =
    useRecoilState(selectedMemberAtom);
  const {
    createMap,
    createPosition,
    createMarker,
    makeCircleMarkerIconContentByName,
    makeCircleMarkerIconContentByUrl,
  } = useNaverMap();
  const { createImageUrl } = useCloudflare();
  const { convertDate } = usePrisma();
  const naverMapRef = useRef(null);
  const [onLoaded, setOnLoaded] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates>();
  const [naverMapCenter, setNaverMapCenter] = useState<naver.maps.LatLng>();
  const [naverMap, setNaverMap] = useState<naver.maps.Map>();
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

  const [
    updateCoords,
    {
      ok: updateCoordsOk,
      error: updateCoordsError,
      loading: updateCoordsLoading,
    },
  ] = useMutation("/api/v1/users/me/modify");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (updateCoordsLoading) return;
        updateCoords({
          method: "PATCH",
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        setCoords(coords);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
    return () => {
      // navigator.geolocation.clearWatch(watchID);
      setSelectedMember(undefined);
    };
  }, []);

  useEffect(() => {
    if (updateCoordsOk) {
    }
    if (updateCoordsError) {
      console.error("[updateCoordsError]", updateCoordsError);
    }
  }, [updateCoordsOk, updateCoordsError]);

  useEffect(() => {
    if (coords) {
      const center = createPosition(coords.latitude, coords.longitude);
      const map = createMap({
        center,
        zoom: 17,
      });

      map.setMapTypeId(naver.maps.MapTypeId.NORMAL);
      map.panBy(new naver.maps.Point(30, 30));
      setNaverMap(map);
      setNaverMapCenter(center);
    }
  }, [coords]);

  useEffect(() => {
    let observer: MutationObserver;
    if (naverMapRef.current) {
      // Create an observer instance linked to the callback function
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            setOnLoaded(true);
          } else if (mutation.type === "attributes") {
            setOnLoaded(true);
          }
        }
      });

      // Start observing the target node for configured mutations
      observer.observe(naverMapRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    return () => {
      observer?.disconnect();
    };
  }, [naverMapRef]);

  useEffect(() => {
    if (onLoaded && data && naverMapCenter) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);

      // Draw me.
      const myMarker = createMarker({
        map: naverMap,
        position: createPosition(
          data.me?.latitude ?? naverMapCenter.lat(),
          data.me?.longitude ?? naverMapCenter.lng()
        ),
        icon: {
          content: data.me?.avatar
            ? makeCircleMarkerIconContentByUrl(
                createImageUrl({
                  imageId: data.me?.avatar + "",
                  variant: "avatar",
                })
              )
            : makeCircleMarkerIconContentByName(data.me?.name),
        },
        zIndex: 100,
      });
      myMarker.set("data", data.me);
      setMarkers((previous) => [...previous, myMarker]);
      naver.maps.Event.addListener(myMarker, "click", (e) => {
        setSelectedMember(data.me);
      });

      // Draw members.
      const filteredMembers = data?.me.followings.filter(
        (members) => !!members.latitude && !!members.longitude
      );
      filteredMembers.forEach((member) => {
        const center = createPosition(
          Number(member.latitude),
          Number(member.longitude)
        );

        const memberMarker: any = createMarker({
          map: naverMap,
          position: center.destinationPoint(90, 15),
          title: member.name,
          icon: {
            content: member.avatar
              ? makeCircleMarkerIconContentByUrl(
                  createImageUrl({
                    imageId: member.avatar + "",
                    variant: "avatar",
                  })
                )
              : makeCircleMarkerIconContentByName(member?.name),
          },
        });

        memberMarker.set("data", member);
        memberMarker.set("id", `marker-user-${member.id}`);

        setMarkers((previous) => [...previous, memberMarker]);

        naver.maps.Event.addListener(memberMarker, "click", (e) => {
          setSelectedMember(member);
        });
      });
    }
  }, [onLoaded, data, naverMapCenter]);

  useEffect(() => {
    if (naverMap && selectedMember) {
      const { latitude, longitude } = selectedMember;
      const center = new naver.maps.LatLng(Number(latitude), Number(longitude));
      naverMap.setCenter(center);
      naverMap.panBy(new naver.maps.Point(30, 30));

      markers.forEach((marker: any) => {
        if (marker.data.id === selectedMember.id) {
          marker.setZIndex(100);
        } else {
          marker.setZIndex(0);
        }
      });
    }
  }, [naverMap, selectedMember, markers]);

  return (
    <article>
      <section className={clazz(onLoaded ? "invisible" : "visible")}>
        <LoadingTextWavy />
      </section>

      <section
        ref={naverMapRef}
        id="naverMap"
        className={clazz("absolute", onLoaded ? "visible" : "invisible")}
        style={{
          width: "100%",
          height: "100vh",
        }}
      ></section>

      {/* Modals */}
      <AnimatePresence>
        {onLoaded && selectedMember ? (
          <motion.div
            initial={{
              scale: 0,
              rotate: 90,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            exit={{
              scale: 0,
              rotate: 90,
            }}
            className="absolute left-2 top-2 rounded-md py-1 px-2 bg-white border border-black cursor-default"
          >
            <div className="flex justify-between items-center text-gray-600">
              <Link
                href={{
                  pathname: `/users/${selectedMember.id}`,
                  query: { name: selectedMember.name },
                }}
              >
                <div className="flex justify-start items-center space-x-1 cursor-pointer hover:text-purple-500 hover:scale-105 transition-transform">
                  <span className="">{selectedMember.name}</span>

                  <a>
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
                        d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                </div>
              </Link>
              <svg
                onClick={() => setSelectedMember(undefined)}
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer hover:text-purple-500 hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-xs space-x-1 text-gray-500">
              <span>Last access</span>
              <span>:</span>
              <span className="">{convertDate(selectedMember.updatedAt)}</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
};

export default NaverMap;

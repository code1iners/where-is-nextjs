import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useRecoilState } from "recoil";
import { selectedMemberAtom } from "atoms";
import { UserMeResult } from "@pages/users/me";
import LoadingTextWavy from "@components/loading-text-wavy";
import useCloudflare from "@libs/clients/useCloudflare";
import useNaverMap from "@libs/clients/useNaverMap";
import useMutation from "@libs/clients/useMutation";
import clazz from "@libs/clients/clazz";
import MapUserInfoBox from "./map-user-info-box";
import useLocation from "@libs/clients/useLocation";

const NaverMap = () => {
  const { data, mutate: meMutate } = useSWR<UserMeResult>("/api/v1/users/me");

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
  const { getLastCoordinates } = useLocation();
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
      removeMarkers();
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

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  useEffect(() => {
    if (onLoaded && data && naverMapCenter) {
      removeMarkers();

      // Parse locations.

      const myCoordinates = getLastCoordinates(data.me.locations);
      if (myCoordinates) {
        const { latitude, longitude } = myCoordinates;
        // Draw me.
        const myMarker: any = createMarker({
          map: naverMap,
          position: createPosition(
            latitude ?? naverMapCenter.lat(),
            longitude ?? naverMapCenter.lng()
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
        myMarker.eventTarget?.classList.add("animate-baam");
        setMarkers((previous) => [...previous, myMarker]);
        naver.maps.Event.addListener(myMarker, "click", (e) => {
          setSelectedMember(data.me);
        });
      }

      // Draw members.
      const filteredMembers = data?.me?.followings.filter((members) =>
        Boolean(getLastCoordinates(members.locations))
      );

      filteredMembers.forEach((member, index) => {
        const memberLastCoord = getLastCoordinates(member.locations);
        if (memberLastCoord) {
          const center = createPosition(
            Number(memberLastCoord.latitude),
            Number(memberLastCoord.longitude)
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
          memberMarker.eventTarget?.classList.add("animate-baam");
          memberMarker.eventTarget?.classList.add(
            `animation-delay-${index + 1}00`
          );

          setMarkers((previous) => [...previous, memberMarker]);

          naver.maps.Event.addListener(memberMarker, "click", (e) => {
            setSelectedMember(member);
          });
        }
      });
    }
  }, [onLoaded, data, naverMapCenter]);

  useEffect(() => {
    if (naverMap && selectedMember) {
      const { locations } = selectedMember;
      const coords = getLastCoordinates(locations);
      if (coords) {
        const center = new naver.maps.LatLng(
          Number(coords.latitude),
          Number(coords.longitude)
        );
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
    }
  }, [naverMap, selectedMember, markers]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefreshClick = () => {
    setIsRefreshing(true);
    meMutate();
    new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(false);
      }, Math.floor(Math.random() * 1000));
    }).then(setIsRefreshing);
  };

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

      {/* Floating action buttons */}
      <div className="absolute right-5 bottom-20 bg-white rounded-full">
        <button
          className={clazz(
            "flex justify-center items-center p-1 waving-hand",
            isRefreshing ? "animate-spin-reverse" : ""
          )}
          onClick={onRefreshClick}
        >
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <MapUserInfoBox
        isVisible={Boolean(onLoaded && selectedMember)}
        user={selectedMember}
        onCloseClick={() => setSelectedMember(undefined)}
      />
    </article>
  );
};

export default NaverMap;

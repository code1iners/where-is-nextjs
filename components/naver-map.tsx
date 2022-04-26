import useCloudflare from "@libs/clients/useCloudflare";
import useNaverMap from "@libs/clients/useNaverMap";
import { UserMeResult } from "pages/users/me";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { useRecoilState } from "recoil";
import { selectedMemberAtom } from "atoms";
import useMutation from "@libs/clients/useMutation";
import LoadingTextWavy from "./loading-text-wavy";

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
  const div = useRef(null);
  const [onLoaded, setOnLoaded] = useState(false);
  const [coords, setCoords] = useState<GeolocationCoordinates>();
  const [naverMapCenter, setNaverMapCenter] = useState<naver.maps.LatLng>();
  const [naverMap, setNaverMap] = useState<naver.maps.Map>();

  const [
    updateCoords,
    {
      ok: updateCoordsOk,
      error: updateCoordsError,
      loading: updateCoordsLoading,
    },
  ] = useMutation("/api/v1/users/me/modify");

  useEffect(
    () =>
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        if (updateCoordsLoading) return;
        updateCoords({
          method: "PATCH",
          data: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        setCoords(coords);
      }),
    []
  );

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
    if (div.current) {
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
      observer.observe(div.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    return () => {
      observer?.disconnect();
    };
  }, [div]);

  useEffect(() => {
    if (onLoaded && data && naverMapCenter) {
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
      naver.maps.Event.addListener(myMarker, "click", (e) => {
        setSelectedMember(data.me);
      });

      // Draw members.
      const filteredMembers = data.me.following.filter(
        (members) => members.latitude && members.longitude
      );
      filteredMembers.forEach((member) => {
        const center = createPosition(
          Number(member.latitude),
          Number(member.longitude)
        );

        const marker = createMarker({
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
        marker.set("data", member);
        naver.maps.Event.addListener(marker, "click", (e) => {
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
      naverMap.panBy(new naver.maps.Point(35, 30));
    }
  }, [naverMap, selectedMember]);

  return (
    <section
      ref={div}
      id="map"
      className="absolute"
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      {onLoaded ? null : <LoadingTextWavy />}
    </section>
  );
};

export default NaverMap;

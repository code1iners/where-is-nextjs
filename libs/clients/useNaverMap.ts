const useNaverMap = () => {
  const createCenter = (latitude: number, longitude: number) =>
    new naver.maps.LatLng(latitude, longitude);

  const setCurrentPosition = (
    options: naver.maps.MapOptions | undefined
  ): naver.maps.Map => new naver.maps.Map("map", options);

  const createMarker = (options: naver.maps.MarkerOptions): naver.maps.Marker =>
    new naver.maps.Marker(options);

  const makeCircleMarkerIconContentByName = (name: string, ...rest: any) => {
    const displayName = name.length ? name[0].toUpperCase() : null;
    console.log(displayName);

    return `<div
              class="rounded-full object-cover bg-purple-400 hover:bg-purple-500 flex justify-center items-center transition hover:scale-105"
              style="width:40px;height:40px;" ${{ ...rest }}>
              <span>${displayName}</span>
            </div>`;
  };

  const makeCircleMarkerIconContentByUrl = (imageUrl: string, ...rest: any) => {
    return `<img
              class="rounded-full object-cover hover:scale-105 transition"
              style="width:40px;height:40px"
              src="${imageUrl}"
              ${{ ...rest }} />`;
  };

  return {
    createCenter,
    setCurrentPosition,
    createMarker,
    makeCircleMarkerIconContentByName,
    makeCircleMarkerIconContentByUrl,
  };
};

export default useNaverMap;

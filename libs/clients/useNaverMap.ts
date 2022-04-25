const useNaverMap = () => {
  const createPosition = (latitude: number, longitude: number) =>
    new naver.maps.LatLng(latitude, longitude);

  const createMap = (
    options: naver.maps.MapOptions | undefined
  ): naver.maps.Map => new naver.maps.Map("map", options);

  const createMarker = (options: naver.maps.MarkerOptions): naver.maps.Marker =>
    new naver.maps.Marker(options);

  const makeCircleMarkerIconContentByName = (name: string, ...rest: any) => {
    const displayName = name.length ? name[0].toUpperCase() : null;
    return `<div
              class="rounded-full object-cover bg-purple-400 hover:bg-purple-500 flex justify-center items-center transition hover:scale-105 font-bold text-xl"
              style="width:50px;height:50px;" ${{ ...rest }}>
              <span>${displayName}</span>
            </div>`;
  };

  const makeCircleMarkerIconContentByUrl = (imageUrl: string, ...rest: any) => {
    return `<img
              class="rounded-full object-cover hover:scale-105 transition"
              style="width:50px;height:50px;"
              src="${imageUrl}"
              ${{ ...rest }} />`;
  };

  return {
    createPosition,
    createMap,
    createMarker,
    makeCircleMarkerIconContentByName,
    makeCircleMarkerIconContentByUrl,
  };
};

export default useNaverMap;

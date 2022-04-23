const useNaverMap = () => {
  const createCenter = (latitude: number, longitude: number) =>
    new naver.maps.LatLng(latitude, longitude);

  const setCurrentPosition = (
    options: naver.maps.MapOptions | undefined
  ): naver.maps.Map => new naver.maps.Map("map", options);

  const createMarker = (options: naver.maps.MarkerOptions): naver.maps.Marker =>
    new naver.maps.Marker(options);

  const makeCircleMarkerIconContentByName = (name: string, ...rest: any) => {
    return `<div
              class="w-10 h-10 rounded-full object-cover bg-purple-400 hover:bg-purple-500 flex justify-center items-center transition hover:scale-105"
              ${{ ...rest }}>
              ${name.length ? `<span>${name[0].toUpperCase()}</span>` : null}
            </div>`;
  };

  const makeCircleMarkerIconContentByUrl = (imageUrl: string, ...rest: any) => {
    return `<img
              class="w-10 h-10 rounded-full object-cover hover:scale-105 transition"
              ${{ ...rest }}
              src="${imageUrl}"/>`;
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

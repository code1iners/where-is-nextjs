const useNaverMap = () => {
  const createCenter = (latitude: number, longitude: number) =>
    new naver.maps.LatLng(latitude, longitude);

  const setCurrentPosition = (
    options: naver.maps.MapOptions | undefined
  ): naver.maps.Map => new naver.maps.Map("map", options);

  const createMarker = (options: naver.maps.MarkerOptions): naver.maps.Marker =>
    new naver.maps.Marker(options);

  return {
    createCenter,
    setCurrentPosition,
    createMarker,
  };
};

export default useNaverMap;

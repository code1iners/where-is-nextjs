import { Location } from "@prisma/client";

export interface GetLastCoordinatesResult {
  latitude: number;
  longitude: number;
}

const useLocation = () => {
  const getLastLocation = (locations: Location[]) => {
    if (locations && Array.isArray(locations) && locations.length) {
      return locations[0];
    }
  };

  const getLastCoordinates = (
    locations: Location[]
  ): GetLastCoordinatesResult | null => {
    const lastLocation = getLastLocation(locations);
    return lastLocation
      ? {
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
        }
      : null;
  };

  return {
    getLastLocation,
    getLastCoordinates,
  };
};

export default useLocation;

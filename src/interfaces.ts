export enum NetworkStatus {
  EMPTY,
  LOADING,
  COMPLETE,
  ERROR,
}

export interface ITruck {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  foodTypes: string[];
  vehicleType: string;
}

export interface ITruckResponse {
  objectid: string;
  applicant: string;
  facilitytype: string;
  locationdescription: string;
  fooditems: string;
  location: { coordinates: [number, number] };
}

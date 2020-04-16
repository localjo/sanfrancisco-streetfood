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
  status: string;
  objectid: string;
  applicant: string;
  facilitytype: string;
  locationdescription: string;
  fooditems: string;
  location: { coordinates: [number, number] };
}

export interface IViewportSettings {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  bearing?: number;
  pitch?: number;
}

export type ICoords = [number, number];
export type ICoordsArray = ICoords[];

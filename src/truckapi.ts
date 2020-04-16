import { ITruckResponse, ITruck } from './interfaces';

async function api<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
}

export const getTrucks = async function (): Promise<ITruck[]> {
  const resp = await api<[]>('https://data.sfgov.org/resource/rqzj-sfat.json');
  return resp
    .filter(({ status = '' }: ITruckResponse) => {
      return status.toUpperCase() === 'APPROVED';
    })
    .map(
      ({
        objectid = '',
        applicant = 'Name unknown',
        locationdescription = 'Address unknown',
        fooditems = '',
        facilitytype = 'Unknown',
        location = { coordinates: [0, 0] },
      }: ITruckResponse) => {
        const [longitude, latitude] = location.coordinates;
        return {
          id: objectid,
          name: applicant,
          latitude,
          longitude,
          address: locationdescription,
          foodTypes: fooditems.split(':'),
          vehicleType: facilitytype,
        };
      }
    );
};

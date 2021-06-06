import { ListingRequest } from '../models/ListingRequest';
import { Listing } from '../models/Listing';
import csvtojson from 'csvtojson';

export const getFormattedPrice = (average: number) =>
  `${process.env.CURRENCY} ${new Intl.NumberFormat(process.env.LOCALE, { maximumFractionDigits: 0 }).format(average)},-`;

export const convertCSVToListing = async (listingRequest: ListingRequest): Promise<Listing[]> => {
  const csvString = (await listingRequest.csv.toBuffer()).toString('utf8');
  const json: any[] = await csvtojson().fromString(csvString);
  return json as Listing[];
};
export const getAveragePrice = (value: Listing[]) =>
  value
    .map((v) => Number(v.price))
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }) / value.length;

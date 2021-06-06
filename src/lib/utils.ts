import { Listing } from '../models/Listing';

export const getFormattedPrice = (average: number) =>
  `${process.env.CURRENCY} ${new Intl.NumberFormat(process.env.LOCALE, { maximumFractionDigits: 0 }).format(average)},-`;

export const getAveragePrice = (value: Listing[]) =>
  value
    .map((v) => Number(v.price))
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }) / value.length;

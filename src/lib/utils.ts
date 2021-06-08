import { Listing } from '@models/Listing';

const numberFormat = new Intl.NumberFormat(process.env.LOCALE, { maximumFractionDigits: 0 });

export const getFormattedPrice = (average: number) => `${process.env.CURRENCY || '€'} ${numberFormat.format(average)},-`;

export const getFormattedMileage = (mileage: number) => `${numberFormat.format(mileage)} KM`;

export const getAveragePrice = (value: Listing[]) =>
  value
    .map((v) => Number(v.price))
    .reduce((previousValue, currentValue) => {
      return previousValue + currentValue;
    }) / value.length;

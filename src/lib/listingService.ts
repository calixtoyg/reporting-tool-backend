import { Listing } from '../models/Listing';
import _ from 'lodash';
import { MakeDistribution } from '../models/MakeDistribution';
import { getAveragePrice, getFormattedPrice } from './utils';
import { DealerDistribution } from '../models/DealerDistribution';

export const getPercentageDistributionOfMakers = (listings: Listing[]) => {
  console.log('Getting percentage distribution by makers');
  const groupedByMakers = _.toArray(_.groupBy(listings, 'make'));
  const makeDistributions = groupedByMakers.map((value: Listing[]) => {
    const percentage = (value.length / listings.length) * 100;
    return {
      make: value.find((v) => v).make,
      percentage: percentage.toFixed(2) + '%',
      rawPercentage: percentage,
    } as MakeDistribution;
  });
  return _.orderBy(makeDistributions, 'rawPercentage', 'desc');
};

export const getPercentageDistributionOfDealers = (listings: Listing[]) => {
  console.log('Getting percentage distribution by dealers');
  const groupedByMakers = _.toArray(_.groupBy(listings, 'seller_type'));
  const makeDistributions = groupedByMakers.map((value: Listing[]) => {
    const average = getAveragePrice(value);
    return {
      dealer: value.find((v) => v).seller_type,
      avg: getFormattedPrice(average),
      rawAvg: average,
    } as DealerDistribution;
  });
  return _.orderBy(makeDistributions, 'rawAvg', 'desc');
};

import { convertCSVToListing, getPercentageDistributionOfDealers, getPercentageDistributionOfMakers } from '../src/lib/listingService';
import { Listing } from '../src/models/Listing';
import { Stream } from 'stream';
import fs from 'fs';

function getListing(listingBuffer) {
  return {
    listing: {
      toBuffer: () => listingBuffer,
      file: {} as Stream,
    },
  };
}

function getListingsForTest(): Listing[] {
  return [
    {
      id: '1',
      make: 'Audi',
      seller_type: 'private',
      price: '10000',
      mileage: '100',
    },
    {
      id: '2',
      make: 'BMW',
      seller_type: 'private',
      price: '12000',
      mileage: '1002',
    },
    {
      id: '3',
      make: 'Toyota',
      seller_type: 'private',
      price: '9000',
      mileage: '1003',
    },
    {
      id: '4',
      make: 'Subaru',
      seller_type: 'dealer',
      price: '14000',
      mileage: '10000000',
    },
    {
      id: '5',
      make: 'Mazda',
      seller_type: 'other',
      price: '14000',
      mileage: '10000000',
    },
  ];
}

describe('Listing Service functions tests', () => {
  let listingBuffer;
  beforeAll(() => {
    listingBuffer = fs.readFileSync('./test/files/listings.csv');
    process.env.CURRENCY = '€';
    process.env.LOCALE = 'de-DE';
  });

  it('getPercentageDistributionOfMakers - should return percentage distribution by maker', () => {
    const listingPercentageDistributionByMakers = getPercentageDistributionOfMakers(getListingsForTest());
    listingPercentageDistributionByMakers.forEach((listing) => {
      expect(listing.rawPercentage).toBe(20);
    });
    expect(listingPercentageDistributionByMakers[0].percentage).toBe('20.00%');
  });

  it('getPercentageDistributionOfDealers - should return percentage distribution by dealers', () => {
    const listingPercentageDistributionByMakers = getPercentageDistributionOfDealers(getListingsForTest());
    expect(listingPercentageDistributionByMakers[0].rawAvg).toBe(14000);
    expect(listingPercentageDistributionByMakers[2].rawAvg).toBe(10333.333333333334);
    expect(listingPercentageDistributionByMakers[0].avg).toBe('€ 14.000,-');
  });
  it('convertCSVToListing - should convert CSV to Listing object', async (done) => {
    const listingPercentageDistributionByMakers = await convertCSVToListing(getListing(listingBuffer));
    expect(listingPercentageDistributionByMakers[0].id).toBe('1000');
    expect(listingPercentageDistributionByMakers[0].make).toBe('Audi');
    expect(listingPercentageDistributionByMakers[0].price).toBe('49717');
    expect(listingPercentageDistributionByMakers[0].mileage).toBe('6500');
    expect(listingPercentageDistributionByMakers[0].seller_type).toBe('private');
    expect(listingPercentageDistributionByMakers[7].id).toBe('1007');
    expect(listingPercentageDistributionByMakers[7].make).toBe('VW');
    expect(listingPercentageDistributionByMakers[7].price).toBe('25633');
    expect(listingPercentageDistributionByMakers[7].mileage).toBe('8000');
    expect(listingPercentageDistributionByMakers[7].seller_type).toBe('private');
    done();
  });
});

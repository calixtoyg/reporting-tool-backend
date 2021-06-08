import { getAveragePrice, getFormattedMileage, getFormattedPrice } from '../src/lib/utils';
import { Listing } from '../src/models/Listing';

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

describe('utils - utils functions tests', function () {
  beforeAll(() => {
    process.env.CURRENCY = '€';
    process.env.LOCALE = 'de-DE';
  });

  it('getFormattedPrice - should get price formatted', function () {
    const formattedPrice = getFormattedPrice(2000);
    expect(formattedPrice).toStrictEqual('€ 2.000,-');
  });

  it('getFormattedMileage - should get mileage formatted', function () {
    const formattedPrice = getFormattedMileage(2000);
    expect(formattedPrice).toStrictEqual('2.000 KM');
  });

  it('getAveragePrice - should get average price of listing list', function () {
    const listingAveragePrice = getAveragePrice(getListingsForTest());
    expect(listingAveragePrice).toBe(11800);
  });
});

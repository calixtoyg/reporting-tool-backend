import * as fs from 'fs';
import {
  convertCSVToListingContact,
  fulfillListingInfo,
  getAvgPriceOfMostContactedWithOrderList,
  getListingContactsByMonths,
  orderByContactedTimes,
} from '../src/lib/contactService';
import { Stream } from 'stream';
import { ListingContact } from '../src/models/ListingContact';

function getListingContactForTest(): ListingContact {
  const now = new Date();
  return {
    listings: [
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
    ],
    contacts: [
      {
        contactDate: now,
        listingId: '1',
      },
      {
        contactDate: now,
        listingId: '1',
      },
      {
        contactDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        listingId: '1',
      },
      {
        contactDate: now,
        listingId: '2',
      },
      {
        contactDate: now,
        listingId: '2',
      },
      {
        contactDate: now,
        listingId: '2',
      },
      {
        contactDate: now,
        listingId: '2',
      },
      {
        contactDate: now,
        listingId: '3',
      },
    ],
  };
}

function getContact(listingBuffer, contactBuffer) {
  return {
    listing: {
      toBuffer: () => listingBuffer,
      file: {} as Stream,
    },
    contact: {
      toBuffer: () => contactBuffer,
      file: {} as Stream,
    },
  };
}

describe('Contact Service functions tests', () => {
  let listingBuffer;
  let contactBuffer;

  beforeAll(() => {
    listingBuffer = fs.readFileSync('./test/files/listings.csv');
    contactBuffer = fs.readFileSync('./test/files/contacts.csv');
  });

  it('convertCSVToListingContact - should convert CSV to JSON', async (done) => {
    const listingContact = await convertCSVToListingContact(getContact(listingBuffer, contactBuffer));
    const firstContact = listingContact.contacts[0];
    const firstListing = listingContact.listings[0];
    expect(firstContact.listingId).toBe('1244');
    expect(firstContact.contactDate.getFullYear()).toBe(2020);
    expect(firstContact.contactDate.getDate()).toBe(18);
    expect(firstContact.contactDate.getDay()).toBe(4);
    expect(firstContact.contactDate).toStrictEqual(new Date(1592498493000));
    expect(firstListing.id).toBe('1000');
    expect(firstListing.make).toBe('Audi');
    expect(firstListing.price).toBe('49717');
    expect(firstListing.mileage).toBe('6500');
    expect(firstListing.seller_type).toBe('private');
    done();
  });
  it('fulfillListingInfo - should add contacts to each listing', async (done) => {
    const receivedListing = fulfillListingInfo(getListingContactForTest());
    expect(receivedListing[0].contactDetails.count).toBe(3);
    expect(receivedListing[0].contacts.length).toBe(3);
    expect(receivedListing[1].contactDetails.count).toBe(4);
    expect(receivedListing[2].contactDetails.count).toBe(1);
    done();
  });

  it('orderByContactedTimes - should order the list by contacted times', async (done) => {
    const receivedListing = orderByContactedTimes(fulfillListingInfo(getListingContactForTest()));
    expect(receivedListing[0].make).toBe('BMW');
    expect(receivedListing[1].make).toBe('Audi');
    expect(receivedListing[2].make).toBe('Toyota');
    done();
  });

  it('getAvgPriceOfMostContactedWithOrderList - should get average price of sliced list by percentage', async (done) => {
    const listingOrderByContactedTimes = orderByContactedTimes(fulfillListingInfo(getListingContactForTest()));
    const avgPrice = getAvgPriceOfMostContactedWithOrderList(listingOrderByContactedTimes, 30);
    expect(avgPrice).toBe(12000);
    done();
  });

  it('getAvgPriceOfMostContactedWithOrderList - should get average price of sliced list but this time the list is more than 1', async (done) => {
    const listingOrderByContactedTimes = orderByContactedTimes(fulfillListingInfo(getListingContactForTest()));
    const avgPrice = getAvgPriceOfMostContactedWithOrderList(listingOrderByContactedTimes, 50);
    expect(avgPrice).toBe(11000);
    done();
  });

  it('getListingContactsByMonths - should get a list of listings with the amount of times it was contacted by each month', async (done) => {
    const listingAndContacts = getListingContactForTest();
    const listingsContactsByMonths = getListingContactsByMonths(listingAndContacts);
    expect(listingsContactsByMonths.length).toBe(4);
    expect(listingsContactsByMonths[0].contactedTimes).toBe(4);
    expect(listingsContactsByMonths[0].month).toBe(new Date().getMonth());
    expect(listingsContactsByMonths[0].year).toBe(new Date().getFullYear());
    expect(listingsContactsByMonths[0].id).toBe('2');
    expect(listingsContactsByMonths[1].contactedTimes).toBe(2);
    expect(listingsContactsByMonths[2].contactedTimes).toBe(1);
    //Audi should be separated into 2 contact periods in the first month it was contacted 2 times and the second month 1 time.
    const audiListings = listingsContactsByMonths.filter((v) => v.make === 'Audi');
    expect(audiListings[0].contactedTimes).toBe(2);
    expect(audiListings[0].month).toBe(new Date().getMonth());
    expect(audiListings[1].contactedTimes).toBe(1);
    expect(audiListings[1].month).toBe(new Date().getMonth() + 1);
    done();
  });

});

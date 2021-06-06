import { ContactRequest } from '../models/ContactRequest';
import { ListingContact } from '../models/ListingContact';
import csvtojson from 'csvtojson';
import { convertCSVToListing, getAveragePrice } from "./utils";
import { Listing } from '../models/Listing';
import { Contact } from '../models/Contact';
import _ from 'lodash';
import { ListingContactReport } from '../models/ListingContactReport';

export const contactDate = (item) => {
  return new Date(Number(item));
};

export const convertCSVToListingContact = async (contact: ContactRequest): Promise<ListingContact> => {
  console.log('Converting files to JSON');
  //TODO this is very dangerous to load a whole file into the buffer instead of using a stream I did it to save time.
  const contactString = (await contact.contact.toBuffer()).toString('utf8');

  const contacts: any[] = await csvtojson({
    headers: ['listingId', 'contactDate'],
    colParser: { contactDate },
  }).fromString(contactString);
  return {
    contacts,
    listings: await convertCSVToListing({ csv: contact.listing }),
  };
};

export function fulfillListingInfo(listingContact: ListingContact): Listing[] {
  console.log('Adding information to contact information to listings');
  return listingContact.listings.map((list: Listing) => {
    const contacts = listingContact.contacts.filter((contact: Contact) => contact.listingId === list.id);
    return {
      ...list,
      contacts: contacts,
      contactDetails: {
        count: contacts.length,
      },
    };
  });
}

export function orderByContactedTimes(listingsWithContacts: Listing[]) {
  return _.orderBy(listingsWithContacts, 'contactDetails.count', 'desc');
}

export function getAvgPriceOfMostContactedWithOrderList(listingsWithContacts: Listing[], percentage: number) {
  console.log(`Getting AVG price of ${percentage}% most contacted listings`);
  const slicedListByPercentage = listingsWithContacts.slice(0, Math.round((percentage / 100) * listingsWithContacts.length));
  return getAveragePrice(slicedListByPercentage);
}

export function getListingContactsByMonths(listingContact: ListingContact): ListingContactReport[] {
  console.log('Getting most contacted listings separated by month');
  const contactsOrderByDate = _.sortBy(listingContact.contacts, 'contactDate', 'asc');
  const contactsWithDate = contactsOrderByDate.map((value) => {
    return {
      ...value,
      year: value.contactDate.getFullYear(),
      month: value.contactDate.getMonth(),
      date: value.contactDate.getDate(),
    };
  });
  const contactsGroupedByYear = _.toArray(_.groupBy(contactsWithDate, 'month'));
  const contactsGroupedByYearAndListingId = contactsGroupedByYear.map((value) => _.groupBy(value, 'listingId'));
  const listingWithContactedInformation = contactsGroupedByYearAndListingId.map((v) => {
    return Object.keys(v).map((listingKey) => {
      const contact = v[listingKey];
      const firstContact = v[listingKey].find((v) => v);
      const listing = listingContact.listings.find((l) => l.id === firstContact.listingId);
      return {
        contactedTimes: contact.length,
        year: firstContact.year,
        month: firstContact.month,
        ...listing,
      } as ListingContactReport;
    });
  });
  return listingWithContactedInformation.map((v) => _.orderBy(v, 'contactedTimes', 'desc')).flatMap((v) => v);
}

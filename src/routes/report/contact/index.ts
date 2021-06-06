import { NowRequestHandler } from 'fastify-now';
import { ContactRequest } from '../../../models/ContactRequest';

import { convertCSVToListingContact, getListingContactsByMonths } from '../../../lib/contactService';

export const POST: NowRequestHandler<{ Body: ContactRequest }> = async (req, rep) => {
  const listingContact = await convertCSVToListingContact(req.body);
  const listingsContactsByMonths = getListingContactsByMonths(listingContact);
  rep
    .send({
      listingsContactsByMonths,
    })
    .code(200);
};

const ListingContactReportSchema = {
  description: 'Creates a report from listings and contacts CSVs',
  tags: ['reporting'],
  summary:
    'Creates a report with AVG price of the most performing contacts you can optionally use performance queryParam to specify contacts listing performance cut',
  body: {
    type: 'object',
    required: ['listing', 'contact'],
    properties: {
      contact: { type: 'object' },
      listing: { type: 'object' },
    },
  },
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  exposeRoute: true,
};

POST.opts = { schema: ListingContactReportSchema };

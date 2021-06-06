import { NowRequestHandler } from "fastify-now";
import { ContactRequest } from "../../../models/ContactRequest";
import { convertCSVToListingContact, fulfillListingInfo, getAvgPriceOfMostContactedWithOrderList, orderByContactedTimes } from "../../../lib/contactService";
import { getFormattedPrice } from "../../../lib/utils";

export const POST: NowRequestHandler<{ Body: ContactRequest; Querystring: { percentage: number } }> = async (req, rep) => {
  const listingContact = await convertCSVToListingContact(req.body);
  const listingsWithContacts = fulfillListingInfo(listingContact);
  const listingsOrderByContactedTimes = orderByContactedTimes(listingsWithContacts);
  const avgPriceOfMostContactedListings = getAvgPriceOfMostContactedWithOrderList(listingsOrderByContactedTimes, req?.query.percentage || 30);
  rep
    .send({
      avgPrice: getFormattedPrice(avgPriceOfMostContactedListings),
    })
    .code(200);
};

const AvgPriceContactSchema = {
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
  querystring: {
    percentage: {
      type: 'string',
    },
  },
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  exposeRoute: true,
};
POST.opts = { schema: AvgPriceContactSchema };

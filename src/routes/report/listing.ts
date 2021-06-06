import { NowRequestHandler } from "fastify-now";
import { ListingRequest } from "../../models/ListingRequest";
import { ListingReport } from "../../models/ListingReport";
import { convertCSVToListing, getPercentageDistributionOfDealers, getPercentageDistributionOfMakers } from "../../lib/listingService";

export const POST: NowRequestHandler<{ Body: ListingRequest }> = async (req, rep) => {
  const listings = await convertCSVToListing(req.body);
  console.log('Getting listing distribution');
  const listingReport = {
    distribution: getPercentageDistributionOfMakers(listings),
    averagePriceByDealer: getPercentageDistributionOfDealers(listings),
  } as ListingReport;

  rep.send(listingReport).code(200);
};
const PostReportSchema = {
  description: 'Creates a report from a CSV',
  tags: ['reporting'],
  summary: 'Creates a report for product managers from a CSV',
  body: {
    type: 'object',
    required: ['csv'],
    properties: {
      file: { type: 'object' },
    },
  },
  consumes: ['multipart/form-data'],
  produces: ['application/json'],
  exposeRoute: true,
};
POST.opts = {
  schema: PostReportSchema,
};

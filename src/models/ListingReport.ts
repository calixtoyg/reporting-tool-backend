import { MakeDistribution } from "./MakeDistribution";
import { DealerDistribution } from "./DealerDistribution";

export class ListingReport {
  distribution: MakeDistribution[];
  averagePriceByDealer: DealerDistribution[];
}

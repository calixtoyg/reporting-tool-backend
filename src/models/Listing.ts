import { ContactDetails } from "./ContactDetails";
import { Contact } from "./Contact";

export class Listing {
  id: string;
  make: string;
  price: string;
  mileage: string;
  seller_type: string;
  contactDetails?: ContactDetails;
  contacts?: Contact[];
}

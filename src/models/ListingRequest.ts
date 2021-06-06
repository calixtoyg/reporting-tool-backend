import { Stream } from 'stream';

export class ListingRequest {
  csv: {
    file: Stream;
    toBuffer(): Buffer;
  };
}

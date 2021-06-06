import { Stream } from 'stream';

export class ListingRequest {
  listing: {
    file: Stream;
    toBuffer(): Buffer;
  };
}

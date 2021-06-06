import { Stream } from 'stream';

export class ContactRequest {
  listing: {
    file: Stream;
    toBuffer(): Buffer;
  };
  contact: {
    file: Stream;
    toBuffer(): Buffer;
  };
}

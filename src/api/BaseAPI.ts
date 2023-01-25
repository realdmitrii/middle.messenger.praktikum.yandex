import { PATH } from 'services/constants';
import { HTTPTransport } from 'services/HTTPTransport';

export abstract class BaseAPI {
  private readonly baseURL = PATH.baseURL;
  protected httpTransport: HTTPTransport;

  constructor(endpoint: string) {
    this.httpTransport = new HTTPTransport(`${this.baseURL}${endpoint}`);
  }
}

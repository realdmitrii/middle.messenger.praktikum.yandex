import { queryString } from './helpers';

interface Options {
  method: string;
  headers?: Record<string, string>;
  data?: any;
  timeout?: number;
}

export class HTTPTransport {
  constructor(protected url: string) {}

  request(
    url: string,
    options: Options,
    timeout = 5000
  ): Promise<XMLHttpRequest> {
    const { method, data, headers } = options;

    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.withCredentials = true;
      xhr.timeout = timeout;

      if (headers) {
        Object.entries(headers).forEach(([key, value]) =>
          xhr.setRequestHeader(key, value)
        );
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.onload = () => resolve(xhr);
      xhr.onerror = reject;
      xhr.onabort = reject;
      xhr.ontimeout = reject;

      if (method === 'GET' || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }

  get(path: string, data?: unknown): Promise<XMLHttpRequest> {
    let pathWithParams = path;

    if (data && Object.keys(data).length) {
      pathWithParams = `${path}?${queryString(data)}`;
    }

    return this.request(this.url + pathWithParams, { method: 'GET', data });
  }

  post(
    path: string,
    data: Record<string, string | number> | null
  ): Promise<XMLHttpRequest> {
    return this.request(this.url + path, { method: 'POST', data });
  }

  put(
    path: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<XMLHttpRequest> {
    return this.request(this.url + path, { method: 'PUT', data, headers });
  }

  delete(path: string, data: unknown): Promise<XMLHttpRequest> {
    return this.request(this.url + path, { method: 'DELETE', data });
  }
}

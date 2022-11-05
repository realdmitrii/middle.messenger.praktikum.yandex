export enum METHODS {
  GET = "GET",
  PUT = "PUT",
  POST = "POST",
  DELETE = "DELETE"
}

interface Options {
  method: string;
  headers: Record<string, string>;
  data: string;
  timeout: number;
}

function queryStringify(data: any): string {
  let outcome = "?";
  Object.keys(data).forEach((key, i, arr) => {
    outcome += `${key}=${data[key]}`;
    if (arr.length > 1 && i !== arr.length - 1) {
      outcome += `&`;
    }
  });

  return outcome;
}

export class HTTPTransport {
  get = (url: string, options: Options) => {
    const transformedUrl = queryStringify(options.data);

    return this.request(
      `${url}${transformedUrl}`,
      { ...options, method: METHODS.GET },
      options.timeout
    );
  };

  post = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout
    );
  };

  put = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout
    );
  };

  delete = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout
    );
  };

  request = (url: string, options: Options, timeout = 5000) => {
    const { headers = {}, method, data } = options;

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject("Не указан метод");
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => resolve(xhr);

      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}

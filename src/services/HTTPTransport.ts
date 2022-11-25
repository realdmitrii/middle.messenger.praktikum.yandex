export type METHODS =   "GET" | "PUT" | "POST" | "DELETE";

interface Options {
  method: METHODS;
  headers: Record<string, string>;
  data: undefined;
}

function queryStringify(data: any): string {
  return "?" + Object
  .entries(data)
  .map(([key, value]) => `${key}=${value}`)
  .join("&")
}

export class HTTPTransport {
  get = (url: string, options: Options) => {
    const transformedUrl = queryStringify(options.data);

    return this.request(
      `${url}${transformedUrl}`,
      { ...options, method: "GET" }
    );
  };

  post = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: "POST" }
    );
  };

  put = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: "PUT" }
    );
  };

  delete = (url: string, options: Options) => {
    return this.request(
      url,
      { ...options, method: "DELETE" }
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

      if (method === "GET" || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}

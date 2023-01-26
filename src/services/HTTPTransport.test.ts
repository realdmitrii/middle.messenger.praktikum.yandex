import { HTTPTransport } from './HTTPTransport';

describe('utils/HTTPTransport', () => {
  const http = new HTTPTransport('test');

  describe('GET', () => {
    it(`возвращает запрос с методом 'GET'`, () => {
      http.get('GET').then((res: any) => {
        expect(res.response).toEqual('GET');
      });
    });
  });

  describe('POST', () => {
    it(`возвращает запрос с методом 'POST'`, () => {
      http.post('POST', {}).then((res: any) => {
        expect(res.response).toEqual('POST');
      });
    });
  });

  describe('PUT', () => {
    it(`возвращает запрос с методом 'PUT'`, () => {
      http.put('PUT', {}).then((res: any) => {
        expect(res.response).toEqual('PUT');
      });
    });
  });

  describe('DELETE', () => {
    it(`возвращает запрос с методом 'DELETE'`, () => {
      http.delete('DELETE', {}).then((res: any) => {
        expect(res.response).toEqual('DELETE');
      });
    });
  });
});

import { PATH } from 'services/constants';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  rest.post(`${PATH.baseURL}/auth/logout`, (_req, res, ctx) => {
    console.log('Call logout endpoind');

    // window.store.dispatch({ user: null });

    return res(ctx.status(200));
  }),
  rest.post(`${PATH.baseURL}/test/post`, (_req, res, ctx) => res(ctx.json({ response: 'post' }))),
  rest.get(`${PATH.baseURL}/test/get`, (_req, res, ctx) => res(ctx.json({ response: 'get' }))),
  rest.put(`${PATH.baseURL}/test/put`, (_req, res, ctx) => res(ctx.json({ response: 'put' }))),
  rest.delete(`${PATH.baseURL}/test/delete`, (_req, res, ctx) => res(ctx.json({ response: 'delete' }))),
];

const server = setupServer(...handlers);

export default server;

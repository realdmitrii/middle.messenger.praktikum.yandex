import { Router, routes } from 'core/Router';

describe('Маршрутизатор Router', () => {
  it('переводит по заданному маршруту', () => {
    document.body.innerHTML = '<div id="app"></div>';

    const router = new Router(routes);
    router.start();
    router._onRoute = jest.fn();
    router.go('/messenger');

    expect(router._onRoute).toBeCalled();
    expect(window.location.pathname).toBe('/messenger');
  });
});

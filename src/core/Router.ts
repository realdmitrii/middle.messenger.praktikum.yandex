import { Block } from './Block';
import { renderDOM } from './renderDOM';
import { ChatPage } from '../pages/chat/ChatPage';
import { ErrorPage } from '../pages/error/ErrorPage';
import { PasswordChangePage } from '../pages/password-change/PasswordChange';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SignInPage } from '../pages/sign-in/SignInPage';
import { SignUpPage } from '../pages/sign-up/SignUpPage';
import { store } from './Store';

class Route {
  constructor(private _pathname: string, private _blockClass: typeof Block) {}

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render() {
    renderDOM(new this._blockClass());
  }
}

export class Router {
  private _routes: Route[] = [];

  constructor(routes: Record<string, any>[]) {
    routes.forEach(route => {
      this._routes.push(new Route(route.path, route.block));
    });
  }

  _onRoute(pathname: string) {
    const route = this._routes.find(route => route.match(pathname));

    if (!route) {
      const errorRoute = new Route('/error', ErrorPage);
      errorRoute.render();
    } else {
      route!.render();
    }
  }

  start() {
    window.addEventListener('popstate', () => {
      if (!store.get().isAuth) {
        router.go('/');
      }

      this._onRoute(window.location.pathname);
    });

    this._onRoute(window.location.pathname);
  }

  go(pathname: string) {
    window.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    window.history.back();
  }

  /**
   * Проверяет наличие текущего url в каком
   * либо маршруте из массива маршрутов
   */
  check(path: string): boolean {
    let outcome = false;

    this._routes.forEach(route => {
      if (route.match(path)) {
        outcome = true;
      }
    });

    return outcome;
  }
}

export const routes = [
  {
    path: '/',
    block: SignInPage
  },
  {
    path: '/sign-up',
    block: SignUpPage
  },
  {
    path: '/settings',
    block: ProfilePage
  },
  {
    path: '/messenger',
    block: ChatPage
  },
  {
    path: '/password-change',
    block: PasswordChangePage
  }
];

export const router = new Router(routes);

export function initRouter() {
  router.start();
}

import { chatController } from './ChatController';
import { authAPI } from 'api/AuthAPI';
import { initRouter, router } from 'core/Router';
import { store } from 'core/Store';

class AuthController {
  private _api: typeof authAPI = authAPI;

  // Регистрация
  async signUp(data: Record<string, string | number>): Promise<void> {
    await this._api
      .signUp(data)
      .then(xhr => {
        const code = xhr.status;

        if (code === 200 || code === 400) {
          router.go('/messenger');
        } else if (code === 409) {
          const warningDiv = document.body.querySelector('.warning');
          const reason = JSON.parse(xhr.responseText).reason;

          if (reason === 'Login already exists') {
            warningDiv!.innerHTML = 'такой логин уже существует';
          } else if (reason === 'Email already exists') {
            warningDiv!.innerHTML = 'такая почта уже существует';
          }
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));
  }

  // Вход
  async signIn(data: Record<string, string | number>) {
    await this._api
      .signIn(data)
      .then(xhr => {
        const code = xhr.status;

        if (code === 200) {
          this.user();
          document.location.href = '/messenger';
        } else if (code === 400) {
          router.go('/messenger');
        } else if (code === 401) {
          const warningDiv = document.body.querySelector('.warning');
          warningDiv!.innerHTML = 'Неверный логин или пароль';
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));
  }

  // Получение информации о пользователе
  async user() {
    await this._api
      .user()
      .then(xhr => {
        const code = xhr.status;
        const wlp = window.location.pathname;

        if (code === 200) {
          store.set('isAuth', true);
          store.set('user', JSON.parse(xhr.response));
        } else if (code === 401) {
          store.set('isAuth', false);

          if (router.check(wlp) && wlp !== '/sign-up' && wlp !== '/error') {
            if (window.location.pathname !== '/') {
              router.go('/');
            }
          }
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));

    chatController.getChats();
    initRouter();
  }

  // Выход
  logout(): void {
    this._api
      .logout()
      .then(xhr => {
        const code = xhr.status;

        if (code === 200) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));
  }
}

export const authController = new AuthController();

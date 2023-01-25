import { userAPI } from 'api/UserAPI';
import { store } from 'core/Store';
import { router } from 'core/Router';

class UserController {
  private _api: typeof userAPI = userAPI;

  // Изменение информации о пользователе
  profile(data: Record<string, string | number>): void {
    this._api
      .profile(data)
      .then(xhr => {
        const code = xhr.status;

        if (code === 200) {
          store.set('user', JSON.parse(xhr.response));
          store.set('modal.first', true);
        } else if (code === 400) {
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

  // Изменение аватара пользователя
  changeAvatar(data: FormData): void {
    this._api
      .changeAvatar(data)
      .then(xhr => {
        const code = xhr.status;

        if (code === 200) {
          store.set('user', JSON.parse(xhr.response));
          store.set('modal.second', false);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));
  }

  // Изменение пароля пользователя
  password(data: Record<string, string | number>): void {
    this._api
      .password(data)
      .then(xhr => {
        const code = xhr.status;

        if (code === 200) {
          store.set('modal.first', true);
        } else if (code === 400) {
          const warningDiv = document.body.querySelector('.warning');
          const reason = JSON.parse(xhr.responseText).reason;

          if (reason === 'Password is incorrect') {
            warningDiv!.innerHTML = 'неверный старый пароль';
          }
        } else if (code === 500) {
          console.error('Непредвиденная ошибка');
        }
      })
      .catch(error => console.error(error));
  }

  // Поиск информации о пользователе по логину
  async searchUserByLogin(login: string) {
    return this._api.searchUserByLogin(login).then(xhr => {
      return JSON.parse(xhr.response);
    });
  }
}

export const userController = new UserController();

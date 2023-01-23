import { userAPI } from '../api/UserAPI';
import { router } from '../core/Router';
import { store } from '../core/Store';
import { customLog } from '../services/customLog';

class UserController {
  private _api: typeof userAPI = userAPI;

  // Изменение информации о пользователе
  profile(data: Record<string, string | number>): void {
    this._api
      .profile(data)
      .then(xhr => {
        customLog(4, xhr, 'UserController.profile(data)'); // TODO: удалить
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
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));
  }

  // Изменение аватара пользователя
  changeAvatar(data: FormData): void {
    this._api
      .changeAvatar(data)
      .then(xhr => {
        customLog(4, xhr, 'UserController.profile(data)'); // TODO: удалить
        const code = xhr.status;

        if (code === 200) {
          store.set('user', JSON.parse(xhr.response));
          store.set('modal.second', false);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));
  }

  // Изменение пароля пользователя
  password(data: Record<string, string | number>): void {
    this._api
      .password(data)
      .then(xhr => {
        customLog(4, xhr, 'UserController.profile(data)'); // TODO: удалить
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
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));
  }

  // Поиск информации о пользователе по логину
  async searchUserByLogin(login: string) {
    return this._api.searchUserByLogin(login).then(xhr => {
      customLog(4, xhr, `UserController.searchUserByLogin(${login})`); // TODO: удалить
      return JSON.parse(xhr.response);
    });
  }
}

export const userController = new UserController();

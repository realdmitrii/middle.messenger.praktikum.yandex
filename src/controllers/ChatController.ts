import { userController } from './UserController';
import { chatAPI } from '../api/ChatAPI';
import { router } from '../core/Router';
import { store } from '../core/Store';
import { customLog } from '../services/customLog';
import { getChatCardDate } from '../services/helpers';
import { messagesController } from './MessageController';

class ChatController {
  private _api: typeof chatAPI = chatAPI;

  /**
   * Получение чатов текущего пользователя.
   * offset: сдвиг.
   * limit: количество возвращаемых элементов массива.
   * title: поиск по названию чата.
   */
  async getChats(offset = 0, limit = 10, title = '') {
    this._api
      .getChats(offset, limit, title)
      .then(xhr => {
        customLog(
          4,
          xhr,
          `ChatController.getChats(${offset}, ${limit}, '${title}')`
        ); // TODO: удалить

        const code = xhr.status;

        if (code === 200) {
          /**
           * Модификация и сохранение в хранилище массива с объектами-чатами,
           * полученными с сервера
           */
          const chats: Chat[] = [];

          const respObjArr = JSON.parse(xhr.response);
          for (const element of respObjArr) {
            let lastMessage = null;
            let time = null;

            if (element.last_message) {
              lastMessage = element.last_message.content;
              time = getChatCardDate(element.last_message.time);
            }

            chats.push({
              id: element.id,
              title: element.title,
              avatar: element.avatar,
              unread_count: element.unread_count,
              last_message: lastMessage,
              time: time
            });
          }

          store.set('chats', chats);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));
  }

  // Создание чата
  async createChat() {
    const input = document.body.querySelector(
      '.chats-board__modal-input'
    ) as HTMLInputElement;

    let chatName = '';
    if (!input.value) {
      chatName =
        'Новый чат, ' +
        new Date().toLocaleString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
    } else {
      chatName = input.value;
    }

    let chatId: number | null = null;

    await this._api
      .createChat(chatName)
      .then(xhr => {
        customLog(4, xhr, `ChatController.createChat(${chatName})`); // TODO: удалить
        const code = xhr.status;

        if (code === 200) {
          chatId = JSON.parse(xhr.response).id;
          store.set('chatId', chatId);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));

    store.set('modal.first', false);
    this.getChats();

    if (!chatId) {
      return;
    }

    messagesController.connect();
    chatController.getChatUsers(chatId);
  }

  // Удаление чата по идентификатору
  async deleteChat() {
    const chatId = store.get().chatId;

    if (!chatId) {
      return;
    }

    await this._api
      .deleteChat(chatId)
      .then(xhr => {
        customLog(4, xhr, `ChatController.deleteChat(${chatId})`); // TODO: удалить
        const code = xhr.status;

        if (code === 200) {
          store.set('modal.second', false);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));

    store.set('chatUsers', []);
    this.getChats();
  }

  /**
   * Получение чатов текущего пользователя.
   * chatId: идентификатор чата.
   * offset: сдвиг.
   * limit: количество возвращаемых элементов массива.
   * name: имя пользователя для фильтрации
   * в формате '{first_name} {second_name}'.
   * email: почта пользователя для фильтрации.
   */
  async getChatUsers(
    chatId: number,
    offset = 0,
    limit = 10,
    name = '',
    email = ''
  ) {
    await this._api
      .getChatUsers(chatId, offset, limit, name, email)
      .then(xhr => {
        customLog(
          4,
          xhr,
          `ChatController.getChatUsers(${chatId}, ${offset}, ${limit}, '${name}', '${email}')`
        ); // TODO: удалить

        const code = xhr.status;

        if (code === 200) {
          store.set('chatUsers', JSON.parse(xhr.response));
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 404) {
          customLog(0, 'Чат не найден'); // TODO: заменить
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));
  }

  // Добавление пользователей к чату
  async addUsersToChat(login: string) {
    const chatId = store.get().chatId;

    if (!chatId) {
      store.set('modal.third', false);
      return;
    }

    let users: User[] = [];
    try {
      users = await userController.searchUserByLogin(login);
    } catch (error: any) {
      customLog(0, error);
    }

    const firstFoundedUser: User = users[0];
    /**
     * Если запрашиваемый к поиску логин не совпадает
     * с логином первого элемента возвращаемого массива пользователей
     */
    if (login !== firstFoundedUser.login) {
      return;
    }

    const firstFoundedUserId = firstFoundedUser.id as number;

    await this._api
      .addUsersToChat([firstFoundedUserId], chatId)
      .then(xhr => {
        customLog(
          4,
          xhr,
          `ChatController.addUsersToChat([${firstFoundedUserId}], ${chatId})`
        ); // TODO: удалить
        const code = xhr.status;

        if (code === 200) {
          store.set('modal.third', false);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));

    this.getChatUsers(chatId);
    this.getChats();
  }

  // Удаление пользователей из чата
  async deleteUsersFromChat(login: string) {
    const chatId = store.get().chatId;

    if (!chatId) {
      store.set('modal.third', false);
      return;
    }

    try {
      await this.getChatUsers(chatId);
    } catch (error: any) {
      customLog(0, error);
    }

    const chatUsers = store.get().chatUsers;

    let userForDeleteId: number | null = null;

    for (const user of chatUsers) {
      customLog(0, user.login);
      if (login === user.login) {
        userForDeleteId = user.id;
        break;
      }
    }

    if (userForDeleteId === null) {
      return;
    }

    await this._api
      .deleteUsersFromChat([userForDeleteId], chatId)
      .then(xhr => {
        customLog(
          4,
          xhr,
          `ChatController.deleteUsersFromChat([${userForDeleteId}], ${chatId})`
        ); // TODO: удалить
        const code = xhr.status;

        if (code === 200) {
          store.set('modal.fourth', false);
        } else if (code === 401) {
          store.set('isAuth', false);
          router.go('/');
        } else if (code === 500) {
          customLog(0, 'Непредвиденная ошибка'); // TODO: заменить
        }
      })
      .catch(error => customLog(0, error));

    this.getChatUsers(chatId);
    this.getChats();
  }

  // Возвращает токен для подключения к серверу сообщений
  async getToken(chatId: number) {
    return this._api.getToken(chatId).then(xhr => {
      customLog(4, xhr, `ChatController.getToken(${chatId})`); // TODO: удалить
      return JSON.parse(xhr.response).token;
    });
  }
}

export const chatController = new ChatController();

import EventBus from './EventBus';
import { set } from '../services/helpers';

const user: User = {
  id: null,
  first_name: '',
  second_name: '',
  display_name: '',
  login: '',
  avatar: '',
  email: '',
  phone: ''
};

export const appStateDefault: AppState = {
  modal: {
    first: false,
    second: false,
    third: false,
    fourth: false
  },
  isAuth: false,
  user: user,

  chats: [],
  chatId: null,
  token: null,
  messages: [],
  chatUsers: []
};

export class Store extends EventBus {
  private _appState: AppState = appStateDefault;

  set(path: string, value: unknown) {
    set(this._appState, path, value);
    this.emit('changed');
  }

  get() {
    return this._appState;
  }

  pushMessage(message: Message) {
    this._appState.messages.push(message);
    this.emit('changed');
  }
}

export const store = new Store();

import './chats-board.css';
import fn from './chats-board.hbs';
import { Block } from '../../core/Block';
import { router } from '../../core/Router';
import { store } from '../../core/Store';
import { authController } from '../../controllers/AuthController';
import { chatController } from './../../controllers/ChatController';
import { customLog } from '../../services/customLog';

export class ChatsBoard extends Block {
  static componentName = 'ChatsBoard';

  constructor() {
    super({
      chatCards: store.get().chats,
      openModalAddChat: () => this._openModalAddChat(),
      createChat: (e: Event) => this._createChat(e),

      openModalAddUserToChat: () => this._openModalAddUserToChat(),
      addUserToChat: (e: Event) => this._addUserToChat(e),

      openModalDelUserFromChat: () => this._openModalDelUserFromChat(),
      delUserFromChat: (e: Event) => this._delUserFromChat(e),

      delChat: () => this._delChat(),
      goToProfilePage: (e: Event) => this._goToProfilePage(e),
      logout: () => this._logout()
    });

    store.on('changed', () => {
      this.setProps({
        chatCards: store.get().chats,
        modal: store.get().modal
      });
    });
  }

  private _openModalAddChat() {
    store.set('modal.first', true);
  }

  private _createChat(e: Event) {
    e.preventDefault();
    chatController.createChat();
  }

  private _openModalAddUserToChat() {
    store.set('modal.second', false);
    store.set('modal.third', true);
  }

  private _addUserToChat(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form['modal'] as HTMLInputElement;
    const inputValue = input.value;

    if (inputValue !== '') {
      chatController.addUsersToChat(inputValue);
    }
  }

  private _openModalDelUserFromChat() {
    store.set('modal.second', false);
    store.set('modal.fourth', true);
  }

  private async _delUserFromChat(e: Event) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const input = form['modal'] as HTMLInputElement;
    const inputValue = input.value;

    if (inputValue !== '') {
      chatController.deleteUsersFromChat(inputValue);
    }
  }

  private _delChat() {
    chatController.deleteChat();
  }

  private _goToProfilePage(e: Event) {
    e.preventDefault();
    router.go('/settings');
  }

  private _logout() {
    authController.logout();
  }

  render() {
    customLog(2, this, 'UsersBoard'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

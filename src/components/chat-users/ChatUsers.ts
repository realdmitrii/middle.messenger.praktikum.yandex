import './chat-users.css';
import fn from './chat-users.hbs';
import { Block } from 'core/Block';
import { store } from 'core/Store';

export class ChatUsers extends Block {
  static componentName = 'ChatUsers';

  constructor() {
    super({
      chatUsers: store.get().chatUsers
    });

    store.on('changed', () => {
      this.setProps({
        chatUsers: store.get().chatUsers
      });
    });
  }

  render() {
    return this.compile(fn, { ...this.props });
  }
}

import './chat-box.css';
import fn from './chat-box.hbs';
import { Block } from '../../core/Block';
import { customLog } from '../../services/customLog';
import { store } from '../../core/Store';

export class ChatBox extends Block {
  static componentName = 'ChatBox';

  constructor() {
    super({
      messages: store.get().messages
    });

    store.on('changed', () => {
      this.setProps({
        messages: store.get().messages
      });
    });
  }

  render() {
    customLog(2, this, 'ChatBox'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

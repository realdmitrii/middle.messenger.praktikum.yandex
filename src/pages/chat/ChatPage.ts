import './chat.css';
import fn from './chat.hbs';
import { Block } from '../../core/Block';
import { customLog } from '../../services/customLog';

export class ChatPage extends Block {
  render() {
    customLog(1, this, 'Chat page'); // TODO: удалить

    return this.compile(fn, {});
  }
}

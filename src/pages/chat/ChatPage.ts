import './chat.css';
import fn from './chat.hbs';
import { Block } from 'core/Block';

export class ChatPage extends Block {
  render() {
      return this.compile(fn, {});
  }
}

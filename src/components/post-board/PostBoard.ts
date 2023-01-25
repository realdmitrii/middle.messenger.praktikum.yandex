import { messagesController } from './../../controllers/MessageController';
import './post-board.css';
import fn from './post-board.hbs';
import { Block } from 'core/Block';
import { xssDef } from 'services/xssDef';

export class PostBoard extends Block {
  static componentName = 'PostBoard';

  constructor() {
    super({
      sendMessage: (e: Event) => this._sendMessage(e)
    });
  }

  private async _sendMessage(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form['message'] as HTMLInputElement;
    const inputValue = xssDef(input.value);

    if (inputValue !== '') {
      try {
        await messagesController.sendMessage(inputValue);
      } catch (error: unknown) {
        console.error(error);
      }

      input.value = '';
    }
  }

  render() {
    return this.compile(fn, { ...this.props });
  }
}

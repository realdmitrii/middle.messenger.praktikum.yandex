import { PATH } from 'services/constants';
import { store } from 'core/Store';
import { getMessageTime } from 'services/helpers';
import { chatController } from './ChatController';

class MessagesController {
  private _socket: WebSocket;
  private _intervalFunction: any;

  async connect(): Promise<void> {
    this._closeConnection();

    const userId = store.get().user.id;
    const chatId = store.get().chatId;

    let token: string;
    try {
      token = await chatController.getToken(Number(chatId));
      this._socket = new WebSocket(
        `${PATH.socket}/${userId}/${chatId}/${token}`
      );
    } catch (error: unknown) {
      console.error(error);
    }

    this._addListeners();
    this._socket.onopen = () => this._openHandler();
    this._socket.onclose = () => this._closeHandler();
  }

  private _addListeners(): void {
    if (this._socket) {
      this._socket.addEventListener('message', this._messageHandler);
      this._socket.addEventListener('error', this._errorHandler);
    }
  }

  private _removeListeners(): void {
    if (this._socket) {
      this._socket.removeEventListener('message', this._messageHandler);
      this._socket.removeEventListener('error', this._errorHandler);
    }
  }

  private _socketPing() {
    if (this._socket && this._socket.readyState === 1) {
      this._socket.send(JSON.stringify({ type: 'ping' }));
    }
  }

  private async _getMessages(num = 0) {
    if (this._socket) {
      this._socket.send(JSON.stringify({ content: num, type: 'get old' }));
    }
  }

  private async _openHandler() {
    if (this._socket) {
      // Получение непрочитанных сообщений
      try {
        await this._getMessages();
      } catch (error: unknown) {
        console.error(error);
      }

      this._intervalFunction = setInterval(() => {
        this._socketPing();
      }, 15000);
    }
  }

  private _closeHandler(event?: CloseEvent): void {
    this._removeListeners();

    clearInterval(this._intervalFunction);

    if (event && !event.wasClean) {
      console.error('WS: проблемы с подключением к чату. Обновите страницу.');
    }
  }

  private async _messageHandler(event: MessageEvent): Promise<void> {
    const serverMessage = JSON.parse(event.data);

    if (serverMessage.type !== 'pong') {
      if (Array.isArray(serverMessage)) {
        serverMessage.forEach(
          message => (message.time = getMessageTime(message.time))
        );
        store.set('messages', serverMessage.reverse());
      } else {
        // if (serverMessage.type === 'user connected') {
          serverMessage.time = getMessageTime(serverMessage.time);
          store.pushMessage(serverMessage);
          chatController.getChats();
        }
      }
    }

  private _errorHandler(e: Event): void {
    if (e instanceof Error) {
      console.error(e);
    }
  }

  async sendMessage(messageText: string) {
    try {
      if (this._socket) {
        this._socket.send(
          JSON.stringify({
            content: messageText,
            type: 'message'
          })
        );
        chatController.getChats();

        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error(error);
      return false;
    }
  }

  private _closeConnection(): void {
    if (this._socket) {
      clearInterval(this._intervalFunction);
      this._socket.close();
      this._removeListeners();
    }
  }
}

export const messagesController = new MessagesController();

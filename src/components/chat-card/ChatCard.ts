import './chat-card.css';
import fn from './chat-card.hbs';
import { Block } from 'core/Block';
import { store } from 'core/Store';
import { messagesController } from 'controllers/MessageController';
import { chatController } from 'controllers/ChatController';

interface Props {
  id: string;
  title: string;
  unread_count: string;
  last_message: string;
  time: string;
  onClick: () => void;
}

export class ChatCard extends Block {
  static componentName = 'ChatCard';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: async (e: MouseEvent) => {
          const element = e.target as HTMLElement;
          const chatCard = element.closest('.chat-card') as HTMLElement;
          const chatId = chatCard.id;

          if (!chatId) {
            return;
          }

          store.set('chatId', chatCard.id);

          try {
            messagesController.connect();
          } catch (error: unknown) {
            console.error(error);
          }

          chatController.getChatUsers(Number(chatCard.id));
        }
      },
      settings: (e: MouseEvent) => this._openSettings(e)
    });
  }

  private _openSettings(e: MouseEvent) {
    e.stopPropagation();
    const settingsButton = e.target as HTMLElement;
    const chatCard = settingsButton.closest('.chat-card') as HTMLElement;
    /**
     * (при нажатии на карточку чата) запоминает
     * идентификатор родительского блока (являющийся
     * по совместительству идентификатором чата)
     */
    store.set('chatId', chatCard.id);
    store.set('modal.second', true);
  }

  render() {
    return this.compile(fn, { ...this.props });
  }
}

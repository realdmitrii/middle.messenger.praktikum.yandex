// Cтили
import './styles/styles.css';

// Компоненты
import { ChatBox } from './components/chat-box/ChatBox';
import { ChatCard } from './components/chat-card/ChatCard';
import { ChatUsers } from './components/chat-users/ChatUsers';
import { ChatsBoard } from './components/chats-board/ChatsBoard';
import { Form } from './components/form/Form';
import { MessageBox } from './components/message-box/MessageBox';
import { Modal } from './components/modal/Modal';
import { PostBoard } from './components/post-board/PostBoard';
import { Avatar } from './components/ui/avatar/Avatar';
import { Button } from './components/ui/button/Button';
import { Input } from './components/ui/input/Input';
import { Link } from './components/ui/link/Link';

// Вспомогательные функции
import { registerComponent } from './core/registerComponent';
import { authController } from './controllers/AuthController';

// Регистрация компонентов
registerComponent(ChatBox);
registerComponent(ChatCard);
registerComponent(ChatUsers);
registerComponent(ChatsBoard);
registerComponent(Form);
registerComponent(MessageBox);
registerComponent(Modal);
registerComponent(PostBoard);
registerComponent(Avatar);
registerComponent(Button);
registerComponent(Input);
registerComponent(Link);

window.addEventListener('DOMContentLoaded', () => {
  authController.user();
});

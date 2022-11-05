// Cтили
import "./styles/styles.css";

// Вспомогательные функции
import { registerComponent } from "./core/registerComponent";
import { renderDOM } from "./core/renderDOM";

// Страница
import { IndexPage } from "./pages/index";

// Компоненты
import { Avatar } from "./components/avatar/avatar";
import { ChatBox } from "./components/chat-box/chat-box";
import { Input } from "./components/input/input";
import { Link } from "./components/link/link";
import { MessageBox } from "./components/message-box/message-box";
import { PostBoard } from "./components/post-board/post-board";
import { SelectedChats } from "./components/selected-chats/selected-chats";
import { UserCard } from "./components/user-card/user-card";
import { UsersBoard } from "./components/users-board/users-board";

// Регистрация
registerComponent("Avatar", Avatar as any);
registerComponent("ChatBox", ChatBox as any);
registerComponent("Input", Input as any);
registerComponent("Link", Link as any);
registerComponent("MessageBox", MessageBox as any);
registerComponent("PostBoard", PostBoard as any);
registerComponent("SelectedChats", SelectedChats as any);
registerComponent("UserCard", UserCard as any);
registerComponent("UsersBoard", UsersBoard as any);

document.addEventListener("DOMContentLoaded", () => {
  renderDOM(new IndexPage());
});

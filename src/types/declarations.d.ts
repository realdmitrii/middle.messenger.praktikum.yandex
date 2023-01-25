declare module '*.hbs';
declare module '*handlebars.runtime';
declare module '*.svg';

interface User {
  id: number | null;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
}

interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: string | null;
  time: string | null;
}

interface Message {
  chat_id: number;
  time: string;
  type: string;
  user_id: string;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

interface ChatUser {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  avatar: string | null;
  email: string;
  phone: string;
  role: string;
}

interface AppState {
  modal: {
    first: boolean;
    second: boolean;
    third: boolean;
    fourth: boolean;
  };
  isAuth: boolean;
  user: User;

  chats: Chat[];
  chatId: number | null;
  token: number | null;
  messages: Message[];
  chatUsers: ChatUser[];
}

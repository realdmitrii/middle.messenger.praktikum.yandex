import { BaseAPI } from './BaseAPI';

export class ChatAPI extends BaseAPI {
  constructor() {
    super('/chats');
  }

  getChats(
    offset: number,
    limit: number,
    title: string
  ): Promise<XMLHttpRequest> {
    return this.httpTransport.get('/', {
      offset: offset,
      limit: limit,
      title: title
    });
  }

  createChat(title: string): Promise<XMLHttpRequest> {
    return this.httpTransport.post('/', { title: title });
  }

  deleteChat(chatId: number): Promise<XMLHttpRequest> {
    return this.httpTransport.delete('/', { chatId: chatId });
  }

  getChatUsers(
    chatId: number,
    offset: number,
    limit: number,
    name: string,
    email: string
  ): Promise<XMLHttpRequest> {
    return this.httpTransport.get(`/${chatId}/users`, {
      offset: offset,
      limit: limit,
      name: name,
      email: email
    });
  }

  addUsersToChat(users: number[], chatId: number): Promise<XMLHttpRequest> {
    return this.httpTransport.put('/users', { users: users, chatId: chatId });
  }

  deleteUsersFromChat(
    users: number[],
    chatId: number
  ): Promise<XMLHttpRequest> {
    return this.httpTransport.delete('/users', {
      users: users,
      chatId: chatId
    });
  }

  getToken(chatId: number): Promise<XMLHttpRequest> {
    return this.httpTransport.post(`/token/${chatId}`, {});
  }
}

export const chatAPI = new ChatAPI();

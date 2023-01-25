import { BaseAPI } from './BaseAPI';

class UserAPI extends BaseAPI {
  constructor() {
    super('/user');
  }

  profile(data: Record<string, string | number>): Promise<XMLHttpRequest> {
    return this.httpTransport.put('/profile', data);
  }

  changeAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.httpTransport.put('/profile/avatar', data, {});
  }

  password(data: Record<string, string | number>): Promise<XMLHttpRequest> {
    return this.httpTransport.put('/password', data);
  }

  // id(id: string): Promise<XMLHttpRequest> {
  //   return this.httpTransport.get(`/${id}`);
  // }

  searchUserByLogin(login: string): Promise<XMLHttpRequest> {
    return this.httpTransport.post('/search', { login: login });
  }
}

export const userAPI = new UserAPI();

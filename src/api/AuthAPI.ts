import { BaseAPI } from './BaseAPI';

class AuthAPI extends BaseAPI {
  constructor() {
    super('/auth');
  }

  signUp(data: Record<string, string | number>): Promise<XMLHttpRequest> {
    return this.httpTransport.post('/signup', data);
  }

  signIn(data: Record<string, string | number>): Promise<XMLHttpRequest> {
    return this.httpTransport.post('/signin', data);
  }

  user(): Promise<XMLHttpRequest> {
    return this.httpTransport.get('/user');
  }

  logout(): Promise<XMLHttpRequest> {
    return this.httpTransport.post('/logout', null);
  }
}

export const authAPI = new AuthAPI();

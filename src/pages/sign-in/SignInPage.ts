import './sign-in.css';
import fn from './sign-in.hbs';
import { ValidatedInputs } from 'core/ValidatedInputs';
import { store } from 'core/Store';
import { router } from 'core/Router';
import { authController } from 'controllers/AuthController';

export class SignInPage extends ValidatedInputs {
  private _signIn(e: Event) {
    e.preventDefault();

    if (store.get().isAuth) {
      router.go('/messenger');
      return;
    }

    const result = this._finalCheck();

    if (result) {
      authController.signIn(result);
    }
  }

  private _goToSignUpPage(e: Event) {
    e.preventDefault();
    router.go('/sign-up');
  }

  render() {
    return this.compile(fn, {
      ...this.props,
      login: store.get().user.login,
      focus: this.validateInput.bind(this),
      blur: this.validateInput.bind(this),
      signIn: this._signIn.bind(this),
      goToSignUpPage: this._goToSignUpPage.bind(this)
    });
  }
}

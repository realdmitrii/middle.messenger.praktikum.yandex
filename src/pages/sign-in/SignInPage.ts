import './sign-in.css';
import fn from './sign-in.hbs';
import { ValidatedInputs } from '../../core/ValidatedInputs';
import { router } from '../../core/Router';
import { authController } from '../../controllers/AuthController';
import { store } from '../../core/Store';
import { customLog } from '../../services/customLog';

export class SignInPage extends ValidatedInputs {
  private _signIn(e: Event) {
    e.preventDefault();
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
    customLog(1, this, 'Sign in page'); // TODO: удалить

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

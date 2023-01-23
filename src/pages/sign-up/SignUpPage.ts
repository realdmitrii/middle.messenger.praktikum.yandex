import './sign-up.css';
import fn from './sign-up.hbs';
import { ValidatedInputs } from '../../core/ValidatedInputs';
import { router } from '../../core/Router';
import { authController } from '../../controllers/AuthController';
import { customLog } from '../../services/customLog';

export class SignUpPage extends ValidatedInputs {
  private _signUp(e: Event) {
    e.preventDefault();
    const result = this._finalCheck();

    // Проверяет соответствие пароля, введённого в два поля
    if (result) {
      if (result.password !== result.password_again) {
        this.warningOnFocusAndBlur('пароли не совпадают');
      }
    }

    if (result) {
      authController.signUp(result);
    }
  }

  private _goToSignInPage(e: Event) {
    e.preventDefault();
    router.go('/');
  }

  render() {
    customLog(1, this, 'Sign up page'); // TODO: удалить

    return this.compile(fn, {
      focus: this.validateInput.bind(this),
      blur: this.validateInput.bind(this),
      signUp: this._signUp.bind(this),
      goToSignInPage: this._goToSignInPage.bind(this)
    });
  }
}

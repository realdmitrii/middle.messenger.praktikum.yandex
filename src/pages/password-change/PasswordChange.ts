import { userController } from './../../controllers/UserController';
import './password-change.css';
import fn from './password-change.hbs';
import { ValidatedInputs } from '../../core/ValidatedInputs';
import { router } from '../../core/Router';
import { customLog } from '../../services/customLog';
import { store } from '../../core/Store';
import { PATH } from '../../constants';

export class PasswordChangePage extends ValidatedInputs {
  constructor() {
    super();

    store.on('changed', () => {
      this.setProps({ firstModalIsOpen: store.get().modal.first });
    });
  }

  private _save(e: Event) {
    e.preventDefault();

    const result = this._finalCheck();

    // Проверяет соответствие пароля, введённого в два поля
    if (result) {
      if (result.newPassword !== result.newPassword_again) {
        this.warningOnFocusAndBlur(
          'новый пароль введённый в поля не совпадает'
        );
      }
    }

    if (result) {
      userController.password(result);
    }
  }

  private _goBack(e: Event) {
    e.preventDefault();
    router.back();
  }

  render() {
    customLog(1, this, 'Password change page'); // TODO: удалить

    return this.compile(fn, {
      firstModalIsOpen: store.get().modal.first,
      avatar: `${PATH.baseAvatarURL}${store.get().user.avatar}`,

      focus: this.validateInput.bind(this),
      blur: this.validateInput.bind(this),
      save: this._save.bind(this),
      goBack: this._goBack.bind(this)
    });
  }
}

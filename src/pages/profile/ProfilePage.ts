import './profile.css';
import fn from './profile.hbs';
import { ValidatedInputs } from '../../core/ValidatedInputs';
import { router } from '../../core/Router';
import { store } from '../../core/Store';
import { userController } from '../../controllers/UserController';
import { customLog } from '../../services/customLog';

export class ProfilePage extends ValidatedInputs {
  constructor() {
    super();

    store.on('changed', () => {
      this.setProps({ firstModalIsOpen: store.get().modal });
    });
  }

  private _openModalChangeAvatar(e: Event) {
    e.preventDefault();
    store.set('modal.second', true);
  }

  private _changeAvatar(e: Event) {
    e.preventDefault();

    const form = this.getContent().querySelector(
      '.form_avatar'
    ) as HTMLFormElement;

    if (!form) {
      return;
    }

    const formData = new FormData(form);
    userController.changeAvatar(formData);
  }

  private _save(e: Event) {
    e.preventDefault();

    const result = this._finalCheck();

    if (result) {
      userController.profile(result);
    }
  }

  private _goToPasswordChangePage(e: Event) {
    e.preventDefault();
    router.go('/password-change');
  }

  private _goBack(e: Event) {
    e.preventDefault();
    router.back();
  }

  render() {
    customLog(1, this, 'Profile page'); // TODO: удалить

    return this.compile(fn, {
      login: store.get().user.login,
      first_name: store.get().user.first_name,
      second_name: store.get().user.second_name,
      display_name: store.get().user.display_name,
      phone: store.get().user.phone,
      email: store.get().user.email,
      modal: store.get().modal,
      avatar: `${store.get().user.avatar}`,

      changeAvatar: this._changeAvatar.bind(this),
      openModalChangeAvatar: this._openModalChangeAvatar.bind(this),
      focus: this.validateInput.bind(this),
      blur: this.validateInput.bind(this),
      save: this._save.bind(this),
      onPasswordChangePage: this._goToPasswordChangePage.bind(this),
      goBack: this._goBack.bind(this)
    });
  }
}

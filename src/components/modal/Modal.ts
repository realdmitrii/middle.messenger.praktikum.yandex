import './modal.css';
import fn from './modal.hbs';
import { Block } from '../../core/Block';
import { customLog } from '../../services/customLog';
import { store } from '../../core/Store';

interface Props {
  class: string;
  isOpen?: boolean;
}

export class Modal extends Block {
  static componentName = 'Modal';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: (e: MouseEvent) => this._close(e)
      }
    });
  }

  componentDidMount(props: unknown): void {
    const overlay = document.body.querySelector(
      '.modal__overlay'
    ) as HTMLElement;

    if (overlay) {
      /**
       * Фокусировка на div элементе overlay возможна
       * благодаря атрибуту 'tabindex'
       */
      overlay.focus();
      overlay.addEventListener('keydown', this._handler);
    }
  }

  private _closeModalHandler() {
    if (store.get().modal.fourth) {
      store.set('modal.fourth', false);
    } else if (store.get().modal.third) {
      store.set('modal.third', false);
    } else if (store.get().modal.second) {
      store.set('modal.second', false);
    } else if (store.get().modal.first) {
      store.set('modal.first', false);
    }
  }

  private _handler() {
    const overlay = document.body.querySelector(
      '.modal__overlay'
    ) as HTMLElement;

    if (overlay) {
      overlay.removeEventListener('keydown', this._handler);
      this._closeModalHandler();
    }
  }

  private _close(e: MouseEvent) {
    if (e) {
      const element = e.target as HTMLElement;
      const isOverlay = element.classList.contains('modal__overlay');
      const isCloseButton = element.classList.contains('modal__button_close');

      if (isOverlay || isCloseButton) {
        this._closeModalHandler();
      }
    }
  }

  render() {
    customLog(2, this, 'Modal'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

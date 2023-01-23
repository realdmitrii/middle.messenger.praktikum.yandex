import './error.css';
import fn from './error.hbs';
import { Block } from '../../core/Block';
import { router } from '../../core/Router';
import { customLog } from '../../services/customLog';

export class ErrorPage extends Block {
  render() {
    customLog(1, this, 'Error page'); // TODO: удалить

    return this.compile(fn, {
      goBack: (e: Event) => {
        e.preventDefault;
        router.back();
      }
    });
  }
}

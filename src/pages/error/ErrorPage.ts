import './error.css';
import fn from './error.hbs';
import { Block } from 'core/Block';
import { router } from 'core/Router';


export class ErrorPage extends Block {
  render() {
    
    return this.compile(fn, {
      goBack: (e: Event) => {
        e.preventDefault;
        router.back();
      }
    });
  }
}

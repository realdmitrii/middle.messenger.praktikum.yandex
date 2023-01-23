import './message-box.css';
import fn from './message-box.hbs';
import { Block } from '../../core/Block';
import { customLog } from '../../services/customLog';
import { store } from '../../core/Store';

interface Props {
  user_id: number;
  taken: boolean;
  time: string;
  content: string[];
}

export class MessageBox extends Block {
  static componentName = 'MessageBox';

  constructor(props: Props) {
    super({
      ...props,
      taken: props.user_id !== store.get().user.id
    });
  }

  render() {
    customLog(3, this, 'MessageBox'); // TODO: удалить
    console.log(this.props);

    return this.compile(fn, { ...this.props });
  }
}

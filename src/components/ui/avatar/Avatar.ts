import { PATH } from './../../../constants';
import './avatar.css';
import fn from './avatar.hbs';
import { Block } from '../../../core/Block';
import { customLog } from '../../../services/customLog';
import emptySVG from '../../../assets/images/avatars/empty.svg';

interface Props {
  class: string;
  online: boolean;
  avatar: string;
  onClick: () => void;
}

export class Avatar extends Block {
  static componentName = 'Avatar';

  constructor(props: Props) {
    super({
      class: props.class,
      online: props.online ? 'online' : 'offline',
      avatar: () => {
        if (props.avatar === null) {
          return emptySVG;
        } else {
          return `${PATH.baseAvatarURL}${props.avatar}`;
        }
      },
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    customLog(3, this, 'Avatar'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

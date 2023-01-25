import { PATH } from 'services/constants';
import './avatar.css';
import fn from './avatar.hbs';
import { Block } from 'core/Block';
import emptySVG from 'assets/images/avatars/empty.svg';

interface Props {
  class: string;
  online: boolean;
  imgSrc: string;
  onClick: () => void;
}

export class Avatar extends Block {
  static componentName = 'Avatar';

  constructor(props: Props) {
    super({
      class: props.class,
      online: props.online ? 'online' : 'offline',
      src: () => {
        if (props.imgSrc === null) {
          return emptySVG;
        } else {
          return `${PATH.baseAvatarURL}${props.imgSrc}`;
        }
      },
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    return this.compile(fn, { ...this.props });
  }
}

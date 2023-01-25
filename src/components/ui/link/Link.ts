import './link.css';
import fn from './link.hbs';
import { Block } from '../../../core/Block';
import { customLog } from '../../../services/customLog';

interface Props {
  class: string;
  value: string;
  onClick: () => void;
}

export class Link extends Block {
  static componentName = 'Link';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    customLog(3, this, 'Link'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

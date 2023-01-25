import { customLog } from './../../../services/customLog';
import './button.css';
import fn from './button.hbs';
import { Block } from '../../../core/Block';

interface Props {
  type: string;
  class: string;
  value: string;
  icon: boolean;
  negativeTabIndex: boolean;
  onClick: () => void;
}

export class Button extends Block {
  static componentName = 'Button';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    customLog(3, this, 'Button'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

import './button.css';
import fn from './button.hbs';
import { Block } from 'core/Block';

interface Props {
  type: string;
  class: string;
  value: string;
  icon: boolean;
  negativeTabIndex: boolean;
  onClick?: () => void;
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
    return this.compile(fn, { ...this.props });
  }
}

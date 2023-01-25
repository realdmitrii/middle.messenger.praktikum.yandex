import './input.css';
import fn from './input.hbs';
import { Block } from '../../../core/Block';
import { customLog } from '../../../services/customLog';

interface Props {
  name: string;
  type: string;
  class: string;
  autocomplete: string;
  value: string;
  placeholder: string;
  onFocus: () => void;
  onBlur: () => void;
}

export class Input extends Block {
  static componentName = 'Input';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        focus: props.onFocus,
        blur: props.onBlur
      }
    });
  }

  render() {
    customLog(3, this, 'Input'); // TODO: удалить

    return this.compile(fn, { ...this.props });
  }
}

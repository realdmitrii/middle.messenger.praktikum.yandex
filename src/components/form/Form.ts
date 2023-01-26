import fn from './form.hbs';
import { Block } from 'core/Block';

interface Props {
  class: string;
  onSubmit: (e: MouseEvent) => void;
}

export class Form extends Block {
  static componentName = 'Form';

  constructor(props: Props) {
    super({
      ...props,
      events: {
        submit: props.onSubmit
      }
    });
  }

  render() {
    return this.compile(fn, { ...this.props });
  }
}

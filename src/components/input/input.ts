import "./input.css";
import template from "./input.hbs";
import { Block } from "../../core/Block";

interface Props {
  name?: string;
  type?: string;
  class?: string;
  autocomplete: string;
  pattern?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export class Input extends Block {
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
    return this.compile(template, {
      name: this.props.name,
      type: this.props.type,
      class: this.props.class,
      autocomplete: this.props.autocomplete,
      pattern: this.props.pattern
    });
  }
}

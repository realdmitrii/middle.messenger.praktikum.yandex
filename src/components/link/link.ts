import "./link.css";
import template from "./link.hbs";
import { Block } from "../../core/Block";

interface Props {
  class: string;
  text: string;
  onClick?: () => void;
}

export class Link extends Block {
  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: props.onClick
      }
    });
  }

  render() {
    return this.compile(template, {
      class: this.props.class,
      text: this.props.text
    });
  }
}

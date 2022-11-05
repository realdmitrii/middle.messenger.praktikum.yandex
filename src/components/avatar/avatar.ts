import "./avatar.css";
import template from "./avatar.hbs";
import { Block } from "../../core/Block";

interface Props {
  online: boolean;
  imgSrc?: string;
}

export class Avatar extends Block {
  constructor(props: Props) {
    super({ ...props });
  }

  private _online(): string {
    return this.props.online ? "online" : "offline";
  }

  render() {
    return this.compile(template, {
      online: this._online(),
      imgSrc: this.props.imgSrc
    });
  }
}

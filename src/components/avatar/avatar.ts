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


  render() {
    return this.compile(template, {
      online: this.props.online ? "online" : "offline",
      imgSrc: this.props.imgSrc
    });
  }
}

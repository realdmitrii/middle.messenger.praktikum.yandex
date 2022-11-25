import "./message-box.css";
import template from "./message-box.hbs";
import { Block } from "../../core/Block";

interface Props {
  taken: boolean;
  time: Date;
  arrayMessages: string[];
  reaction: string;
}

export class MessageBox extends Block {
  constructor(props: Props) {
    super({ ...props });
  }

  private _classModifierWhose(): string {
    return this.props.taken ? "" : " message-box__flex-align_right";
  }

  private _classModifierSend(): string {
    return this.props.taken ? "taken" : "sended";
  }

  render() {
    return this.compile(template, {
      taken: this.props.taken,
      time: this.props.time,
      arrayMessages: this.props.arrayMessages,
      reaction: this.props.reaction,
      flexAlignRight: this._classModifierWhose(),
      takenSended: this._classModifierSend()
    });
  }
}

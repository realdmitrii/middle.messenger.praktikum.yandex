import "./user-card.css";
import template from "./user-card.hbs";
import { Block } from "../../core/Block";

interface Props {
  avatarSrc?: string;
  online: boolean;
  displayName: string;
  lastMessage?: string;
  activeTime?: string;
  receivedMessages?: number;
  onClick: () => void;
}

export class UserCard extends Block {
  constructor(props: Props) {
    super({
      ...props,
      events: {
        click: props.onClick
      }
    });
  }

  private _online(): string {
    return this.props.online ? "online" : "offline";
  }

  render() {
    return this.compile(template, {
      avatarSrc: this.props.avatarSrc,
      online: this._online(),
      displayName: this.props.displayName,
      lastMessage: this.props.lastMessage,
      activeTime: this.props.activeTime,
      receivedMessages: this.props.receivedMessages
    });
  }
}

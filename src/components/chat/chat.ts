import "./chat.css";
import template from "./chat.hbs";
import { Block } from "../../core/Block";

export class ChatPage extends Block {
  render() {
    return this.compile(template, {});
  }
}

import "./chat-box.css";
import template from "./chat-box.hbs";
import { Block } from "../../core/Block";
import usersData from "../../data/users.json";

export class ChatBox extends Block {
  render() {

    const _usersData = usersData[0]?.chatBox

    return this.compile(template, {
      usersData: _usersData
    });
  }
}

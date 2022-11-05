import "./selected-chats.css";
import template from "./selected-chats.hbs";
import { Block } from "../../core/Block";
import selectedChatsData from "../../data/selected.json";

export class SelectedChats extends Block {
  render() {
    return this.compile(template, {
      selectedChatsData: selectedChatsData
    });
  }
}

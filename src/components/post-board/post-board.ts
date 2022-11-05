import "./post-board.css";
import template from "./post-board.hbs";
import { Block } from "../../core/Block";

export class PostBoard extends Block {
  render() {
    return this.compile(template, {});
  }
}

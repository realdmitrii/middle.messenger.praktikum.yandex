import "./error.css";
import template from "./error.hbs";
import { Block } from "../../core/Block";
import { renderDOM } from "../../core/renderDOM";
import { IndexPage } from "../index";

const errors: Record<string, string> = {
  "404": "Не туда попали",
  "500":
    "Ошибка на сервере. Мы уже фиксим"
};

export class ErrorPage extends Block {
  constructor(props: { code: string }) {
    super(props);
  }

  private _description(): string {
    const index = String(this.props.code);
    return errors[index];
  }

  private _goToIndexPage(e: Event) {
    e.preventDefault();
    renderDOM(new IndexPage());
  }

  render() {
    return this.compile(template, {
      code: this.props.code,
      description: this._description(),
      goToIndexPage: (e: Event) => this._goToIndexPage(e)
    });
  }
}

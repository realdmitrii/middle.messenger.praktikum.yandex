import template from "./index.hbs";
import { Block } from "../../core/Block";
import { renderDOM } from "../../core/renderDOM";
import { SignInPage } from "../login/login";
import { ErrorPage } from "../error/error";
import { SignUpPage } from "../sign-up/sign-up";

export class IndexPage extends Block {
  private _goToSignInPage(e: Event) {
    e.preventDefault();
    renderDOM(new SignInPage());
  }

  private _goToErrorPage404(e: Event) {
    e.preventDefault();
    renderDOM(new ErrorPage({ code: "404" }));
  }

  private _goToErrorPage500(e: Event) {
    e.preventDefault();
    renderDOM(new ErrorPage({ code: "500" }));
  }
  private _signUp(e: Event) {
    e.preventDefault();
    renderDOM(new SignUpPage());
  }

  render() {
    return this.compile(template, {
      goToSignInPage: (e: Event) => this._goToSignInPage(e),
      goToErrorPage404: (e: Event) => this._goToErrorPage404(e),
      goToErrorPage500: (e: Event) => this._goToErrorPage500(e),
      signUp: (e: Event) => this._signUp(e)
    });
  }
}

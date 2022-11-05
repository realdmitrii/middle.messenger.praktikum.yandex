import { ChatPage } from "./../chat/chat";
import "./login.css";
import template from "./login.hbs";
import { Block } from "../../core/Block";
import { validate } from "../../services/helpers";
import { renderDOM } from "../../core/renderDOM";
import { SignUpPage } from "../sign-up/sign-up";

const flagMap = new Map([
  ["login", "false"],
  ["password", "false"]
]);

let currentInput: HTMLInputElement;
let inputName: string | null;

export class SignInPage extends Block {
  private _validate() {
    if (!currentInput || !inputName) {
      return;
    }

    // Проверка на первую фокусировку
    if (flagMap.get(inputName) === "false") {
      flagMap.set(inputName, "true");
      return;
    }

    currentInput.value = currentInput.value.trim();
    const validatedResult = validate(
      String(inputName),
      currentInput.value.trim()
    );

    const warningDiv = this.getContent().querySelector(".sign-in__warning");
    if (validatedResult.length > 0) {
      currentInput.classList.add("input__warning");
      warningDiv!.innerHTML = validatedResult;
    } else {
      currentInput.classList.remove("input__warning");
      warningDiv!.innerHTML = "";
    }
  }

  private _validateOnFocus() {
    // Проверяет является ли полем элемент, на который установлен фокус
    if (document.activeElement?.tagName !== "INPUT") {
      return;
    }
    currentInput = document.activeElement as HTMLInputElement;
    if (currentInput) {
      inputName = currentInput.getAttribute("name");
    } else {
      inputName = "";
      return;
    }

    this._validate();
  }

  private _validateOnBlur() {
    this._validate();
  }

  private _signIn(e: Event) {
    e.preventDefault();

    const inputs = document.querySelectorAll(".input");
    let warningFlag = false;

    // Обнуляет все флаги первичных активаций полей
    flagMap.forEach((_, key, map) => {
      map.set(key, "true");
    });

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as HTMLInputElement;
      input.value = input.value.trim();
      const validatedResult = validate(
        String(input.getAttribute("name")),
        input.value
      );

      const warningDiv = this.getContent().querySelector(".sign-in__warning");
      if (validatedResult.length > 0) {
        input.classList.add("input__warning");
        if (!warningFlag) {
          warningFlag = true;
          warningDiv!.innerHTML = validatedResult;
        }
      }
    }

    // Все поля проверены, замечаний нет, warningFlag в положении false
    if (!warningFlag) {
      renderDOM(new ChatPage());
    }
  }

  private _signUp(e: Event) {
    e.preventDefault();
    renderDOM(new SignUpPage());
  }

  render() {
    return this.compile(template, {
      onFocus: () => this._validateOnFocus(),
      onBlur: () => this._validateOnBlur(),
      signIn: (e: Event) => this._signIn(e),
      signUp: (e: Event) => this._signUp(e)
    });
  }
}

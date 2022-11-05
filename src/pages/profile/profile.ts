import "./profile.css";
import template from "./profile.hbs";
import { Block } from "../../core/Block";
import { renderDOM } from "../../core/renderDOM";
import { validate } from "../../services/helpers";
import { ChatPage } from "../chat/chat";
import { PasswordChangePage } from "../password-change/password-change";

const flagMap = new Map([
  ["login", "false"],
  ["first_name", "false"],
  ["second_name", "false"],
  ["display_name", "false"],
  ["phone", "false"],
  ["email", "false"]
]);

let currentInput: HTMLInputElement;
let inputName: string | null;

export class ProfilePage extends Block {
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

    const warningDiv = this.getContent().querySelector(".profile__warning");
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

  private _save(e: Event) {
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

      const warningDiv = this.getContent().querySelector(".profile__warning");
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
      //TODO добавить логику по сохранению данных (в рамках третьего спринта)
      renderDOM(new ChatPage());
    }
  }

  private _goToPasswordChangePage(e: Event) {
    e.preventDefault();
    renderDOM(new PasswordChangePage());
  }

  private _cancel(e: Event) {
    e.preventDefault();
    renderDOM(new ChatPage());
  }

  render() {
    return this.compile(template, {
      onFocus: () => this._validateOnFocus(),
      onBlur: () => this._validateOnBlur(),
      save: (e: Event) => this._save(e),
      goToPasswordChangePage: (e: Event) => this._goToPasswordChangePage(e),
      cancel: (e: Event) => this._cancel(e)
    });
  }
}

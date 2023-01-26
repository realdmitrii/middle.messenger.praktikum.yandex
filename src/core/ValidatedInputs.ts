import { Block } from './Block';
import { validate } from '../services/validate';
import { xssDef } from '../services/xssDef';

/**
 * ! Класс имеет привязку к блоку отвечающему
 * ! за информирование пользователя о текущих
 * ! несоответствиях в значениях полей.
 * ! Он также добавляет всем полям имеющим
 * ! несоответствующее значение css класс 'input__warning'
 * ! выделяющий данные поля обводкой красного цвета.
 */
export abstract class ValidatedInputs extends Block {
  private _setOfFlags: Set<string>;
  private _currentInput: HTMLInputElement;
  private _inputName: string | null;

  constructor() {
    super();
    this._setOfFlags = new Set();
    this.fillSet();
  }

  private fillSet() {
    Object.values(this.children).forEach(child => {
      const element = child._element as HTMLInputElement;
      if (element.name) {
        this._setOfFlags.add(element.name);
      }
    });
  }

  protected warningOnFocusAndBlur(warning: string): void {
    // ! Блок отвечающий за информирование пользователя
    const warningDiv = document.body.querySelector('.warning');

    if (warningDiv) {
      warningDiv.innerHTML = xssDef(warning);
    }
  }

  private _warningOnCheck(warning: string): void {
    // ! Блок отвечающий за информирование пользователя
    const warningDiv = document.body.querySelector('.warning');

    if (warningDiv && warningDiv.textContent?.length === 0) {
      warningDiv.innerHTML = xssDef(warning);
    }
  }

  // Проверяет поля при фокусировки и расфокусировки.
  protected validateInput() {
    // Проверяет является ли полем элемент, на который установлен фокус
    if (document.activeElement?.tagName === 'INPUT') {
      this._currentInput = document.activeElement as HTMLInputElement;
      this._inputName = this._currentInput.getAttribute('name');

      if (!this._currentInput || !this._inputName) {
        return;
      }

      // Проверка на первую фокусировку поля
      if (this._setOfFlags.delete(this._inputName)) {
        return;
      }
    }

    if (!this._currentInput) {
      return;
    }

    this._currentInput.value = this._currentInput.value.trim();

    const validatedResult = validate(
      String(this._inputName),
      this._currentInput.value
    );

    if (validatedResult.length > 0) {
      this._currentInput.classList.add('input__warning');
      this.warningOnFocusAndBlur(validatedResult);
    } else {
      this._currentInput.classList.remove('input__warning');
      this.warningOnFocusAndBlur('');
    }
  }

  // В случае выполнения всех условий полей, возвращает объект с данными.
  protected _finalCheck(): Record<string, string | number> | false {
    const inputs = document.body.querySelectorAll('.input');
    let warningFlag = false;

    const data: Record<string, string | number> = {};
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as HTMLInputElement;
      const validatedResult = validate(
        String(input.getAttribute('name')),
        input.value
      );

      if (validatedResult.length > 0) {
        input.classList.add('input__warning');

        if (!warningFlag) {
          warningFlag = true;
          this._warningOnCheck(validatedResult);
        }
      } else {
        Object.assign(data, { [input.name]: input.value });
      }
    }

    // Все поля проверены, замечаний нет, warningFlag в положении false
    if (!warningFlag) {
      return data;
    } else {
      return false;
    }
  }
}

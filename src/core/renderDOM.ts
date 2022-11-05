import { Block } from "./Block";

export function renderDOM(block: Block) {
  const root = document.querySelector("#app");

  if (!root) {
    throw new Error('Отсутствует HTML элемент с id "app"');
  }

  root.innerHTML = "";
  root.appendChild(block.getContent());
}

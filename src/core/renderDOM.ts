import { Block } from './Block';

export function renderDOM(block: Block) {
  const root = document.querySelector('#app');

  if (!root) {
    throw new Error('Корневой элемент не найден');
  }

  root.innerHTML = '';
  root.appendChild(block.getContent());
}

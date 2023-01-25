import { Block } from './Block';
import Handlebars from 'handlebars/runtime';
import { HelperOptions } from 'handlebars';

interface BlockConstructable<Props = any> {
  new (props: Props): Block;
  componentName?: string;
}

export function registerComponent(Component: BlockConstructable) {
  Handlebars.registerHelper(
    Component.componentName || Component.name,
    function ({ fn, hash, data }: HelperOptions) {
      if (!data.root.children) {
        data.root.children = {};
      }

      const component = new Component(hash);
      data.root.children[component.id] = component;
      const contents: any = fn ? fn(this) : '';
      return `<div data-id='${component.id}'>${contents}</div>`;
    }
  );
}

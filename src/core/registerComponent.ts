import { Block } from "./Block";
import * as Handlebars from "handlebars/dist/handlebars.runtime";

export function registerComponent(name: string, Component: typeof Block) {
  Handlebars.registerHelper(name, function ({ hash, data }: any) {
    if (!data.root.children) {
      data.root.children = {};
    }

    const component = new Component(hash);

    data.root.children[component.id] = component;

    return `<div data-id='${component.id}'></div>`;
  });
}

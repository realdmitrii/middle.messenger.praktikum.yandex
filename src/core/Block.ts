import EventBus from "./EventBus";
import { nanoid } from "nanoid";

export class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  } as const;

  static componentName = "Block";

  id = nanoid(6);
  private _element: HTMLElement | null = null;
  protected readonly props: Record<string, unknown>;
  protected children: Record<string, Block> = {};
  private _refs: Record<string, Block> = {};
  private _eventBus: EventBus = new EventBus();

  constructor(props?: unknown) {
    this.props = this._makePropsProxy(props || ({} as unknown));
    this._registerEvents();
    this._eventBus.emit(Block.EVENTS.INIT, this.props);
  }

  private _registerEvents() {
    this._eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    this._eventBus.on(
      Block.EVENTS.FLOW_CDM,
      this._componentDidMount.bind(this)
    );
    this._eventBus.on(
      Block.EVENTS.FLOW_CDU,
      this._componentDidUpdate.bind(this)
    );
    this._eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    this._element = this._createDocumentElement("div");
  }

  protected init() {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER, this.props);
  }

  private _componentDidMount(props: unknown) {
    this.componentDidMount(props);
  }

  // Может быть переопределено пользователем
  protected componentDidMount(props: unknown) {}

  private _componentDidUpdate(oldProps: unknown, newProps: unknown) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(oldProps: any, newProps: any) {
    return true;
  }

  setProps = (nextProps: unknown) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props as {}, nextProps);
  };

  protected get element(): HTMLElement {
    return this._element!;
  }

  private _render() {
    const fragment = this.render();

    this._removeEvents();

    const newElement = fragment.firstElementChild!;
    this._element!.replaceWith(newElement);
    this._element = newElement as HTMLElement;

    this._addEvents();
  }

  protected render(): DocumentFragment {
    return new DocumentFragment();
  }

  getContent(): HTMLElement {
    // Уловка позволяющая вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (
          this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
        ) {
          this._eventBus.emit(Block.EVENTS.FLOW_CDM);
        }
      }, 100);
    }

    return this.element!;
  }

  private _makePropsProxy = (props: any): any => {
    return new Proxy(props as unknown as object, {
      get(target: Record<string, unknown>, prop: string) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target: Record<string, unknown>, prop: string, value: unknown) => {
        const oldProps = { ...target };
        target[prop] = value;

        // Запуск обновления компонента
        // Плохой cloneDeep, в след итерации нужно заставлять добавлять cloneDeep им самим
        this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      }
    }) as unknown;
  };

  private _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  private _removeEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events || !this._element) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this._element!.removeEventListener(event, listener);
    });
  }

  private _addEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this._element!.addEventListener(event, listener);
    });
  }

  protected compile(template: (context: any) => string, context: any) {
    const contextAndStubs = { ...context, children: this.children };

    // Object.entries(this.children).forEach(([name, component]) => {
    //   contextAndStubs[name] = `<div data-id="${component.id}"></div>`;
    // });

    const html = template(contextAndStubs);
    const temp = document.createElement("template");
    temp.innerHTML = html;

    Object.entries(this.children).forEach(([_, component]) => {
      const stub = temp.content.querySelector(`[data-id="${component.id}"]`);

      if (!stub) {
        return;
      }

      // component.getContent()?.append(...Array.from(stub.childNodes));

      stub.replaceWith(component.getContent()!);
    });

    return temp.content;
  }

  protected show() {
    this.getContent().style.display = "block";
  }

  protected hide() {
    this.getContent().style.display = "none";
  }
}

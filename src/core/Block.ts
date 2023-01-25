import EventBus from './EventBus';
import { nanoid } from 'nanoid';

export class Block<Props extends Record<string, any> = any> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_RENDER: 'flow:render'
  } as const;

  id = nanoid(6);
  _element: HTMLElement | null = null;
  props: Props;
  children: Record<string, Block> = {};
  _eventBus: EventBus = new EventBus();

  constructor(props?: Props) {
    this.props = props || ({} as Props);
    this._registerEvents();
    this._eventBus.emit(Block.EVENTS.INIT, this.props);
  }

  get element(): HTMLElement {
    return this._element!;
  }

  setProps = (newPartialProps: Props) => {
    if (!newPartialProps) {
      return;
    }

    const oldProps = this.props;

    const newProps = { ...oldProps, ...newPartialProps };

    this.props = newProps;
    this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, newProps);
  };

  /**
   * Вспомогательная функция, проверяющая, факт нахождения элемента в DOM дереве.
   * В том случае если его нет, инициирует срабатывание события COMPONENT_WILL_UNMOUNT
   */
  private _checkInDom() {
    const elementInDOM = document.body.contains(this._element);

    if (elementInDOM) {
      setTimeout(() => this._checkInDom(), 1000);
      return;
    }

    this._eventBus.emit(Block.EVENTS.FLOW_CWU, this.props);
  }

  private _registerEvents() {
    this._eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    this._eventBus.on(
      Block.EVENTS.FLOW_CDM,
      this._componentDidMount.bind(this)
    );
    this._eventBus.on(
      Block.EVENTS.FLOW_CDU,
      this._componentDidUpdate.bind(this)
    );
    this._eventBus.on(
      Block.EVENTS.FLOW_CWU,
      this._componentWillUnmount.bind(this)
    );
    this._eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  private _createResources() {
    this._element = this._createDocumentElement('div');
  }

  private _init() {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER, this.props); // TODO удалить this.props
  }

  private _componentDidMount(props: Props) {
    this._checkInDom();
    this.componentDidMount(props);
  }

  // Может быть переопределено пользователем
  // eslint-disable-next-line
  componentDidMount(_props: Props) {}

  private _componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return false;
    }

    this._render();
  }

  componentDidUpdate(_oldProps: Props, _newProps: Props) {
    return true;
  }

  private _componentWillUnmount() {
    this._eventBus.destroy();
    this.componentWillUnmount();
  }

  componentWillUnmount() {}

  private _addEvents() {
    if (this.props) {
      const events: Record<string, () => void> = (this.props as any).events;

      if (!events) {
        return;
      }

      Object.entries(events).forEach(([event, listener]) => {
        this._element!.addEventListener(event, listener);
      });
    }
  }

  private _removeEvents() {
    if (this.props) {
      const events: Record<string, () => void> = (this.props as any).events;

      if (!events || !this._element) {
        return;
      }

      Object.entries(events).forEach(([event, listener]) => {
        this._element!.removeEventListener(event, listener);
      });
    }
  }

  private _render() {
    const fragment = this.render();

    this._removeEvents();

    const newElement = fragment.firstElementChild!;

    if (!this._element) {
      return;
    }

    this._element!.replaceWith(newElement);
    this._element = newElement as HTMLElement;

    this._addEvents();
  }

  render(): DocumentFragment {
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

  compile(fn: (context: any) => string, props: Record<string, unknown>) {
    const html = fn({ ...props, children: this.children });
    const temp = document.createElement('template');
    temp.innerHTML = html;

    // Заменяет заглушки на компоненты
    Object.entries(this.children).forEach(([id, component]) => {
      const stub = temp.content.querySelector(`[data-id="${id}"]`);

      if (!stub) {
        return;
      }

      const stubChildren = stub.childNodes.length ? stub.childNodes : [];

      // Заменяет заглушку на component._element
      const content = component.getContent();
      stub.replaceWith(content);

      // Ищет блок с атрибутом 'data-slot="1"', для размещения дочерних элементов
      const slotContent = content.querySelector('[data-slot="1"]');

      if (slotContent && stubChildren.length) {
        slotContent.append(...stubChildren);
      }
    });

    return temp.content;
  }
}

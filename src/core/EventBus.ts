type callbackType = (...args: any) => void;

export default class EventBus {
  listeners: Record<string, callbackType[]> = {};

  on(eventName: string, callback: callbackType) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  off(eventName: string, callback: callbackType) {
    if (!this.listeners[eventName]) {
      throw new Error(`Нет события: ${eventName}`);
    }

    this.listeners[eventName] = this.listeners[eventName].filter(
      listener => listener !== callback
    );
  }

  emit(eventName: string, ...args: unknown[]) {
    if (!this.listeners[eventName]) {
      return;
    }

    this.listeners[eventName].forEach(listener => {
      listener(...args);
    });
  }

  destroy() {
    this.listeners = {};
  }
}

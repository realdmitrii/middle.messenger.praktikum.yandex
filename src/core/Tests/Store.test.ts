import { Store } from 'core/Store';
import { appStateDefault } from 'core/Store';

describe('Объект состояния Store', () => {
  it('при создании получает состояние по умолчанию', () => {
    const store = new Store();

    expect(store.get()).toEqual(appStateDefault);
  });

  it('устанавливает значение', () => {
    const store = new Store();

    store.set('user.id', '707');

    expect(store.get().user.id).toEqual('707');
  });
});

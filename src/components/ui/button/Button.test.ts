import { fireEvent, getByTestId, getByText } from '@testing-library/dom';
import { Block } from 'core/Block';
import { store } from 'core/Store';
import { renderBlock } from 'tests/renderUtil';
import { Button } from './Button';

const buttonProps = {
  type: 'button',
  class: 'test__button',
  value: 'кнопка',
  icon: false,
  negativeTabIndex: false,
  onClick: () => store.set('isAuth', true)
};

describe('Экземпляр класса Button', () => {
  it('создаётся и монтируется в документ', () => {
    renderBlock(Button, buttonProps);

    expect(getByTestId(document.body, 'button-test')).toBeInTheDocument();
  });

  it('имеет заданные при создании свойства', () => {
    const btn = new Button(buttonProps);

    expect(btn.props).toHaveProperty('type', 'button');
    expect(btn.props).toHaveProperty('class', 'test__button');
    expect(btn.props).toHaveProperty('value', 'кнопка');
    expect(btn.props).toHaveProperty('icon', false);
    expect(btn.props).toHaveProperty('negativeTabIndex', false);
  });

  it('обновляется при установки свойства методом setProps', () => {
    const btn = new Button(buttonProps);

    const mockProp = jest.fn();
    btn._eventBus.on(Block.EVENTS.FLOW_CDU, mockProp);
    btn.setProps({ mockProp1: 'другая строка' });

    expect(mockProp).toHaveBeenCalled();
  });

  it('при нажатии вызывает необходимую функцию', () => {
    renderBlock(Button, buttonProps);

    fireEvent(
      getByText(document.body, 'кнопка'),
      new MouseEvent('click', {
        bubbles: false,
        cancelable: true
      })
    );

    expect(store.get().isAuth).toBe(true);
  });
});

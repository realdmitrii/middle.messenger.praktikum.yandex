const idSet = new Set();
let currentPage = '';

/**
 * Помечает компоненты имеющие такой же идентификатор
 * красным цветом шрифта
 */
function markDuplicate(id: number): boolean {
  if (idSet.has(id)) {
    return true;
  } else {
    idSet.add(id);
    return false;
  }
}

export const customLog = function (...args: any[]): void {
  // return;
  let mainStyle = '';
  let idStyle = '';

  /**
   * Очищает множество идентификаторов при
   * переходе на другую страницу
   */
  const isFirstInit = currentPage === '';
  const isPage = args[0] === 1;

  if (isPage && isFirstInit) {
    currentPage = args[2];
  } else if (isPage && !isFirstInit) {
    currentPage = '';
    idSet.clear();
  }

  if (args[0] === 0) {
    // Ошибки
    console.groupEnd();
    console.error(args[1])
    console.groupEnd();
  } else if (args[0] === 1) {
    // Страницы
    mainStyle =
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
      'background: hsla(120, 100%, 70%, 0.1); color: hsl(120, 70%, 50%);' +
      'border: 1px solid hsla(120, 100%, 70%, 0.1); border-radius: 8px';

    console.groupEnd();
    console.groupCollapsed(`%c ${args[2]} `, mainStyle);
    console.dir(args[1]);
    return;
  } else if (args[0] === 2) {
    // Составные компоненты
    const name = args[2];
    const id = args[1].id;

    mainStyle =
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
      'background: hsla(30, 100%, 40%, 0.1); color: hsl(30, 100%, 40%);' +
      'border: 1px solid hsla(30, 100%, 70%, 0.1)';

    if (markDuplicate(id)) {
      idStyle =
        'padding: 3px 3px 3px 3px; font-weight: normal;' +
        'background: hsla(30, 100%, 40%, 0.1); color: hsl(0, 100%, 50%);' +
        'border: 1px solid hsla(30, 100%, 70%, 0.1)';
    } else {
      idStyle = mainStyle;
    }

    console.groupEnd();
    console.groupCollapsed(`%c ${name} ` + `%c ${id} `, mainStyle, idStyle);
    console.dir(args[1]);
  } else if (args[0] === 3) {
    // Базовые компоненты
    const name = args[2];
    const id = args[1].id;

    if (name === 'MessageBox') {
      if (args[1].props.taken) {
        mainStyle = 'color: hsl(200, 42%, 55%)';
      } else {
        mainStyle = 'color: hsl(133, 42%, 55%)';
      }
    } else if (name === 'UserCard') {
      mainStyle = 'color: hsl(0, 100%, 70%)';
    } else if (name === 'UsersBoard') {
      mainStyle = 'color: hsl(0, 100%, 70%)';
    } else if (name === 'Avatar') {
      mainStyle = 'color: hsl(0, 100%, 70%)';
    } else if (name === 'Button') {
      mainStyle = 'color: hsl(300, 100%, 40%)';
    } else if (name === 'Input') {
      mainStyle = 'color: hsl(60, 75%, 43%)';
    } else if (name === 'Link') {
      mainStyle = 'color: hsl(180, 100%, 40%)';
    }

    if (markDuplicate(id)) {
      idStyle = 'color: hsl(0, 100%, 50%)';
    } else {
      idStyle = mainStyle;
    }

    console.log(`%c ${name}` + `%c | ${id} `, mainStyle, idStyle);
  } else if (args[0] === 4) {
    // Контроллеры
    const [_, xhr, title] = args;
    let codeColor = '';

    if (xhr.status === 200) {
      codeColor = '120';
    } else {
      codeColor = '0';
    }

    const controllerStyle =
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
      'background: hsla(180, 75%, 50%, 0.1); color: hsl(180, 75%, 50%);' +
      'border-top: 1px solid hsla(120, 100%, 70%, 0.1);' +
      'border-bottom: 1px solid hsla(120, 100%, 70%, 0.1);' +
      'border-left: 1px solid hsla(120, 100%, 70%, 0.1);' +
      'border-radius: 8px 0 0 8px';

    const codeStyle =
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
      `background: hsla(${codeColor}, 75%, 50%, 0.1);` +
      `color: hsl(${codeColor}, 75%, 50%);` +
      `border-top: 1px solid hsla(${codeColor}, 100%, 70%, 0.1);` +
      `border-bottom: 1px solid hsla(${codeColor}, 100%, 70%, 0.1)`;

    const responseStyle =
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
      'background: hsla(60, 75%, 50%, 0.1); color: hsl(50, 75%, 50%);' +
      'border-top: 1px solid hsla(60, 100%, 70%, 0.1);' +
      'border-right: 1px solid hsla(60, 100%, 70%, 0.1);' +
      'border-bottom: 1px solid hsla(60, 100%, 70%, 0.1);' +
      'border-radius: 0 8px 8px 0';

    if (xhr.response === 'OK') {
      console.log(
        `%c ${title} ` + `%c ${xhr.status} ` + `%c OK `,
        controllerStyle,
        codeStyle,
        responseStyle
      );
    } else {
      console.groupEnd();
      console.groupCollapsed(
        `%c ${title} ` + `%c ${xhr.status} ` + `%c ... `,
        controllerStyle,
        codeStyle,
        responseStyle
      );
      console.warn(JSON.parse(xhr.response));
      console.groupEnd();
    }
  } else if (args[0] === 5) {
    // Сетевой разъём
    console.groupEnd();
    console.log(
      `%c ${args[1]} `,
      'padding: 3px 3px 3px 3px; font-weight: normal;' +
        'background: hsla(60, 75%, 50%, 0.1); color: hsl(50, 75%, 50%);' +
        'border: 1px solid hsla(60, 100%, 70%, 0.1); border-radius: 8px'
    );
  }
};

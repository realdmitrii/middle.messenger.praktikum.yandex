// Изменяет значение свойства объекта по указанному пути
export function set(object: any, path: string, value: unknown) {
  if (typeof path !== 'string') {
    throw new Error('аргумент path должен быть строкой');
  }

  if (object && object.constructor !== Object) {
    return object;
  }

  const propsArr = path.split('.');
  const objHasProp: boolean = Object.prototype.hasOwnProperty.call(
    object,
    propsArr[0]
  );

  if (propsArr.length > 1) {
    if (!objHasProp) {
      Object.assign(object, { [propsArr[0]]: {} });
    }
    const slicedPath = path.slice(path.indexOf('.') + 1);
    set(object[propsArr[0]] as Record<string, unknown>, slicedPath, value);
  } else {
    if (!objHasProp) {
      Object.assign(object, { [propsArr[0]]: value });
    } else {
      object[propsArr[0]] = value;
    }
  }

  return object;
}

// Производит полное копирование объекта
export function cloneDeep<T>(target: T): T {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  if (target instanceof Date) {
    return new Date(target.valueOf()) as any;
  }

  if (target instanceof Array) {
    const copy = [] as any[];
    (target as any[]).forEach(v => {
      copy.push(v);
    });
    return copy.map((n: any) => cloneDeep<any>(n)) as any;
  }

  if (typeof target === 'object') {
    const copy = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };

    Object.keys(copy).forEach(k => {
      copy[k] = cloneDeep<any>(copy[k]);
    });

    return copy as T;
  }

  return target;
}

type PlainObject<T = any> = {
  [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]'
  );
}

function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is [] | PlainObject {
  return isPlainObject(value) || isArray(value);
}

// Осуществляет полную проверку объектов на равенство
export function isEqual(lhs: PlainObject, rhs: PlainObject) {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) {
    return false;
  }

  for (const [key, value] of Object.entries(lhs)) {
    const rightValue = rhs[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

function getParams(data: PlainObject | [], parentKey?: string) {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(data)) {
    if (isArrayOrObject(value)) {
      result.push(...getParams(value, getKey(key, parentKey)));
    } else {
      result.push([getKey(key, parentKey), encodeURIComponent(String(value))]);
    }
  }

  return result;
}

export function queryString(data: PlainObject) {
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }

  return getParams(data)
    .map(arr => arr.join('='))
    .join('&');
}

// Возвращает дату в соответствующем для карточки чата формате
export function getChatCardDate(time: string): string {
  const chatDate = new Date(time);
  const chatDate_ms = chatDate.getTime();
  const currentDate_ms = Date.now();

  if (currentDate_ms - chatDate_ms > 86_400_000) {
    const outcome = chatDate.toLocaleDateString('ru-RU', {
      weekday: 'short'
    });

    return outcome.replace(outcome[0], outcome[0].toUpperCase());
  }

  return chatDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Возвращает время сообщения в формате часы:минуты
export function getMessageTime(time: string): string {
  return new Date(time).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

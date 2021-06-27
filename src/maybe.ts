type Nothing = null | undefined;

export class Maybe<Value> {
  private readonly wrappedValue: Value | Nothing;

  constructor(wrappedValue: Value | Nothing) {
    this.wrappedValue = wrappedValue;
  }

  // Extracting the value

  valueOr = (defaultValue: Value): Value => {
    return Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : defaultValue;
  };

  valueOrThrow = (error: Error = new TypeError('Wrapped value is undefined or null')): Value | never => {
    return this.valueOrExecute(() => {
      throw error;
    });
  };

  valueOrExecute = (closure: () => Value): Value => {
    return Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : closure();
  };

  // Existence checking

  isSomething = () => {
    return !this.isNothing();
  };

  isNothing = () => {
    return this.wrappedValue === undefined || this.wrappedValue === null;
  };

  // Mapping

  map = <Output>(mapper: (value: Value) => Output | Nothing): Maybe<Output> => {
    if (this.isNothing()) {
      return Maybe.nothing();
    }
    // @ts-ignore
    return new Maybe(mapper(this.wrappedValue));
  };

  flatMap = <Output>(mapper: (value: Value) => Maybe<Output>): Maybe<Output> => {
    return this.map(mapper).map(it => it.wrappedValue);
  };

  // Conditional callbacks

  ifNothing = (callback: () => void): Maybe<Value> => {
    if (this.isNothing()) {
      callback();
    }

    return this;
  };

  ifSomething = (callback: (_: Value) => void): Maybe<Value> => {
    return this.map(value => {
      callback(value);
      return value;
    });
  };

  // Filtering

  nothingUnless = (filter: (_: Value) => boolean): Maybe<Value> => {
    return this.map(value => (filter(value) ? value : undefined));
  };

  nothingIf = (filter: (_: Value) => boolean): Maybe<Value> => {
    return this.nothingUnless(it => !filter(it));
  };

  // Utilities

  or = (other: Maybe<Value>): Maybe<Value> => (this.isNothing() ? other : this);

  orJust = (other: Value): Maybe<Value> => (this.isNothing() ? Maybe.just(other) : this);

  zip<OtherValue>(other: Maybe<OtherValue>): Maybe<[Value, OtherValue]> {
    return this.map(it => other.map((t: OtherValue): [Value, OtherValue] => [it, t]).wrappedValue);
  }

  mapTo = <Key extends keyof Value>(key: Key): Maybe<Value[Key]> => this.map(value => value[key]);

  stringify = (): Maybe<string> => this.map(value => JSON.stringify(value).replace(/\"/g, ""));


  // Static members

  static just<Value>(value: Value): Maybe<Value> {
    return new Maybe<Value>(value);
  }

  static nothing<Value>(): Maybe<Value> {
    return new Maybe<Value>(undefined);
  }

  static isSomething<Value>(value: Value | Nothing): value is Value {
    return !this.isNothing(value);
  }

  static isNothing<Value>(value: Value | Nothing): value is Nothing {
    return new Maybe(value).isNothing();
  }
}

export default function maybe<Value>(value: Value | Nothing): Maybe<Value> {
  if (Maybe.isNothing(value)) {
    return Maybe.nothing();
  }

  return Maybe.just(value);
}

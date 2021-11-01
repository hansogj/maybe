export type Optional<T> = T | undefined;

export class Maybe<Value> {
  private readonly wrappedValue: Optional<Value>;

  constructor(wrappedValue: Optional<Value>) {
    this.wrappedValue = wrappedValue;
  }

  // Extracting the value
  valueOr = <T>(defaultValue: T): Value | T =>
    Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : defaultValue;

  valueOrThrow = (
    error: Error = new TypeError("Wrapped value is undefined or null"),
  ): Value | never =>
    this.valueOrExecute(() => {
      throw error;
    });

  valueOrExecute = (closure: () => Value): Value =>
    Maybe.isSomething(this.wrappedValue) ? this.wrappedValue : closure();

  // Existence checking
  isSomething = () => {
    return !this.isNothing();
  };

  isNothing = () =>
    this.wrappedValue === undefined || this.wrappedValue === null;

  // Mapping
  map = <Output>(mapper: (value: Value) => Optional<Output>): Maybe<Output> =>
    // eslint-disable-next-line
    // @ts-ignore
    this.isNothing() ? Maybe.nothing() : new Maybe(mapper(this.wrappedValue));

  flatMap = <Output>(mapper: (value: Value) => Maybe<Output>): Maybe<Output> =>
    this.map(mapper).map((it) => it.wrappedValue);

  // Conditional callbacks
  ifNothing = (callback: () => void): Maybe<Value> => {
    if (this.isNothing()) {
      callback();
    }
    return this;
  };

  ifSomething = (callback: (_: Value) => void): Maybe<Value> =>
    this.map((value) => {
      callback(value);
      return value;
    });

  // Filtering
  nothingUnless = (filter: (_: Value) => boolean): Maybe<Value> =>
    this.map((value) => (filter(value) ? value : undefined));

  nothingIf = (filter: (_: Value) => boolean): Maybe<Value> =>
    this.nothingUnless((it) => !filter(it));

  // Utilities
  or = (other: Maybe<Value>): Maybe<Value> => (this.isNothing() ? other : this);
  orJust = (other: Value): Maybe<Value> =>
    this.isNothing() ? Maybe.just(other) : this;
  zip<OtherValue>(other: Maybe<OtherValue>): Maybe<[Value, OtherValue]> {
    return this.map(
      (it) =>
        other.map((t: OtherValue): [Value, OtherValue] => [it, t]).wrappedValue,
    );
  }

  mapTo = <Key extends keyof Value>(key: Key): Maybe<Value[Key]> =>
    this.map((value) => value[key]);
  stringify = (): Maybe<string> =>
    this.map((value) => JSON.stringify(value).replace(/\"/g, ""));

  // Static members
  static just<Value>(value: Value): Maybe<Value> {
    return new Maybe<Value>(value);
  }

  static nothing<Value>(): Maybe<Value> {
    return new Maybe<Value>(undefined);
  }

  static isSomething<Value>(value: Optional<Value>): value is Value {
    return !this.isNothing(value);
  }

  static isNothing<Value>(value: Optional<Value>): value is undefined {
    return new Maybe(value).isNothing();
  }
}

export default function maybe<Value>(value: Optional<Value>): Maybe<Value> {
  if (Maybe.isNothing(value)) {
    return Maybe.nothing();
  }

  return Maybe.just(value);
}

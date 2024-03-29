import maybe, { Maybe } from './maybe';

describe('maybe', () => {
  it('returns something for values', () => expect(maybe(0).isSomething()).toBe(true));

  it('returns nothing for undefined', () => expect(maybe(undefined).isNothing()).toBe(true));
  it('returns nothing for null', () => expect(maybe(null).isNothing()).toBe(true));
});

describe('Maybe', () => {
  describe('static member', () => {
    describe('just', () => {
      it('returns something', () => expect(Maybe.just(1).isSomething()).toEqual(true));
    });

    describe('nothing', () => {
      it('returns nothing', () => expect(Maybe.nothing().isNothing()).toEqual(true));
    });

    describe('isNothing', () => {
      it('returns true for null', () => expect(Maybe.isNothing(null)).toEqual(true));
      it('returns true for undefined', () => expect(Maybe.isNothing(undefined)).toEqual(true));

      it('returns false for empty objects', () => expect(Maybe.isNothing({})).toEqual(false));
      it('returns false for empty arrays', () => expect(Maybe.isNothing([])).toEqual(false));
      it('returns false for empty strings', () => expect(Maybe.isNothing('')).toEqual(false));
      it('returns false for 0', () => expect(Maybe.isNothing(0)).toEqual(false));
      it('returns false for values', () => expect(Maybe.isNothing('a value')).toEqual(false));
    });

    describe('isSomething', () => {
      it('returns true for empty objects', () => expect(Maybe.isSomething({})).toEqual(true));
      it('returns true for empty arrays', () => expect(Maybe.isSomething([])).toEqual(true));
      it('returns true for empty strings', () => expect(Maybe.isSomething('')).toEqual(true));
      it('returns true for 0', () => expect(Maybe.isSomething(0)).toEqual(true));
      it('returns true for values', () => expect(Maybe.isSomething('a value')).toEqual(true));

      it('returns false for null', () => expect(Maybe.isSomething(null)).toEqual(false));
      it('returns false for undefined', () => expect(Maybe.isSomething(undefined)).toEqual(false));
    });
  });

  describe('valueOr', () => {
    it('returns content if something', () => expect(maybe(1).valueOr(2)).toEqual(1));
    it('returns default if nothing', () => expect(maybe(undefined).valueOr(2 as any)).toEqual(2));
  });

  describe('valueOrExecute', () => {
    it('returns content if something', () => expect(maybe(1).valueOrExecute(() => 2)).toEqual(1));
    it('returns value from callback if nothing', () =>
      expect(maybe(undefined).valueOrExecute(() => 2 as any)).toEqual(2));
  });

  describe('valueOrThrow', () => {
    it('returns content if something', () => expect(maybe(1).valueOrThrow()).toEqual(1));
    it('throws error if nothing', () => expect(() => maybe(undefined).valueOrThrow()).toThrow());
  });

  describe('isSomething', () => {
    it('returns true if something', () => expect(maybe(2).isSomething()).toBe(true));
    it('returns false if nothing', () => expect(maybe(undefined).isSomething()).toBe(false));
  });

  describe('isNothing', () => {
    it('returns true if nothing', () => expect(maybe(undefined).isNothing()).toBe(true));
    it('returns false if something', () => expect(maybe(2).isNothing()).toBe(false));
  });

  describe('map', () => {
    it('returns the mapped value if something', () =>
      expect(
        maybe(0)
          .map((i) => i + 1)
          .valueOrThrow(),
      ).toEqual(1));

    it('returns nothing if nothing', () =>
      expect(
        maybe(null)
          .map((i: any) => i + 1)
          .isNothing(),
      ).toBe(true));

    it('returns nothing if mapped value is nothing', () =>
      expect(
        maybe(1)
          .map(() => null)
          .isNothing(),
      ).toBe(true));
  });

  describe('tap', () => {
    let spy: jest.Mock;
    let result: any;
    const value = 'My Value';
    beforeEach(() => {
      spy = jest.fn();
      result = maybe(value).tap(spy).valueOr('Other');
    });
    it('has called callback', () => expect(spy).toHaveBeenCalledTimes(1));

    it('has called callback with current value', () => expect(spy).toHaveBeenCalledWith(value));

    it('has left value unchanged', () => expect(result).toEqual(value));
  });

  describe('mapTo', () => {
    it('returns property if value and property is something', () =>
      expect(maybe({ prop: 2 }).mapTo('prop').valueOrThrow()).toEqual(2));
    it('returns nothing if value is nothing', () =>
      expect(
        maybe<{ prop: number }>(null as any)
          .mapTo('prop')
          .isNothing(),
      ).toEqual(true));
    it('returns nothing if property is nothing', () =>
      expect(maybe({ prop: null }).mapTo('prop').isNothing()).toEqual(true));
  });

  describe('pick', () => {
    it('returns property if value and property is something', () =>
      expect(maybe({ prop: 2 }).pick('prop').valueOrThrow()).toEqual({ prop: 2 }));

    it('returns property if empty if value is nothing', () =>
      expect(maybe({ prop: undefined }).pick('prop').valueOrThrow()).toEqual({}));

    it('returns every properties present', () =>
      expect(
        maybe({ prop1: 1, prop2: 2, prop3: null }).pick('prop1', 'prop2', 'prop3').valueOrThrow(),
      ).toEqual({
        prop1: 1,
        prop2: 2,
      }));
  });

  describe('ifNothing', () => {
    let spy: jest.SpyInstance;
    beforeEach(() => (spy = jest.fn().mockReturnValue(100)));

    it('should not evoke callback', () => {
      expect(
        maybe(1)
          .ifNothing(spy as any)
          .valueOr(2),
      ).toEqual(1);
      expect(spy).not.toHaveBeenCalled();
    });
    it('should evoke callback', () => {
      expect(
        maybe(undefined)
          .ifNothing(spy as any)
          .valueOr(1),
      ).toEqual(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stringify', () => {
    it.each([
      ['', ''],
      [1, '1'],
      [true, 'true'],
      [[], '[]'],
      [{}, '{}'],
      [{ a: [] }, '{a:[]}'],
      [{ a: { b: { c: [{}, 'a', 1, []] } } }, '{a:{b:{c:[{},a,1,[]]}}}'],
    ])("should stringify value %j to '%s'", (value: any, stringifiedValue: string) => {
      expect(maybe(value).stringify().valueOrThrow()).toEqual(stringifiedValue);
    });

    it('should be nothing of value is undefined', () =>
      expect(maybe(undefined).stringify().isNothing()).toBeTruthy());
  });

  describe('flatMap', () => {
    it('returns the mapped value if something', () =>
      expect(
        maybe(0)
          .flatMap((i) => maybe(i + 1))
          .valueOrThrow(),
      ).toEqual(1));

    it('returns nothing if nothing', () =>
      expect(
        maybe(null)
          .flatMap((i: any) => maybe(i + 1))
          .isNothing(),
      ).toBe(true));

    it('returns nothing if mapped value is nothing', () =>
      expect(
        maybe(1)
          .flatMap(() => maybe(null))
          .isNothing(),
      ).toBe(true));
  });

  describe('isNothing', () => {
    it('returns true for null', () => expect(maybe(null).isNothing()).toEqual(true));
    it('returns true for undefined', () => expect(maybe(undefined).isNothing()).toEqual(true));

    it('returns false for empty objects', () => expect(maybe({}).isNothing()).toEqual(false));
    it('returns false for empty arrays', () => expect(maybe([]).isNothing()).toEqual(false));
    it('returns false for empty strings', () => expect(maybe('').isNothing()).toEqual(false));
    it('returns false for 0', () => expect(maybe(0).isNothing()).toEqual(false));
    it('returns false for values', () => expect(maybe('a value').isNothing()).toEqual(false));
  });

  describe('isSomething', () => {
    it('returns true for empty objects', () => expect(maybe({}).isSomething()).toBe(true));
    it('returns true for empty arrays', () => expect(maybe([]).isSomething()).toBe(true));
    it('returns true for empty strings', () => expect(maybe('').isSomething()).toBe(true));
    it('returns true for 0', () => expect(maybe(0).isSomething()).toBe(true));
    it('returns true for values', () => expect(maybe('a value').isSomething()).toBe(true));

    it('returns false for null', () => expect(maybe(null).isSomething()).toBe(false));
    it('returns false for undefined', () => expect(maybe(undefined).isSomething()).toBe(false));
  });

  describe('nothingUnless', () => {
    it('returns something if true', () =>
      expect(
        maybe(1)
          .nothingUnless(() => true)
          .isNothing(),
      ).toBe(false));

    it('returns nothing if false', () =>
      expect(
        maybe(1)
          .nothingUnless(() => false)
          .isNothing(),
      ).toBe(true));
  });

  describe('nothingIf', () => {
    it('returns nothing if true', () =>
      expect(
        maybe(1)
          .nothingIf(() => true)
          .isNothing(),
      ).toBe(true));

    it('returns something if false', () =>
      expect(
        maybe(1)
          .nothingIf(() => false)
          .isNothing(),
      ).toBe(false));
  });

  describe('ifTrue', () => {
    it.each([
      [true, true],
      [1, true],
      [{}, true],
      [[], true],
      [false, false],
      [0, false],
      ['', false],
    ])("of value %j should be '%s'", (value: any, expected: boolean) => {
      expect(maybe(value).ifTrue().isSomething()).toBe(expected);
    });
  });

  describe('ifFalse', () => {
    it.each([
      [true, false],
      [1, false],
      [{}, false],
      [[], false],
      [false, true],
      [0, true],
      ['', true],
    ])("of value %j should be '%s'", (value: any, expected: boolean) => {
      expect(maybe(value).ifFalse().isSomething()).toBe(expected);
    });
  });

  describe('or', () => {
    it('returns original if something', () =>
      expect(maybe(1).or(maybe(2)).valueOrThrow()).toEqual(1));

    it('returns other if nothing', () =>
      expect(
        maybe(null)
          .or(maybe(2) as any)
          .valueOrThrow(),
      ).toEqual(2));
  });

  describe('orJust', () => {
    it('returns original if something', () => expect(maybe(1).orJust(2).valueOrThrow()).toEqual(1));

    it('returns other if nothing', () =>
      expect(
        maybe(null)
          .orJust(2 as any)
          .valueOrThrow(),
      ).toEqual(2));
  });

  describe('zip', () => {
    it('returns merged values if both values are something', () =>
      expect(maybe(1).zip(maybe(2)).valueOrThrow()).toEqual([1, 2]));

    it('returns nothing if both values are nothing', () =>
      expect(maybe(null).zip(maybe(null)).isNothing()).toEqual(true));

    it('returns nothing if first value is nothing', () =>
      expect(maybe(null).zip(maybe(2)).isNothing()).toEqual(true));

    it('returns nothing if second value is nothing', () =>
      expect(maybe(1).zip(maybe(null)).isNothing()).toEqual(true));
  });
});

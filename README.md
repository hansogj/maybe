[![example workflow](https://github.com/hansogj/maybe/actions/workflows/build.yml/badge.svg)](https://github.com/hansogj/maybe/actions/workflows/build.yml/badge.svg)

# maybe

A lightweight stream-like maybe/orElse lib for optional values. `maybe(val).valueOr(other)` grant you no unexpected undefined and hence allows you to write you TS-code in a more fluid way, skipping some of those if-else nestings.

_Maybe_ also provides some useful filters and chaining into object structures ie

## Some examples

```TS
  const myObject = {
        prop: 1,
        complex: {
            sub: 'ABC',
            list: [1, 2, 3],
            subComplex: { type: 'noType', other: 21, },
        },
    };

maybe(myObject).valueOr((undefined as unknown) as typeof myObject); // => myObject
maybe(undefined as any).valueOr(myObject); // => myObject
maybe(myObject).mapTo('prop').valueOr(0); // => 1
maybe(myObject)
    .mapTo('complex')
    .map((it) => ((it.sub = 'DEF'), it))
    .mapTo('sub')
    .valueOr('null'); // => 'DEF'
maybe(myObject)
    .mapTo('complex')
    .mapTo('list')
    .map((it) => it.reduce((cur: number, next: number) => (cur += next), 0))
    .valueOr(0); // => 6
maybe(myObject)
    .mapTo('complex')
    .mapTo('subComplex')
    .mapTo('other')
    .nothingIf((it) => it === 21)
    .valueOr(0); // => 0

```

## Versioning and publishing

We strive to use a [semantic version](https://semver.org/) regime on this lib. From a clean git status do

```bash
> npm version [ major | minor | patch | premajor | preminor | prepatch | prerelease ]
> git push && git push --follow-tags
```

and then publish a new version

```bash
npm publish
```

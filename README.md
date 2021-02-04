# maybe-for-sure

A lightweight stream-like chained maybe/or else monad for typescript. `maybe(val).valueOr(other)` grant you no unexpected undefined and hence allows you to write you TS-code in a more fluid way, skipping some of those if-else nestings. 

_Maybe_ also provides some useful filters and chaining into object structures ie


Look into [test](./src/maybe.test.ts) to see  more examples and filters .
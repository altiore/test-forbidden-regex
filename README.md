# Test Forbidden regex

<a href="https://www.npmjs.com/package/test-forbidden-regex" target="_blank">
  <img src="https://img.shields.io/npm/v/test-forbidden-regex.svg" alt="NPM Version" />
</a>

## Why?
Often you want to have an agreement about projct folder structure. But agreements work worse than automated tests. This is the folder structure test helper **Test Forbidden Regex**

### Usage (with Jest):

```tsx
import { noImportsInFolder } from 'test-forbidden-regex';

describe('strict folder structure', () => {
  it(
    '@material-ui not allowed inside src/components folder',
    noImportsInFolder('components', `@material-ui`),
  );
});
```

## Instalation
#### npm
```bash
npm i test-forbidden-regex -D
```
#### yarn
```bash
yarn add test-forbidden-regex -D
```

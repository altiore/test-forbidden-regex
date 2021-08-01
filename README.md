# Strict Folder Structure

with [**test-forbidden-regex**](https://www.npmjs.com/package/test-forbidden-regex)

<a href="https://www.npmjs.com/package/test-forbidden-regex" target="_blank">
  <img src="https://img.shields.io/npm/v/test-forbidden-regex.svg" alt="NPM Version" />
</a>

## Why?

Often you wish to follow some strict folder structure.

This is the test helper [**test-forbidden-regex**](https://www.npmjs.com/package/test-forbidden-regex), which helps you follow strict folder structure

### Usage (with Jest):

```tsx
import { noImportsInFolder } from 'test-forbidden-regex';

const relativeImportStartedFromTwoDots = /import (.* from )?['"]\.\.\//gs;

describe('strict folder structure', () => {
  it(
    '@material-ui not allowed inside src/components folder',
    noImportsInFolder(`components`, [
      relativeImportStartedFromTwoDots,
      `@material-ui`,
    ]),
  );
});
```

This will throw an error, if any file inside `src/components` folder will have relative import or import from '@material-ui' library

For example:

such strings will throw an error, if [**test-forbidden-regex**](https://www.npmjs.com/package/test-forbidden-regex) will meet them inside `src/components` folder`:

```js
// 1. relativeImportStartedFromTwoDots
import OtherCompoenent from '../components/OtherComponents';

// 2. @material-ui
import { Grid } from '@material-ui/core';
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

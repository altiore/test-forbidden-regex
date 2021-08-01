# Test Forbidden regex

<a href="https://www.npmjs.com/package/test-forbidden-regex" target="_blank">
  <img src="https://img.shields.io/npm/v/test-forbidden-regex.svg" alt="NPM Version" />
</a>

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

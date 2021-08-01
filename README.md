# Test Forbidden regex

### Usage (with Jext):

```tsx
import { testForbiddenRegex } from 'test-forbidden-regex';

const getMessage = (wrongFolder: string, insideStr: string) =>
  `We could not use ${wrongFolder} inside ${insideStr}. Please, move it according to project docs`;

const forbidden = (pattern: RegExp, insideFolder: string) => {
  it(`${pattern} inside ${insideFolder}`, (done) => {
    testForbiddenRegex(
      pattern,
      ['src', insideFolder],
      getMessage(String(pattern), insideFolder),
      done,
    );
  });
};

describe('Test global import patterns', () => {
  forbidden(/@store/, '@components');
  // forbidden(/@store/, '@theme');

  forbidden(/@components/, '@store');
  // forbidden(/@components/, '@theme');

  forbidden(/@themes/, '@store');
});
```

import 'colors';

import * as fs from 'fs';
import * as path from 'path';

/* eslint-disable @typescript-eslint/no-empty-function */
const DEF_CB = () => {};

export function testForbiddenRegex(
  regularExpressions: RegExp | RegExp[],
  folderPath: string[] | string = 'src',
  errorText = 'Error',
  cb: (errors?: string | string[] | { message: string }) => void = DEF_CB,
): void {
  const basePath = process.cwd();
  const folderPathArr =
    typeof folderPath === 'string' ? [folderPath] : folderPath;
  const srcPath = path.join(basePath, ...folderPathArr);

  const errors: string[] = [];
  let counter = 0;
  const regexs = Array.isArray(regularExpressions)
    ? regularExpressions
    : [regularExpressions];

  const scanFile = (pathStr: string): Promise<string | false> => {
    return new Promise((resolve, reject) => {
      fs.readFile(pathStr, 'utf8', function (err, contents) {
        if (err) {
          reject(err);
          return;
        }
        const localErrors: string[] = [];
        regexs.forEach((regex) => {
          if (contents.match(regex)) {
            localErrors.push(
              'File file://' +
                `${pathStr}`.underline +
                ' contains ' +
                `${regex}`.red +
                '. \n' +
                `${errorText
                  .replace('$folder', folderPathArr.join('/'))
                  .replace('$file', pathStr)}`.yellow,
            );
          }
        });

        if (localErrors.length) {
          resolve(localErrors.join(`\n`));
        } else {
          resolve(false);
        }
      });
    });
  };

  const scanDirectory = (pathStr: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fs.readdir(pathStr, function (err, files) {
        if (err) {
          reject(err);
          return;
        }
        resolve(toPaths(pathStr, files));
      });
    });
  };

  const toPaths = (directory: string, files: string[]): string[] => {
    return files.map((el) => path.resolve(directory, el));
  };

  async function scanSrc(directoryPath: string) {
    const files = await scanDirectory(directoryPath);

    while (files.length) {
      const nestedPath = files.pop();

      if (fs.lstatSync(nestedPath).isDirectory()) {
        files.push(...(await scanDirectory(nestedPath)));
      } else {
        const fileExtension = path.extname(nestedPath);
        if (['.js', '.jsx', '.ts', '.tsx'].includes(fileExtension)) {
          counter++;
          const error = await scanFile(nestedPath);
          if (error) {
            errors.push(error);
          }
        }
      }
    }
  }

  scanSrc(srcPath).then(() => {
    if (errors.length) {
      const finalError =
        `\n    ${errors.length} Error${
          errors.length === 1 ? ' was' : 's where'
        } found in ${counter} scanned file${counter > 1 ? 's' : ''}:\n\n`.red +
        errors.join(`\n`);

      if (cb) {
        cb(finalError);
      } else {
        console.error(finalError);
      }

      process.exitCode = 1;
    } else {
      if (cb) {
        cb();
      } else {
        console.info(
          `    ${counter} Files was scanned. No ${regexs.join(', ')} Errors\n`
            .green,
        );
      }
    }
  });
}

const messageText = (forbiddenImport: string): string =>
  `We could not use `.yellow +
  forbiddenImport.red +
  ` inside ./$folder folder. Please, move it according to project docs`.yellow;

export const noImportsInFolder = (
  folder: string,
  pattern: RegExp | RegExp[] | string | string[],
  noSrc = false,
): ((done) => void) => {
  const folderPath = folder.split('/');
  if (folderPath[0] !== 'src' && !noSrc) {
    folderPath.unshift('src');
  }

  const patternArr: Array<string | RegExp> = Array.isArray(pattern)
    ? pattern
    : [pattern];
  const patternRegExpArr: RegExp[] = patternArr.map<RegExp>((p): RegExp => {
    if (typeof p === 'string') {
      return new RegExp(p, 'g');
    }

    return p;
  });
  return (done): void => {
    testForbiddenRegex(
      patternRegExpArr,
      folderPath,
      messageText(patternArr.map((p) => `import ... from ${p}`).join(', ')),
      done,
    );
  };
};

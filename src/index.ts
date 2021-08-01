import 'colors';

import * as fs from 'fs';
import * as path from 'path';

export function testForbiddenRegex(
  regexp: RegExp,
  folderPath: string[] | string = 'src',
  errorText: string = 'Error',
  cb: (errors?: any) => void = () => {},
) {
  const srcPath = path.join(
    process.cwd(),
    ...(typeof folderPath === 'string' ? [folderPath] : folderPath),
  );

  const errors: string[] = [];
  let counter = 0;

  const scanFile = (pathStr: string): Promise<string | false> => {
    return new Promise((resolve, reject) => {
      fs.readFile(pathStr, 'utf8', function (err, contents) {
        if (err) {
          reject(err);
          return;
        }
        if (contents.match(regexp)) {
          resolve(
            'File ' +
            `${pathStr.replace(process.cwd(), '.')}`.underline +
            ' contains ' +
            `${String(regexp)}`.red +
            '. ' +
            `${errorText}`.yellow,
          );
        } else {
          resolve(false);
        }
      });
    });
  };

  const scanDirectory = (pathStr: string): Promise<any[]> => {
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

  const toPaths = (directory: string, files: any[]) => {
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
      if (cb) {
        cb(errors);
      } else {
        errors.forEach((error) => {
          console.log('    ' + error + '\n');
        });
        console.error(
          `${errors.length} Error${
            errors.length === 1 ? ' was' : 's where'
          } found in ${counter} scanned files`.red,
        );
        process.exitCode = 1;
      }
    } else {
      if (cb) {
        cb();
      } else {
        console.info(
          `    ${counter} Files was scanned. No ${regexp} Errors\n`.green,
        );
      }
    }
  });
}

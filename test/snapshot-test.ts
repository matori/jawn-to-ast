'use strict';
import { parse } from '../src';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

/**!
 * https://github.com/textlint/textlint/blob/master/packages/%40textlint/text-to-ast/test/snapshot-test.ts
 * Licence: MIT
 */

const fixturesDir = path.join(__dirname, 'snapshots');

describe('スナップショットテスト', () => {
  fs.readdirSync(fixturesDir).map((caseName) => {
    const normalizedTestName = caseName.replace(/-/g, ' ');
    it(`${normalizedTestName}のテスト`, function() {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualFilePath = path.join(fixtureDir, 'input.txt');
      const actualContent = fs.readFileSync(actualFilePath, 'utf-8');
      const actual = parse(actualContent);
      const expectedFilePath = path.join(fixtureDir, 'output.json');
      // Usage: update snapshots
      // UPDATE_SNAPSHOT=1 npm test
      if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
        fs.writeFileSync(expectedFilePath, JSON.stringify(actual, null, 2));
        this.skip(); // skip when updating snapshots
        return;
      }
      // compare input and output
      const expected = JSON.parse(fs.readFileSync(expectedFilePath, 'utf-8'));
      assert.deepStrictEqual(
        actual,
        expected,
        `
${fixtureDir}
${JSON.stringify(actual)}
`,
      );
    });
  });
});

import { emphasisPattern, rubyPattern } from '../src/patterns';
import assert from 'assert';

describe('正規表現のテスト', function() {

  context('強調', function() {

    describe('マッチするパターン', function() {

      describe('単数', function() {
        const sample1 = 'foo《《強調》》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '《《強調》》');
          assert.strictEqual(matchedArray[0][1], '強調');
          assert.strictEqual(matchedArray[0].index, 3);
        });

        const sample2 = 'foo《《《強調》》》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '《《《強調》》');
          assert.strictEqual(matchedArray[0][1], '《強調');
          assert.strictEqual(matchedArray[0].index, 3);
        });
      });

      describe('複数', function() {
        const sample = 'foo《《強調1》》bar《《《《《《強調2》》》baz';
        it(sample, function() {
          const matched = sample.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 2);
          // first match
          assert.strictEqual(matchedArray[0][0], '《《強調1》》');
          assert.strictEqual(matchedArray[0].groups?.emphasisText, '強調1');
          assert.strictEqual(matchedArray[0].index, 3);
          // second match
          assert.strictEqual(matchedArray[1][0], '《《《《《《強調2》》');
          assert.strictEqual(matchedArray[1].groups?.emphasisText, '《《《《強調2');
          assert.strictEqual(matchedArray[1].index, 13);
        });
      });
    });

    describe('マッチしないパターン', function() {

      describe('エスケープ', function() {
        const sample1 = 'foo｜《《強調》》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });

        const sample2 = 'foo|《《強調》》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('強調対象がない', function() {
        const sample = 'foo《《》》bar';
        it(sample, function() {
          const matched = sample.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('二重山括弧が少ない', function() {
        const sample1 = 'foo《強調》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });

        const sample2 = 'foo《《強調》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });

        const sample3 = 'foo《強調》》bar';
        it(sample3, function() {
          const matched = sample3.matchAll(emphasisPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });
    });

  });

  context('ルビ', function() {

    describe('マッチするパターン', function() {

      describe('単数', function() {
        const sample1 = 'foo｜春《はる》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '｜春《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '｜春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, 'はる');
          assert.strictEqual(matchedArray[0].index, 3);
        });

        const sample2 = 'foo|春《はる》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '|春《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '|春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, 'はる');
          assert.strictEqual(matchedArray[0].index, 3);
        });
      });

      describe('複数', function() {
        const sample = 'foo｜春《はる》bar|夏《なつ》baz';
        it(sample, function() {
          const matched = sample.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 2);
          // first match
          assert.strictEqual(matchedArray[0][0], '｜春《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '｜春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, 'はる');
          assert.strictEqual(matchedArray[0].index, 3);
          // second match
          assert.strictEqual(matchedArray[1][0], '|夏《なつ》');
          assert.strictEqual(matchedArray[1].groups?.rubyBaseRaw, '|夏');
          assert.strictEqual(matchedArray[1].groups?.rubyBase, '夏');
          assert.strictEqual(matchedArray[1].groups?.rubyText, 'なつ');
          assert.strictEqual(matchedArray[1].index, 12);
        });
      });

      describe('二重山括弧が多い', function() {
        const sample1 = 'foo｜春《《はる》》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '｜春《《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '｜春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, '《はる');
          assert.strictEqual(matchedArray[0].index, 3);
        });

        const sample2 = 'foo|春《《《はる》》》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '|春《《《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '|春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, '《《はる');
          assert.strictEqual(matchedArray[0].index, 3);
        });

        const sample3 = 'foo《《|春《はる》》》bar';
        it(sample3, function() {
          const matched = sample3.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 1);
          assert.strictEqual(matchedArray[0][0], '|春《はる》');
          assert.strictEqual(matchedArray[0].groups?.rubyBaseRaw, '|春');
          assert.strictEqual(matchedArray[0].groups?.rubyBase, '春');
          assert.strictEqual(matchedArray[0].groups?.rubyText, 'はる');
          assert.strictEqual(matchedArray[0].index, 5);
        });
      });
    });

    describe('マッチしないパターン', function() {

      describe('エスケープ', function() {
        const sample1 = 'foo｜春｜《はる》bar';
        it(sample1, function() {
          const matched = sample1.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });

        const sample2 = 'foo|春|《はる》bar';
        it(sample2, function() {
          const matched = sample2.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });

        const sample3 = 'foo|春|《《はる》》bar';
        it(sample3, function() {
          const matched = sample3.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('ルビ親文字がない', function() {
        const sample = 'foo｜《はる》bar';
        it(sample, function() {
          const matched = sample.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('ルビ文字がない', function() {
        const sample = 'foo｜春《》bar';
        it(sample, function() {
          const matched = sample.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('開き二重山括弧がない', function() {
        const sample = 'foo｜春はる》bar';
        it(sample, function() {
          const matched = sample.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });

      describe('閉じ二重山括弧がない', function() {
        const sample = 'foo｜春《はるbar';
        it(sample, function() {
          const matched = sample.matchAll(rubyPattern);
          const matchedArray = [...matched];
          assert.strictEqual(matchedArray.length, 0);
        });
      });
    });

  });
});

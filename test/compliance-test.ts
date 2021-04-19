'use strict';
import { test } from '@textlint/ast-tester';
import { isTxtAST } from '@textlint/ast-tester';
import { TxtNode } from '@textlint/ast-node-types';
import assert from 'assert';
import { parse, Syntax } from '../src';

describe('コンプライアンスのテスト', function() {
  it('正規のASTであるか', function() {
    const AST = parse('《《こんにちは》》｜世界《せかい》。');
    test(AST);
    assert(isTxtAST(AST));
  });

  it('連続しない最後の改行の数は合っているか', function() {
    const AST = parse('テキスト\n');
    const lastBreaksCount = getLastBreaksCount(AST);
    assert(lastBreaksCount === 1);
  });

  it('連続する最後の改行の数は合っているか LF', function() {
    const AST = parse('テキスト\n\n\n');
    const lastBreaksCount = getLastBreaksCount(AST);
    assert(lastBreaksCount === 3);
  });

  it('連続する最後の改行の数は合っているか CRLF', function() {
    const AST = parse('テキスト\r\n\r\n\r\n');
    const lastBreaksCount = getLastBreaksCount(AST);
    assert(lastBreaksCount === 3);
  });

  describe('構文どおりにパースされているか', function() {
    it('パラグラフ', function() {
      const AST = parse('こんにちは');
      assert(AST.children[0].type === Syntax.Paragraph);
    });

    it('強調', function() {
      const AST = parse('《《こんにちは》》');
      assert(AST.children[0].type === Syntax.Paragraph);
      assert(AST.children[0].children[0].type === Syntax.Emphasis);
    });

    it('ルビ', function() {
      const AST = parse('｜世界《せかい》');
      assert(AST.children[0].type === Syntax.Paragraph);
      assert(AST.children[0].children[0].type === Syntax.Ruby);
      assert(AST.children[0].children[0].children[0].type === Syntax.RubyBase);
      assert(AST.children[0].children[0].children[1].type === Syntax.RubyParenthesis);
      assert(AST.children[0].children[0].children[2].type === Syntax.RubyText);
      assert(AST.children[0].children[0].children[3].type === Syntax.RubyParenthesis);
    });

    it('強調内のルビ', function() {
      const AST = parse('《《｜世界《せかい》》》');
      assert(AST.children[0].type === Syntax.Paragraph);
      assert(AST.children[0].children[0].type === Syntax.Emphasis);
      assert(AST.children[0].children[0].children[0].type === Syntax.Ruby);
      assert(AST.children[0].children[0].children[0].children[0].type === Syntax.RubyBase);
      assert(AST.children[0].children[0].children[0].children[1].type === Syntax.RubyParenthesis);
      assert(AST.children[0].children[0].children[0].children[2].type === Syntax.RubyText);
      assert(AST.children[0].children[0].children[0].children[3].type === Syntax.RubyParenthesis);
    });
  });
});

function getLastBreaksCount(AST: TxtNode): number {
  return AST.children.reduceRight((acc: number, node: TxtNode) => {
    if (node.type === Syntax.Break) {
      acc = acc + 1;
    }
    return acc;
  }, 0);
}

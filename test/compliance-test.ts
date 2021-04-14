'use strict';
import { test } from '@textlint/ast-tester';
import { isTxtAST } from '@textlint/ast-tester';
import assert from 'assert';
import { parse, Syntax } from '../src';

describe('コンプライアンスのテスト', function() {
  it('正規のASTであるか', function() {
    const AST = parse('《《こんにちは》》｜世界《せかい》。');
    test(AST);
    assert(isTxtAST(AST));
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

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
});

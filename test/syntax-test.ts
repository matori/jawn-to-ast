import assert from 'assert';
import { TxtNode } from '@textlint/ast-node-types';
import { parse, Syntax } from '../src';

function getLastBreaksCount(AST: TxtNode): number {
  return AST.children.reduceRight((acc: number, node: TxtNode) => {
    if (node.type === Syntax.Break) {
      acc = acc + 1;
    }
    return acc;
  }, 0);
}

describe('ファイル最後の改行のテスト', function() {
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
});

describe('構文どおりにパースされているか', function() {
  it('パラグラフ', function() {
    const AST = parse('こんにちは');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 1);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].type === Syntax.Str);
  });

  it('強調', function() {
    const AST = parse('《《こんにちは》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children.length === 1);
    assert(AST.children[0].children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].children[0].value === 'こんにちは');
  });

  it('強調（強調の前にテキストあり）', function() {
    const AST = parse('abc《《こんにちは》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 2);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === 'abc');
    assert(AST.children[0].children[1].type === Syntax.Emphasis);
    assert(AST.children[0].children[1].children[0].type === Syntax.Str);
    assert(AST.children[0].children[1].children[0].value === 'こんにちは');
  });

  it('強調（強調の後にテキストあり）', function() {
    const AST = parse('《《こんにちは》》xyz');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 2);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].children[0].value === 'こんにちは');
    assert(AST.children[0].children[1].type === Syntax.Str);
    assert(AST.children[0].children[1].value === 'xyz');
  });

  it('強調（強調の前後にテキストあり）', function() {
    const AST = parse('abc《《こんにちは》》xyz');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 3);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === 'abc');
    assert(AST.children[0].children[1].type === Syntax.Emphasis);
    assert(AST.children[0].children[1].children[0].type === Syntax.Str);
    assert(AST.children[0].children[1].children[0].value === 'こんにちは');
    assert(AST.children[0].children[2].type === Syntax.Str);
    assert(AST.children[0].children[2].value === 'xyz');
  });

  it('ルビ', function() {
    const AST = parse('｜世界《せかい》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children.length === 4);
    assert(AST.children[0].children[0].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[3].type === Syntax.RubyParenthesis);
  });

  it('ルビ（ルビの前にテキストあり）', function() {
    const AST = parse('abc｜世界《せかい》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 2);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === 'abc');
    assert(AST.children[0].children[1].type === Syntax.Ruby);
    assert(AST.children[0].children[1].children.length === 4);
    assert(AST.children[0].children[1].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[1].children[0].children[0].value === '世界');
    assert(AST.children[0].children[1].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[1].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[1].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[1].children[3].type === Syntax.RubyParenthesis);
  });

  it('ルビ（ルビの後にテキストあり）', function() {
    const AST = parse('｜世界《せかい》xyz');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 2);
    assert(AST.children[0].children[0].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children.length === 4);
    assert(AST.children[0].children[0].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[3].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[1].type === Syntax.Str);
    assert(AST.children[0].children[1].value === 'xyz');
  });

  it('ルビ（ルビの前後にテキストあり）', function() {
    const AST = parse('abc｜世界《せかい》xyz');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 3);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === 'abc');
    assert(AST.children[0].children[1].type === Syntax.Ruby);
    assert(AST.children[0].children[1].children.length === 4);
    assert(AST.children[0].children[1].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[1].children[0].children[0].value === '世界');
    assert(AST.children[0].children[1].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[1].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[1].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[1].children[3].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[2].type === Syntax.Str);
    assert(AST.children[0].children[2].value === 'xyz');
  });

  it('強調内のルビ（ルビのみ）', function() {
    const AST = parse('《《｜世界《せかい》》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children.length === 1);
    assert(AST.children[0].children[0].children[0].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children[0].children.length === 4);
    assert(AST.children[0].children[0].children[0].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[0].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[0].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[0].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[0].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[0].children[3].type === Syntax.RubyParenthesis);
  });

  it('強調内のルビ（ルビの前にテキストあり）', function() {
    const AST = parse('《《abc｜世界《せかい》》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children.length === 2);
    assert(AST.children[0].children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].children[0].value === 'abc');
    assert(AST.children[0].children[0].children[1].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children[1].children.length === 4);
    assert(AST.children[0].children[0].children[1].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[1].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[1].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[1].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[1].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[1].children[3].type === Syntax.RubyParenthesis);
  });

  it('強調内のルビ（ルビの後にテキストあり）', function() {
    const AST = parse('《《｜世界《せかい》xyz》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children.length === 2);
    assert(AST.children[0].children[0].children[0].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children[0].children.length === 4);
    assert(AST.children[0].children[0].children[0].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[0].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[0].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[0].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[0].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[0].children[3].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[1].type === Syntax.Str);
    assert(AST.children[0].children[0].children[1].value === 'xyz');
  });

  it('強調内のルビ（ルビの前後にテキストあり）', function() {
    const AST = parse('《《abc｜世界《せかい》xyz》》');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children[0].type === Syntax.Emphasis);
    assert(AST.children[0].children[0].children.length === 3);
    assert(AST.children[0].children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].children[0].value === 'abc');
    assert(AST.children[0].children[0].children[1].type === Syntax.Ruby);
    assert(AST.children[0].children[0].children[1].children.length === 4);
    assert(AST.children[0].children[0].children[1].children[0].type === Syntax.RubyBase);
    assert(AST.children[0].children[0].children[1].children[0].children[0].value === '世界');
    assert(AST.children[0].children[0].children[1].children[1].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[1].children[2].type === Syntax.RubyText);
    assert(AST.children[0].children[0].children[1].children[2].children[0].value === 'せかい');
    assert(AST.children[0].children[0].children[1].children[3].type === Syntax.RubyParenthesis);
    assert(AST.children[0].children[0].children[2].type === Syntax.Str);
    assert(AST.children[0].children[0].children[2].value === 'xyz');
  });

  it('コメントだけの行', function() {
    const AST = parse('// コメント');
    assert(AST.children[0].type === Syntax.Comment);
    assert(AST.children[0].children === undefined);
    assert(AST.children[0].value === 'コメント');
  });

  it('行末にあるコメント', function() {
    const AST = parse('行末。 // コメント');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 2);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === '行末。');
    assert(AST.children[0].children[0].loc.start.column === 0);
    assert(AST.children[0].children[0].loc.end.column === 3);
    assert(AST.children[0].children[1].type === Syntax.Comment);
    assert(AST.children[0].children[1].value === 'コメント');
    assert(AST.children[0].children[1].loc.start.column === 3);
    assert(AST.children[0].children[1].loc.end.column === 11);
  });

  it('エスケープされたコメント', function() {
    const AST = parse('|// コメント');
    assert(AST.children[0].type === Syntax.Paragraph);
    assert(AST.children[0].children.length === 1);
    assert(AST.children[0].children[0].type === Syntax.Str);
    assert(AST.children[0].children[0].value === '// コメント');
  });
});

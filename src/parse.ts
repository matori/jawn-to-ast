'use strict';
import { parse as textParse } from '@textlint/text-to-ast';
import { TxtNode } from '@textlint/ast-node-types';
import StructuredSource from 'structured-source';
import { Syntax } from './syntax';
import { transform } from './transform';
import { createBrNode } from './createNode';

// パーサー
export function parse(text: string): TxtNode {
  const AST: TxtNode = textParse(text);

  // 内容が空のデータに対しては何もしないで返す
  if (AST.loc.end.line === 1 && AST.loc.end.column === 0) {
    return AST;
  }

  // text-to-astで最後に改行が連続しているときに改行の数が1つ少ないっぽいので
  // 1. 最後に改行が連続しているかチェック
  // 2. 連続していたらBrノードを作って追加
  // という処理をする
  const lastBreaksMatch = /(?:\r\n|\n){2,}$/.exec(AST.raw);

  if (lastBreaksMatch && lastBreaksMatch[0]) {
    const childrenLength = AST.children.length;
    const lastBrNode = AST.children[childrenLength - 1];
    const lastBreaks = lastBreaksMatch[0].match(/\r?\n/g);

    if (lastBreaks && lastBreaks.length) {
      let ASTLastBreaks = 0;
      let i = childrenLength;
      while (i--) {
        if (AST.children[i].type === Syntax.Break) {
          ASTLastBreaks = ASTLastBreaks + 1;
        } else {
          break;
        }
      }

      // 1個足りないはずなので+1する
      if (ASTLastBreaks + 1 === lastBreaks.length) {
        const node = createBrNode(lastBrNode.loc.end.line + 1, lastBrNode.range[1]);
        AST.children.push(node);
      }
    }
  }

  const structured: StructuredSource = new StructuredSource(AST.raw);
  AST.children = AST.children.map((node: TxtNode): TxtNode => {
    // パラグラフ以外はスキップ
    if (node.type !== Syntax.Paragraph) {
      return node;
    }
    return transform(node, structured);
  });

  return AST;
}


'use strict';
import { parse as textParse } from '@textlint/text-to-ast';
import { TxtNode } from '@textlint/ast-node-types';
import StructuredSource from 'structured-source';
import { Syntax } from './syntax';
import { transform } from './transform';

// パーサー
export function parse(text: string): TxtNode {
  const AST: TxtNode = textParse(text);

  // 内容が空のデータに対しては何もしないで返す
  if (AST.loc.end.line === 1 && AST.loc.end.column === 0) {
    return AST;
  }

  const structured: StructuredSource = new StructuredSource(AST.raw);
  AST.children = AST.children.map((node: TxtNode): TxtNode => {
    // パラグラフ以外はスキップ
    if (node.type !== Syntax.Paragraph) {
      return node;
    }
    transform(node, structured);
    return node;
  });

  return AST;
}



'use strict';
import { TxtNode, TxtTextNode } from '@textlint/ast-node-types';
import StructuredSource from 'structured-source';
import { commentPattern, emphasisPattern, rubyPattern } from './patterns';
import { RUBY_TEXT_SYMBOL_ALT_START, RUBY_TEXT_SYMBOL_ALT_END } from './constants';
import { createEmphasisNode, createRubyNode, createStrNode } from './createNode';
import { Syntax } from './syntax';

export function transform(node: TxtNode, structured: StructuredSource): TxtNode {
  const {children} = node;
  const children0 = children[0];

  if (children.length !== 1 || children0.type !== Syntax.Str) {
    return node;
  }

  const newChildren = [];
  const strRaw = children0.raw;
  const commentMatched = strRaw.match(commentPattern);
  if (commentMatched) {
    const {index} = commentMatched;
    const commentRaw = commentMatched.groups?.commentRaw || commentMatched[1];
    const commentText = (commentMatched.groups?.commentText || commentMatched[2]).trim();
    if (index === 0) {
      return {
        type: Syntax.Comment,
        raw: commentRaw,
        value: commentText,
        range: node.range,
        loc: node.loc,
      };
    }
    const strNode = createStrNode({
      src: structured,
      raw: strRaw.slice(0, index),
      lineNumber: children0.loc.start.line,
      start: children0.loc.start.column,
      end: index,
    });
    const commentNode = {
      type: Syntax.Comment,
      raw: commentRaw,
      value: commentText,
      range: [
        children0.range[0] + index,
        children0.range[1],
      ],
      loc: {
        start: {
          line: children0.loc.start.line,
          column: children0.loc.start.column + index,
        },
        end: {
          line: children0.loc.end.line,
          column: children0.loc.end.column,
        },
      },
    };
    newChildren.push(strNode);
    newChildren.push(commentNode);
  } else {
    newChildren.push(children0);
  }

  const emphasisReducer = transformEmphasisReducer.bind(null, node, structured);
  const rubyReducer = transformRubyReducer.bind(null, node, structured);

  const emphasisTransformed = newChildren.reduce(emphasisReducer, []);
  const rubyTransformed = emphasisTransformed.reduce(rubyReducer, []);

  node.children = rubyTransformed;
  return node;
}

function isStrNode(node: TxtNode): boolean {
  return node.type === Syntax.Str;
}

function transformEmphasisReducer(
  node: TxtNode,
  structured: StructuredSource,
  accumulator: Array<TxtNode | TxtTextNode>,
  currentNode: TxtNode | TxtTextNode,
) {

  // 文字列ノードじゃなかったらそのまま返す
  if (!isStrNode(currentNode)) {
    accumulator.push(currentNode);
    return accumulator;
  }

  // 《《｜親文字《ルビ》》》 形式に対応するため、ルビ構文を別の文字に置き換えてから強調構文をパースする
  const text = currentNode.raw.replace(rubyPattern, `$1${RUBY_TEXT_SYMBOL_ALT_START}$3${RUBY_TEXT_SYMBOL_ALT_END}`);

  const matched: IterableIterator<RegExpMatchArray> = text.matchAll(emphasisPattern);
  const matchedResult: RegExpMatchArray[] = [...matched];
  const matchedLength: number = matchedResult.length;

  // マッチしなかったらそのまま返す
  if (!matchedLength) {
    accumulator.push(currentNode);
    return accumulator;
  }

  // emphasisノードを作ってくっつける
  const emphasisNodes = createEmphasisNodes({
    node,
    structured,
    currentNode,
    matchedEmphasisResult: matchedResult,
    matchedLength,
  });
  accumulator.push(...emphasisNodes);

  return accumulator;
}

function transformRubyReducer(
  node: TxtNode,
  structured: StructuredSource,
  accumulator: Array<TxtNode | TxtTextNode>,
  currentNode: TxtNode | TxtTextNode,
): Array<TxtNode | TxtTextNode> {

  // Emphasisノードだったら再帰で文字列ノードを変換
  if (currentNode.type === Syntax.Emphasis) {
    const reducer = transformRubyReducer.bind(null, currentNode, structured);
    currentNode.children = currentNode.children.reduce(reducer, []);
  }

  // 文字列ノードじゃなかったらそのまま返す
  if (!isStrNode(currentNode)) {
    accumulator.push(currentNode);
    return accumulator;
  }

  const matched: IterableIterator<RegExpMatchArray> = currentNode.raw.matchAll(rubyPattern);
  const matchedResult: RegExpMatchArray[] = [...matched];
  const matchedLength: number = matchedResult.length;

  // マッチしなかったら文字列ノードを作り直して返す
  if (!matchedLength) {
    const textNode = createStrNode({
      src: structured,
      raw: currentNode.raw,
      lineNumber: currentNode.loc.start.line,
      start: currentNode.loc.start.column,
      end: currentNode.loc.end.column,
    });
    accumulator.push(textNode);
    return accumulator;
  }

  // rubyノードを作ってくっつける
  const rubyNodes = createRubyNodes({
    node,
    structured,
    currentNode,
    matchedRubyResult: matchedResult,
    matchedLength,
  });
  accumulator.push(...rubyNodes);

  return accumulator;
}

interface createEmphasisNodesArgs {
  node: TxtNode,
  structured: StructuredSource,
  currentNode: TxtNode | TxtTextNode,
  matchedEmphasisResult: RegExpMatchArray[],
  matchedLength: number
}

function createEmphasisNodes(args: createEmphasisNodesArgs): Array<TxtNode | TxtTextNode> {
  const {
    node,
    structured,
    currentNode,
    matchedEmphasisResult,
    matchedLength,
  } = args;

  const lineNumber = node.loc.start.line;
  const endColumn = node.loc.end.column;
  const result: Array<TxtNode | TxtTextNode> = [];

  let lastMatchedIndex: number = 0;
  matchedEmphasisResult.forEach((matched: RegExpMatchArray, index: number): void => {
    if (typeof matched.index !== 'number') {
      return;
    }

    const matchedIndex = matched.index;
    const matchedStringLength = matched[0].length;

    // マッチした場所が2文字目以降（indexが1以上）の場合、その前の文字列のStrノード作成する
    if (matchedIndex > 0) {
      const leadingText = currentNode.raw.slice(lastMatchedIndex, matchedIndex);
      const textNode = createStrNode({
        src: structured,
        raw: leadingText,
        lineNumber,
        start: 0,
        end: matchedIndex,
      });
      result.push(textNode);
      lastMatchedIndex = matchedIndex;
    }

    // Emphasisノードを作る
    const emphasisNode = createEmphasisNode({
      src: structured,
      raw: currentNode.raw.slice(matchedIndex, matchedIndex + matchedStringLength),
      lineNumber,
      start: matchedIndex,
      length: matchedStringLength,
    });
    result.push(emphasisNode);
    lastMatchedIndex = matchedIndex + matchedStringLength;

    // 最後にマッチしたものであり、かつ、最終文字列でない場合、
    // 最後にマッチしたものの後から最終文字までのStrノードを作成する
    if (index === matchedLength - 1 && lastMatchedIndex < endColumn) {
      const endText = currentNode.raw.slice(lastMatchedIndex, endColumn);
      const textNode = createStrNode({
        src: structured,
        raw: endText,
        lineNumber,
        start: lastMatchedIndex,
        end: lastMatchedIndex + endText.length,
      });
      result.push(textNode);
    }
  });

  return result;
}

interface createRubyNodesArgs {
  node: TxtNode,
  structured: StructuredSource,
  currentNode: TxtNode | TxtTextNode,
  matchedRubyResult: RegExpMatchArray[],
  matchedLength: number
}

function createRubyNodes(args: createRubyNodesArgs): Array<TxtNode | TxtTextNode> {
  const {
    node,
    structured,
    currentNode,
    matchedRubyResult,
    matchedLength,
  } = args;

  const lineNumber = node.loc.start.line;
  const startColumn = currentNode.loc.start.column;
  const endColumn = currentNode.loc.end.column;
  const result: Array<TxtNode | TxtTextNode> = [];

  let lastMatchedIndex: number = 0;
  matchedRubyResult.forEach((matched: RegExpMatchArray, index: number) => {
    if (typeof matched.index !== 'number') {
      return;
    }

    const matchedIndex = matched.index;
    const matchedStringLength = matched[0].length;

    // マッチした場所が2文字目以降（indexが1以上）の場合、その前の文字列のStrノード作成する
    if (matchedIndex > 0) {
      const leadingText = currentNode.raw.slice(lastMatchedIndex, matchedIndex);
      const textNode = createStrNode({
        src: structured,
        raw: leadingText,
        lineNumber,
        start: startColumn,
        end: startColumn + matchedIndex,
      });
      result.push(textNode);
      lastMatchedIndex = matchedIndex;
    }

    // rubyノードを作る
    const rubyNode = createRubyNode({
      src: structured,
      matched,
      lineNumber,
      start: startColumn + lastMatchedIndex,
      length: matchedStringLength,
    });
    result.push(rubyNode);
    lastMatchedIndex = matchedIndex + matchedStringLength;

    // 最後にマッチしたものであり、かつ、最終文字列でない場合、
    // 最後にマッチしたものの後から最終文字までのStrノードを作成する
    const lastMatchedColumn = startColumn + lastMatchedIndex;
    if (index === matchedLength - 1 && lastMatchedColumn < endColumn) {
      const endText = currentNode.raw.slice(lastMatchedIndex);
      const textNode = createStrNode({
        src: structured,
        raw: endText,
        lineNumber,
        start: lastMatchedColumn,
        end: lastMatchedColumn + endText.length,
      });
      result.push(textNode);
    }
  });

  return result;
}

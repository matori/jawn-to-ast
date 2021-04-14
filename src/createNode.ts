'use strict';
import { TextNodeRange, TxtNode, TxtNodeLineLocation, TxtTextNode } from '@textlint/ast-node-types';
import StructuredSource from 'structured-source';
import { Syntax } from './syntax';
import {
  EMPHASIS_SYMBOL_START,
  EMPHASIS_SYMBOL_END,
  RUBY_BASE_SYMBOL_START,
  RUBY_TEXT_SYMBOL_START,
  RUBY_TEXT_SYMBOL_END,
  ESCAPE_CHARS,
} from './constants';

function createLocation(line: number, columnStart: number, columnEnd: number): TxtNodeLineLocation {
  return {
    start: {
      line,
      column: columnStart,
    },
    end: {
      line,
      column: columnEnd,
    },
  };
}

interface createStrNodeArgs {
  src: StructuredSource,
  raw: string,
  lineNumber: number,
  start: number,
  end: number,
}

export function createStrNode(args: createStrNodeArgs): TxtTextNode {
  const {
    src,
    raw,
    lineNumber,
    start,
    end,
  } = args;
  const loc = createLocation(lineNumber, start, end);
  const range: TextNodeRange = src.locationToRange(loc);
  const escapeChars = ESCAPE_CHARS.join('');
  const regexp = new RegExp(`[${escapeChars}]${RUBY_TEXT_SYMBOL_START}`, 'g');
  const value = raw.replace(regexp, RUBY_TEXT_SYMBOL_START);

  return {
    type: Syntax.Str,
    raw,
    value,
    loc,
    range,
  };
}

interface createEmphasisNodeArgs {
  src: StructuredSource,
  raw: string,
  lineNumber: number,
  start: number,
  length: number,
}

export function createEmphasisNode(args: createEmphasisNodeArgs): TxtNode {
  const {
    src,
    raw,
    lineNumber,
    start,
    length,
  } = args;

  const loc = createLocation(lineNumber, start, start + length);
  const range: TextNodeRange = src.locationToRange(loc);
  const strRaw = raw.slice(EMPHASIS_SYMBOL_START.length, -EMPHASIS_SYMBOL_END.length);
  const strRawStart: number = start + EMPHASIS_SYMBOL_START.length;

  const children: TxtTextNode[] = [
    createStrNode({
      src,
      raw: strRaw,
      lineNumber,
      start: strRawStart,
      end: strRawStart + strRaw.length,
    }),
  ];

  return {
    type: Syntax.Emphasis,
    raw,
    loc,
    range,
    children,
  };
}

interface createRubyNodeArgs {
  src: StructuredSource,
  matched: RegExpMatchArray,
  lineNumber: number,
  start: number,
  length: number,
}

export function createRubyNode(args: createRubyNodeArgs): TxtNode {
  const {
    src,
    matched,
    lineNumber,
    start,
    length,
  } = args;

  const loc = createLocation(lineNumber, start, start + length);
  const range: TextNodeRange = src.locationToRange(loc);

  const rubyBaseRaw = matched.groups?.rubyBaseRaw || matched[1];
  const rubyBase = matched.groups?.rubyBase || matched[2];
  const rubyBaseRawLength = rubyBaseRaw.length;

  const rubyText = matched.groups?.rubyText || matched[3];
  const rubyTextRawStart = start + rubyBaseRawLength;
  const rubyTextLength = rubyText.length;

  const rubyTextSymbolStartLength = RUBY_TEXT_SYMBOL_START.length
  const rubyTextSymbolEndLength = RUBY_TEXT_SYMBOL_END.length

  const children: TxtNode[] = [
    createRubyChildNode({
      src,
      raw: rubyBaseRaw,
      lineNumber,
      start,
      length: rubyBaseRawLength,
      type: Syntax.RubyBase,
      text: rubyBase,
      strStart: start + RUBY_BASE_SYMBOL_START.length,
    }),
    createRubyChildNode({
      src,
      raw: RUBY_TEXT_SYMBOL_START,
      lineNumber,
      start: rubyTextRawStart,
      length: rubyTextSymbolStartLength,
      type: Syntax.RubyParenthesis,
    }),
    createRubyChildNode({
      src,
      raw: rubyText,
      lineNumber,
      start: rubyTextRawStart + rubyTextSymbolStartLength,
      length: rubyTextLength,
      type: Syntax.RubyText,
    }),
    createRubyChildNode({
      src,
      raw: RUBY_TEXT_SYMBOL_END,
      lineNumber,
      start: rubyTextRawStart + rubyTextSymbolStartLength + rubyTextLength,
      length: rubyTextSymbolEndLength,
      type: Syntax.RubyParenthesis,
    }),
  ];

  return {
    type: Syntax.Ruby,
    raw: matched[0],
    loc,
    range,
    children,
  };
}

interface createRubyChildNodeArgs {
  src: StructuredSource,
  raw: string,
  lineNumber: number,
  start: number,
  length: number,
  type: string,
  text?: string,
  strStart?: number,
}

function createRubyChildNode(args: createRubyChildNodeArgs): TxtNode {
  const {
    src,
    raw,
    lineNumber,
    start,
    length,
    type,
    text,
    strStart,
  } = args;

  const loc = createLocation(lineNumber, start, start + length);
  const range = src.locationToRange(loc);
  const strRaw = text || raw;
  const strStartPos = strStart || start;
  const strEnd = strStartPos + strRaw.length;

  return {
    type,
    raw,
    loc,
    range,
    children: [
      createStrNode({
        src,
        raw: strRaw,
        lineNumber,
        start: strStartPos,
        end: strEnd,
      }),
    ],
  };
}

'use strict';

import {
  EMPHASIS_SYMBOL_START,
  EMPHASIS_SYMBOL_END,
  RUBY_BASE_SYMBOL_START_CHARS,
  RUBY_TEXT_SYMBOL_START,
  RUBY_TEXT_SYMBOL_END,
  ESCAPE_CHARS,
} from './constants';

const escapeChars = ESCAPE_CHARS.join('');
const rubyBaseStartChars = RUBY_BASE_SYMBOL_START_CHARS.join('');

const emphasisPatternBase = [
  `(?<![${escapeChars}])`,
  EMPHASIS_SYMBOL_START,
  '(?<emphasisText>(.+?))',
  EMPHASIS_SYMBOL_END,
].join('');

const rubyPatternBase = [
  `(?<rubyBaseRaw>[${rubyBaseStartChars}](?<rubyBase>[^${escapeChars}]+?))`,
  `(?<!${RUBY_TEXT_SYMBOL_START})`,
  RUBY_TEXT_SYMBOL_START,
  `(?<rubyText>.+?)`,
  RUBY_TEXT_SYMBOL_END,
].join('');

// `《《強調》》` にマッチする
// /(?<![|｜])《《(?<emphasisText>.+?)》》/g
export const emphasisPattern = new RegExp(emphasisPatternBase, 'g');

// `｜親文字《ルビ文字》` または `|親文字《ルビ文字》` にマッチする
// /(?<rubyBaseRaw>[|｜](?<rubyBase>[^|｜]+?))(?<rubyTextRaw>(?<!《)《(?<rubyText>.+?)》)/g
export const rubyPattern = new RegExp(rubyPatternBase, 'g');

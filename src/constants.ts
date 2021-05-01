'use strict';

// 強調
export const EMPHASIS_SYMBOL_START = '《《';
export const EMPHASIS_SYMBOL_END = '》》';

// ルビ親文字
export const RUBY_BASE_SYMBOL_START = '｜';
export const RUBY_BASE_SYMBOL_START_CHARS = ['|', '｜'];

// ルビテキスト
export const RUBY_TEXT_SYMBOL_START = '《';
export const RUBY_TEXT_SYMBOL_END = '》';

// 強調の中にルビがあるパターンに対応するための、ルビテキスト用置き換え文字
// ex. 《《｜春《はる》》》
// Unicode 私用領域を使う
export const RUBY_TEXT_SYMBOL_ALT_START = '\uF400';
export const RUBY_TEXT_SYMBOL_ALT_END = '\uF401';

// コメント用
export const COMMENT_TEXT_SYMBOL_START = '//';
export const COMMENT_TEXT_SYMBOL_ESCAPE_TARGET = '/';

// エスケープ用の文字
export const ESCAPE_CHARS = ['|', '｜'];

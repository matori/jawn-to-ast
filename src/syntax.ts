'use strict';
import { ASTNodeTypes } from '@textlint/ast-node-types';

export const Syntax = {
  Document: ASTNodeTypes.Document,
  Paragraph: ASTNodeTypes.Paragraph,
  // Inline
  Str: ASTNodeTypes.Str,
  Break: ASTNodeTypes.Break,
  // Inline Emphasis
  Emphasis: ASTNodeTypes.Emphasis,
  // Inline Ruby
  Ruby: 'Ruby',
  RubyBase: 'RubyBase',
  RubyParenthesis: 'RubyParenthesis',
  RubyText: 'RubyText',
};


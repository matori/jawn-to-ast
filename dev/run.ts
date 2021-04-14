import { parse } from '../src';

const input = `序云FSです。《《こんにちは》》｜世界《せかい》。`;

const AST = parse(input);

const json = JSON.stringify(AST, null, 2);

console.log(json);

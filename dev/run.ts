import { parse } from '../src';

const input = `JAWN-FSです。《《こんにちは》》｜世界《せかい》。`;

const AST = parse(input);

const json = JSON.stringify(AST, null, 2);

console.log(json);

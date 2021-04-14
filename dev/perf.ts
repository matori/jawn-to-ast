import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { parse } from '../src';

const textLengthMin = 100000;
const runCount = 100;

const filePath = path.resolve('test/snapshots/complex-text/input.txt');
const content = fs.readFileSync(filePath, 'utf-8');

const contentChars = [...content];
let inputText: string[] = [];

while (inputText.length < textLengthMin) {
  inputText = inputText.concat(contentChars);
}

console.log(`[jawn-to-ast performance check]`);
console.log(`入力文字数: ${inputText.length}`);
console.log(`実行回数: ${runCount}`);
console.log(`-------------------------------`);

const input = inputText.join('');
const results = [];

let i = 0;
for (; i < runCount; i++) {
  const result = run();
  results.push(result);
}

const average = getAverage(results);
const min = getMin(results);
const max = getMax(results);

console.log(`平均: ${average} ms`);
console.log(`\u001b[32m` + `最速: ${min} ms` + `\u001b[0m`);
console.log(`\u001b[31m` + `最遅: ${max} ms` + `\u001b[0m`);

function run() {
  const start = performance.now();
  parse(input);
  const end = performance.now();
  return end - start;
}

function getAverage(results: any): number {
  let sum = 0;
  let i = 0;
  const len = results.length;
  for (; i < len; i++) {
    sum = sum + results[i];
  }
  return sum / len;
}

function getMin(results: number[]) {
  return results.reduce(function(a: number, b: number) {
    return Math.min(a, b);
  });
}

function getMax(results: number[]) {
  return results.reduce(function(a: number, b: number) {
    return Math.max(a, b);
  });
}


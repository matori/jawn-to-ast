# jawn-to-ast

日本のウェブ小説サービスへマルチポストするための基礎構文「[JAWN-FS](https://github.com/matori/jawn-fs)」を、[textlint](https://github.com/textlint/textlint)互換のASTに変換するライブラリです。

## インストール

```
npm install jawn-to-ast
```

## 使い方

```javascript
const { parse } = require('jawn-to-ast');
// ES Module
// import { parse } from 'jawn-to-ast';

const text = 'This is text';
const AST = parse(text);
```

## 例

```javascript
const { parse } = require('jawn-to-ast');

const text = 'JAWN-FSです。《《こんにちは》》｜世界《せかい》。';
const AST = parse(text);

// ASTをJSONにして出力
console.log(JSON.stringify(AST, null, 2));
```
<details>
  <summary>出力結果</summary>

```json
{
  "type": "Document",
  "raw": "JAWN-FSです。《《こんにちは》》｜世界《せかい》。",
  "range": [
    0,
    28
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 28
    }
  },
  "children": [
    {
      "type": "Paragraph",
      "raw": "JAWN-FSです。《《こんにちは》》｜世界《せかい》。",
      "range": [
        0,
        28
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 28
        }
      },
      "children": [
        {
          "type": "Str",
          "raw": "JAWN-FSです。",
          "value": "JAWN-FSです。",
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 10
            }
          },
          "range": [
            0,
            10
          ]
        },
        {
          "type": "Emphasis",
          "raw": "《《こんにちは》》",
          "loc": {
            "start": {
              "line": 1,
              "column": 10
            },
            "end": {
              "line": 1,
              "column": 19
            }
          },
          "range": [
            10,
            19
          ],
          "children": [
            {
              "type": "Str",
              "raw": "こんにちは",
              "value": "こんにちは",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 12
                },
                "end": {
                  "line": 1,
                  "column": 17
                }
              },
              "range": [
                12,
                17
              ]
            }
          ]
        },
        {
          "type": "Ruby",
          "raw": "｜世界《せかい》",
          "loc": {
            "start": {
              "line": 1,
              "column": 19
            },
            "end": {
              "line": 1,
              "column": 27
            }
          },
          "range": [
            19,
            27
          ],
          "children": [
            {
              "type": "RubyBase",
              "raw": "｜世界",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 19
                },
                "end": {
                  "line": 1,
                  "column": 22
                }
              },
              "range": [
                19,
                22
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "世界",
                  "value": "世界",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 20
                    },
                    "end": {
                      "line": 1,
                      "column": 22
                    }
                  },
                  "range": [
                    20,
                    22
                  ]
                }
              ]
            },
            {
              "type": "RubyParenthesis",
              "raw": "《",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 22
                },
                "end": {
                  "line": 1,
                  "column": 23
                }
              },
              "range": [
                22,
                23
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "《",
                  "value": "《",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 22
                    },
                    "end": {
                      "line": 1,
                      "column": 23
                    }
                  },
                  "range": [
                    22,
                    23
                  ]
                }
              ]
            },
            {
              "type": "RubyText",
              "raw": "せかい",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 23
                },
                "end": {
                  "line": 1,
                  "column": 26
                }
              },
              "range": [
                23,
                26
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "せかい",
                  "value": "せかい",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 23
                    },
                    "end": {
                      "line": 1,
                      "column": 26
                    }
                  },
                  "range": [
                    23,
                    26
                  ]
                }
              ]
            },
            {
              "type": "RubyParenthesis",
              "raw": "》",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 26
                },
                "end": {
                  "line": 1,
                  "column": 27
                }
              },
              "range": [
                26,
                27
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "》",
                  "value": "》",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 26
                    },
                    "end": {
                      "line": 1,
                      "column": 27
                    }
                  },
                  "range": [
                    26,
                    27
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "Str",
          "raw": "。",
          "value": "。",
          "loc": {
            "start": {
              "line": 1,
              "column": 27
            },
            "end": {
              "line": 1,
              "column": 28
            }
          },
          "range": [
            27,
            28
          ]
        }
      ]
    }
  ]
}
```

</details>

## License

MIT

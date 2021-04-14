# jawn-to-ast

日本のウェブ小説サービスへマルチポストするための基礎構文「[序云FS](https://github.com/matori/jawn-fs)」を、[textlint](https://github.com/textlint/textlint)互換のASTに変換するライブラリです。

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

const text = '序云FSです。《《こんにちは》》｜世界《せかい》。';
const AST = parse(text);

// ASTをJSONにして出力
console.log(JSON.stringify(AST, null, 2));
```
<details>
  <summary>出力結果</summary>

```json
{
  "type": "Document",
  "raw": "序云FSです。《《こんにちは》》｜世界《せかい》。",
  "range": [
    0,
    25
  ],
  "loc": {
    "start": {
      "line": 1,
      "column": 0
    },
    "end": {
      "line": 1,
      "column": 25
    }
  },
  "children": [
    {
      "type": "Paragraph",
      "raw": "序云FSです。《《こんにちは》》｜世界《せかい》。",
      "range": [
        0,
        25
      ],
      "loc": {
        "start": {
          "line": 1,
          "column": 0
        },
        "end": {
          "line": 1,
          "column": 25
        }
      },
      "children": [
        {
          "type": "Str",
          "raw": "序云FSです。",
          "value": "序云FSです。",
          "loc": {
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 1,
              "column": 7
            }
          },
          "range": [
            0,
            7
          ]
        },
        {
          "type": "Emphasis",
          "raw": "《《こんにちは》》",
          "loc": {
            "start": {
              "line": 1,
              "column": 7
            },
            "end": {
              "line": 1,
              "column": 16
            }
          },
          "range": [
            7,
            16
          ],
          "children": [
            {
              "type": "Str",
              "raw": "こんにちは",
              "value": "こんにちは",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 9
                },
                "end": {
                  "line": 1,
                  "column": 14
                }
              },
              "range": [
                9,
                14
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
              "column": 16
            },
            "end": {
              "line": 1,
              "column": 24
            }
          },
          "range": [
            16,
            24
          ],
          "children": [
            {
              "type": "RubyBase",
              "raw": "｜世界",
              "loc": {
                "start": {
                  "line": 1,
                  "column": 16
                },
                "end": {
                  "line": 1,
                  "column": 19
                }
              },
              "range": [
                16,
                19
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "世界",
                  "value": "世界",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 17
                    },
                    "end": {
                      "line": 1,
                      "column": 19
                    }
                  },
                  "range": [
                    17,
                    19
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
                  "column": 19
                },
                "end": {
                  "line": 1,
                  "column": 20
                }
              },
              "range": [
                19,
                20
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "《",
                  "value": "《",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 19
                    },
                    "end": {
                      "line": 1,
                      "column": 20
                    }
                  },
                  "range": [
                    19,
                    20
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
                  "column": 20
                },
                "end": {
                  "line": 1,
                  "column": 23
                }
              },
              "range": [
                20,
                23
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "せかい",
                  "value": "せかい",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 20
                    },
                    "end": {
                      "line": 1,
                      "column": 23
                    }
                  },
                  "range": [
                    20,
                    23
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
                  "column": 23
                },
                "end": {
                  "line": 1,
                  "column": 24
                }
              },
              "range": [
                23,
                24
              ],
              "children": [
                {
                  "type": "Str",
                  "raw": "》",
                  "value": "》",
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 23
                    },
                    "end": {
                      "line": 1,
                      "column": 24
                    }
                  },
                  "range": [
                    23,
                    24
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
              "column": 24
            },
            "end": {
              "line": 1,
              "column": 25
            }
          },
          "range": [
            24,
            25
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

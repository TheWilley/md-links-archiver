# md-links-archiver
Parse links within markdown documents and extract content of linked website. Supports various formats, including `HTML`, `PDF`, `PNG` and `TXT`.

This tool serves as a safeguard for preserving or "archiving" references that may be at risk of removal or alteration in the future.

## Installation
`npm install md-links-archiver`

## Usage
Using `mla` here, but can be required as any variable name.
```javascript
mla(<markdown>, <['html' | 'pdf' | 'png' | 'txt']>)
```

## Example
```javascript
var mla = require('../index')

const markdown = `[c](https://en.wikipedia.org/wiki/C_(programming_language))
                  [c++](https://en.wikipedia.org/wiki/C%2B%2B)
                  [c#](https://en.wikipedia.org/wiki/C_Sharp_(programming_language))
`

mla(markdown, ['pdf', 'txt']).then(archive => console.log(archive)) // If no formats are defined, all will be used by default


/*
[
  WebArchive {
    name: 'C (programming language) - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    html: null,
    pdf: <Buffer 25 50 44 46 2d 31 2e 34 0a 25 d3 eb e9 e1 0a 31 20 30 20 6f 62 6a 0a 3c 3c 2f 43 72 65 61 74 6f 72 20 28 4d 6f 7a 69 6c 6c 61 2f 35 2e 30 20 5c 28 58 ... 1665334 more bytes>,
    png: null,
    txt: ...
      'C (pronounced /ˈsiː/ – like the letter c)[6] is a general-purpose computer programming language. 
      It was created in the 1970s by Dennis Ritchie, and remains very widely used and influential.
      ...,
  },
  WebArchive {
    name: 'C++ - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/C%2B%2B',
    html: null,
    pdf: <Buffer 25 50 44 46 2d 31 2e 34 0a 25 d3 eb e9 e1 0a 31 20 30 20 6f 62 6a 0a 3c 3c 2f 43 72 65 61 74 6f 72 20 28 4d 6f 7a 69 6c 6c 61 2f 35 2e 30 20 5c 28 58 ... 1654175 more bytes>,
    png: null,
    txt: ...
      'C++ (/ˈsiː plʌs plʌs/, pronounced "C plus plus" and sometimes abbreviated as CPP) 
      is a high-level, general-purpose programming language created by Danish computer scientist Bjarne Stroustrup.
      ...
  },
  WebArchive {
    name: 'C Sharp (programming language) - Wikipedia',
    url: 'https://en.wikipedia.org/wiki/C_Sharp_(programming_language)',
    html: null,
    pdf: <Buffer 25 50 44 46 2d 31 2e 34 0a 25 d3 eb e9 e1 0a 31 20 30 20 6f 62 6a 0a 3c 3c 2f 43 72 65 61 74 6f 72 20 28 4d 6f 7a 69 6c 6c 61 2f 35 2e 30 20 5c 28 58 ... 1349274 more bytes>,
    png: null,
    txt: ...
      'C# (/ˌsiː ˈʃɑːrp/ see SHARP)[b] is a general-purpose high-level programming language supporting 
      multiple paradigms. C# encompasses static typing,[16]: 4  strong typing, lexically scoped, 
      imperative, declarative, functional, generic,[16]: 22  object-oriented (class-based), and 
      component-oriented programming disciplines.[17]\n' +
      ...
  }
]
*/
```

## License

[MIT](https://github.com/TheWilley/md-links-archiver/blob/main/LICENSE)

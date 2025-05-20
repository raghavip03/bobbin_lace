// https://observablehq.com/@cmudig/highlighter@83
function _1(md){return(
md`# Syntax highlighting for embedded code

This notebook shows you how to make a simple code highlighter in Observable. 

*If you want an editable, highlighted code, you can use [@cmudig/editor](https://next.observablehq.com/@cmudig/editor).*

### Get one of the default syntax highlighters

We provide a couple of default highlighters [at the bottom of this notebook](#predefined) that you can import into your notebook.

For example, this is how you get the SQL highlighter

~~~js
import {sql} from '@cmudig/highlighter'
~~~

### Use the highlighter

You can then use your highlighter to highlight some code. Use \`viewof\` to get the value of your code.

~~~js
viewof query = sql\`SELECT *
FROM foo
WHERE foo.a > 42\`
~~~

### Make your own highlighter

You can either copy the highlighter code at the bottom or make a highlighter by importing 

~~~js
import {makeHl} from '@cmudig/highlighter'
~~~

And then creating a highlighter. For example for SQL:

~~~js
sql = makeHl('sql')
~~~

You can find a list of [supported languages here](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md).
`
)}

function _2(md){return(
md`## Example`
)}

function _query(sql){return(
sql`SELECT *
FROM foo
WHERE foo.a > 42`
)}

function _4(query){return(
query
)}

function _5(md){return(
md`## Code`
)}

function _makeHl(hl){return(
function makeHl(language) {
  return (code) => hl(code, language)
}
)}

function _hl(md){return(
function hl(query, language='js') {
  const result = md`
~~~${language}
${String(query).trim()}
~~~`;

  result.value = String(query).trim();

  return result;
}
)}

function _predefined(md){return(
md`## Predefined Highlighters

Please suggest other highlighters from the [supported languages](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md).`
)}

function _css(makeHl){return(
makeHl('css')
)}

function _js(makeHl){return(
makeHl('js')
)}

function _ts(makeHl){return(
makeHl('ts')
)}

function _sql(makeHl){return(
makeHl('sql')
)}

function _html(makeHl){return(
makeHl('html')
)}

function _glsl(makeHl){return(
makeHl('glsl')
)}

function _prolog(makeHl){return(
makeHl('prolog')
)}

function _http(makeHl){return(
makeHl('http')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof query")).define("viewof query", ["sql"], _query);
  main.variable(observer("query")).define("query", ["Generators", "viewof query"], (G, _) => G.input(_));
  main.variable(observer()).define(["query"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("makeHl")).define("makeHl", ["hl"], _makeHl);
  main.variable(observer("hl")).define("hl", ["md"], _hl);
  main.variable(observer("predefined")).define("predefined", ["md"], _predefined);
  main.variable(observer("css")).define("css", ["makeHl"], _css);
  main.variable(observer("js")).define("js", ["makeHl"], _js);
  main.variable(observer("ts")).define("ts", ["makeHl"], _ts);
  main.variable(observer("sql")).define("sql", ["makeHl"], _sql);
  main.variable(observer("html")).define("html", ["makeHl"], _html);
  main.variable(observer("glsl")).define("glsl", ["makeHl"], _glsl);
  main.variable(observer("prolog")).define("prolog", ["makeHl"], _prolog);
  main.variable(observer("http")).define("http", ["makeHl"], _http);
  return main;
}

// https://observablehq.com/@jonfroehlich/collapsible-toc@114
function _1(md){return(
md`# Collapsible TOC

This notebook can generate a collapsible table of contents automatically for your notebook. It is based on [Collapsible TOC](https://observablehq.com/@heytitle/collapsible-toc) by Pat Chormai 

\`\`\`js
import {toc} from "@jonfroehlich/collapsible-toc"
\`\`\``
)}

function _2(md){return(
md`Here's an example that has all the defaults:`
)}

function _3(toc){return(
toc()
)}

function _4(md){return(
md`Here's an example that will only show Headings1 and Headings2 and starts in a collapsed state:`
)}

function _5(toc){return(
toc("h1,h2", undefined, false)
)}

function _6(md){return(
md`## Implementation`
)}

function _toc(Generators,html,DOM,MutationObserver){return(
function toc(selector = "h1,h2,h3,h4", heading = "<b>Table of Contents</b>", startOpen = true) {
  return Generators.observe(notify => {
    let headings = [];
    let detailsOpen = startOpen ? "open" : "";
    function observed() {
      const h = Array.from(document.querySelectorAll(selector));
      if (h.length !== headings.length || h.some((h, i) => headings[i] !== h)) {
        notify(html`<details ${detailsOpen}><summary>${heading}</summary><ol>${Array.from(headings = h, h => {
          // this level is taken from https://observablehq.com/@matthewkenny/toc
          const level = parseInt(h.tagName.slice(1)) - 1;
          return Object.assign(
            html`${level > 1 ? '<ul>'.repeat(level-1) + '<li>' : '<li>'}<a href=#${h.id}>${DOM.text(h.textContent)}`,
            {onclick: e => (e.preventDefault(), h.scrollIntoView())}
          );
        })}`);
      }
    }

    const observer = new MutationObserver(observed);
    observer.observe(document.body, {childList: true, subtree: true});
    observed();
    return () => observer.disconnect();
  });
}
)}

function _8(md){return(
md`### Test Level 2`
)}

function _9(md){return(
md`#### Test Level 3
Hello!`
)}

function _10(md){return(
md`## Hooray

It worked!`
)}

function _11(md){return(
md`# Heading 1
Test level 1`
)}

function _12(md){return(
md`## Test Level 2
Test Level 2
### Test Level 3
Test Level 3
#### Test Level 4
Test Level 4`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["toc"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["toc"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("toc")).define("toc", ["Generators","html","DOM","MutationObserver"], _toc);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  return main;
}

/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.19.2.
 * Original file: /npm/composed-offset-position@0.0.6/dist/composed-offset-position.browser.min.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{isContainingBlock as t}from"../@floating-ui/utils@0.2.8/dom.c5d971f5.js";function e(t){return r(t)}function n(t){return i(t,"offsetTop")}function o(t){return i(t,"offsetLeft")}function f(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}function r(e){for(let t=e;t;t=f(t))if(t instanceof Element&&"none"===getComputedStyle(t).display)return null;for(let n=f(e);n;n=f(n)){if(!(n instanceof Element))continue;const e=getComputedStyle(n);if("contents"!==e.display){if("static"!==e.position||t(e))return n;if("BODY"===n.tagName)return n}}return null}function i(t,e){let n=t[e],o=r(t);const f=function(t){const e=new Set;let n=t.getRootNode();for(;n;)e.add(n),n=n.parentNode?n.parentNode.getRootNode():null;return e}(t);for(;o&&!f.has(o.getRootNode());)n-=o[e],o=r(o);return n}export{o as offsetLeft,e as offsetParent,n as offsetTop};export default null;

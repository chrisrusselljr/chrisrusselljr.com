import * as adapter from '@astrojs/netlify/netlify-functions.js';
import React, { createElement, Fragment as Fragment$1 } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
import mime from 'mime';
import sharp$1 from 'sharp';
/* empty css                                *//* empty css                                                 */import { Menu, Transition } from '@headlessui/react';
import splitbee from '@splitbee/web';
import { jsxs, jsx } from 'react/jsx-runtime';
import 'http-cache-semantics';
import 'kleur/colors';
import 'node:fs/promises';
import 'node:os';
import 'node:path';
import 'node:url';
import 'magic-string';
import 'node:stream';
import 'slash';
import 'image-size';
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
/* empty css                                     */import { parse } from 'lightcookie';
import jwt from 'jsonwebtoken';
import rss from '@astrojs/rss';
import { map } from 'nanostores';
import { OAuth2Client } from 'google-auth-library';
import 'cookie';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React.createElement(StaticHtml, { value: children });
	}
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.6.10";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    code: 1e3
  },
  StaticRedirectNotAllowed: {
    code: 3001,
    message: "Redirects are only available when using output: 'server'. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  SSRClientAddressNotAvailableInAdapter: {
    code: 3002,
    message: (adapterName) => `Astro.clientAddress is not available in the ${adapterName} adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    code: 3003,
    message: "Astro.clientAddress is only available when using output: 'server'. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    code: 3004,
    message: (pathName) => `A getStaticPaths route pattern was matched, but no matching static path was found for requested path ${pathName}.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    code: 3005,
    message: (route, returnedValue) => `Route ${route ? route : ""} returned a ${returnedValue}. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    code: 3006,
    message: (componentName) => `Media query not provided for "client:media" directive. A media query similar to <${componentName} client:media="(max-width: 600px)" /> must be provided`
  },
  NoMatchingRenderer: {
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render ${componentName}!

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${componentName}.` : `No valid renderer was found ${componentExtension ? `for the .${componentExtension} file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `${componentName} component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by ${rendererName}!`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    code: 3009,
    message: (componentName) => `Unable to render ${componentName}! When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass client:only="${probableRenderers}"? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidStaticPathParam: {
    code: 3010,
    message: (paramType) => `Invalid params given to getStaticPaths path. Expected an object, got ${paramType}`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    code: 3011,
    message: (returnType) => `Invalid type returned by getStaticPaths. Expected an array, got ${returnType}`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsDeprecatedRSS: {
    code: 3012,
    message: "The RSS helper has been removed from getStaticPaths! Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    code: 3013,
    message: "Missing or empty required params property on getStaticPaths route",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    code: 3014,
    message: (key, value) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected a string or number, received \`${typeof value}\` ("${value}")`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    code: 3015,
    message: "getStaticPaths() function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    code: 3016,
    message: (slotName) => `Unable to create a slot named "${slotName}". ${slotName}" is a reserved slot name! Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    code: 3018,
    message: (componentName) => `Could not render ${componentName}. No matching import has been found for ${componentName}.`,
    hint: "Please make sure the component is properly imported."
  },
  UnknownCSSError: {
    code: 4e3
  },
  CSSSyntaxError: {
    code: 4001
  },
  UnknownViteError: {
    code: 5e3
  },
  FailedToLoadModuleSSR: {
    code: 5001,
    message: (importName) => `Could not import "${importName}".`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    code: 5002,
    message: (globPattern) => `Invalid glob pattern: "${globPattern}". Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownMarkdownError: {
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    code: 6001
  },
  UnknownConfigError: {
    code: 7e3
  },
  ConfigNotFound: {
    code: 7001,
    message: (configFile) => `Unable to resolve --config "${configFile}"! Does the file exist?`
  },
  ConfigLegacyKey: {
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: "${legacyConfigKey}".`,
    hint: "Please update your configuration to the new format!\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, message, stack, location, hint, frame } = props;
    this.code = code;
    if (name) {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.code)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.code = errorCode;
    this.name = ((_a = getErrorDataByCode(this.code)) == null ? void 0 : _a.name) ?? "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError({
              ...AstroErrorData.MissingMediaQueryDirective,
              message: AstroErrorData.MissingMediaQueryDirective.message(displayName)
            });
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"PUBLIC_APP_URL":"http://localhost:3000","PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID":"729492878188-s1j7pni8adokkdg5fsj3pa08uajgnu97.apps.googleusercontent.com","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}, route) {
  var _a, _b;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

function isOutputFormat(value) {
  return ["avif", "jpeg", "jpg", "png", "webp"].includes(value);
}
function isOutputFormatSupportsAlpha(value) {
  return ["avif", "png", "webp"].includes(value);
}
function isAspectRatioString(value) {
  return /^\d*:\d*$/.test(value);
}
function parseAspectRatio(aspectRatio) {
  if (!aspectRatio) {
    return void 0;
  }
  if (typeof aspectRatio === "number") {
    return aspectRatio;
  } else {
    const [width, height] = aspectRatio.split(":");
    return parseInt(width) / parseInt(height);
  }
}
function isSSRService(service) {
  return "transform" in service;
}
class BaseSSRService {
  async getImageAttributes(transform) {
    const { width, height, src, format, quality, aspectRatio, ...rest } = transform;
    return {
      ...rest,
      width,
      height
    };
  }
  serializeTransform(transform) {
    const searchParams = new URLSearchParams();
    if (transform.quality) {
      searchParams.append("q", transform.quality.toString());
    }
    if (transform.format) {
      searchParams.append("f", transform.format);
    }
    if (transform.width) {
      searchParams.append("w", transform.width.toString());
    }
    if (transform.height) {
      searchParams.append("h", transform.height.toString());
    }
    if (transform.aspectRatio) {
      searchParams.append("ar", transform.aspectRatio.toString());
    }
    if (transform.fit) {
      searchParams.append("fit", transform.fit);
    }
    if (transform.background) {
      searchParams.append("bg", transform.background);
    }
    if (transform.position) {
      searchParams.append("p", encodeURI(transform.position));
    }
    searchParams.append("href", transform.src);
    return { searchParams };
  }
  parseTransform(searchParams) {
    if (!searchParams.has("href")) {
      return void 0;
    }
    let transform = { src: searchParams.get("href") };
    if (searchParams.has("q")) {
      transform.quality = parseInt(searchParams.get("q"));
    }
    if (searchParams.has("f")) {
      const format = searchParams.get("f");
      if (isOutputFormat(format)) {
        transform.format = format;
      }
    }
    if (searchParams.has("w")) {
      transform.width = parseInt(searchParams.get("w"));
    }
    if (searchParams.has("h")) {
      transform.height = parseInt(searchParams.get("h"));
    }
    if (searchParams.has("ar")) {
      const ratio = searchParams.get("ar");
      if (isAspectRatioString(ratio)) {
        transform.aspectRatio = ratio;
      } else {
        transform.aspectRatio = parseFloat(ratio);
      }
    }
    if (searchParams.has("fit")) {
      transform.fit = searchParams.get("fit");
    }
    if (searchParams.has("p")) {
      transform.position = decodeURI(searchParams.get("p"));
    }
    if (searchParams.has("bg")) {
      transform.background = searchParams.get("bg");
    }
    return transform;
  }
}

class SharpService extends BaseSSRService {
  async transform(inputBuffer, transform) {
    const sharpImage = sharp$1(inputBuffer, { failOnError: false, pages: -1 });
    sharpImage.rotate();
    if (transform.width || transform.height) {
      const width = transform.width && Math.round(transform.width);
      const height = transform.height && Math.round(transform.height);
      sharpImage.resize({
        width,
        height,
        fit: transform.fit,
        position: transform.position,
        background: transform.background
      });
    }
    if (transform.format) {
      sharpImage.toFormat(transform.format, { quality: transform.quality });
      if (transform.background && !isOutputFormatSupportsAlpha(transform.format)) {
        sharpImage.flatten({ background: transform.background });
      }
    }
    const { data, info } = await sharpImage.toBuffer({ resolveWithObject: true });
    return {
      data,
      format: info.format
    };
  }
}
const service = new SharpService();
var sharp_default = service;

const sharp = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: sharp_default
}, Symbol.toStringTag, { value: 'Module' }));

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

function isRemoteImage(src) {
  return /^(https?:)?\/\//.test(src);
}
function removeQueryString(src) {
  const index = src.lastIndexOf("?");
  return index > 0 ? src.substring(0, index) : src;
}
function extname(src) {
  const base = basename(src);
  const index = base.lastIndexOf(".");
  if (index <= 0) {
    return "";
  }
  return base.substring(index);
}
function basename(src) {
  return removeQueryString(src.replace(/^.*[\\\/]/, ""));
}

async function loadRemoteImage(src) {
  try {
    const res = await fetch(src);
    if (!res.ok) {
      return void 0;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(err);
    return void 0;
  }
}
const get$2 = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const transform = sharp_default.parseTransform(url.searchParams);
    let inputBuffer = void 0;
    const sourceUrl = isRemoteImage(transform.src) ? new URL(transform.src) : new URL(transform.src, url.origin);
    inputBuffer = await loadRemoteImage(sourceUrl);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await sharp_default.transform(inputBuffer, transform);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": mime.getType(format) || "",
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: new Date().toUTCString()
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get: get$2
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$c = createAstro("/Users/chrisrussell/portfolio/src/components/BaseHead.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$BaseHead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$BaseHead;
  const { title, description, image = new URL("/images/banner.png", Astro2.url) } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<!-- Font-Awesome SVG Icons --><script defer src="https://kit.fontawesome.com/d2d8a6f671.js" crossorigin="anonymous"><\/script>\n\n<!-- Google Client Library for Identity Authentication -->\n<script src="https://accounts.google.com/gsi/client" async defer><\/script>\n\n<!-- Global Metadata -->\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n\n<!-- generics -->\n<link rel="icon" href="/favicon_32.png" sizes="32x32">\n<link rel="icon" href="/favicon_128.png" sizes="128x128">\n<link rel="icon" href="/favicon_192.png" sizes="192x192">\n\n<!-- iOS -->\n<link rel="apple-touch-icon" href="/favicon_apple_180.png" sizes="180x180">\n\n<meta name="generator"', ">\n\n<!-- Primary Meta Tags -->\n<title>", '</title>\n<meta name="title"', '>\n<meta name="description"', '>\n\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="Chris Russell Jr.">\n<meta property="og:url"', '>\n<meta property="og:title"', '>\n<meta property="og:description"', '>\n<meta property="og:image"', '>\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:domain" content="chrisrusselljr.com">\n<meta property="twitter:url"', '>\n<meta property="twitter:title"', '>\n<meta property="twitter:description"', '>\n<meta property="twitter:image"', ">\n"])), addAttribute(Astro2.generator, "content"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(Astro2.url, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"));
});

const heroImage = {"src":"/assets/hero.854d866b.jpeg","width":1280,"height":1280,"format":"jpg"};

const $$Astro$b = createAstro("/Users/chrisrussell/portfolio/src/components/HeaderLink.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$HeaderLink = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$HeaderLink;
  const { href, ...props } = Astro2.props;
  const { pathname } = Astro2.url;
  const isActive = href === pathname || href === pathname.replace(/\/$/, "");
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")} rel="prefetch"${addAttribute(`text-t-blue text-lg underline-offset-[3px] ${isActive ? "font-bold underline" : ""}`, "class")}${spreadAttributes(props)}>
  ${renderSlot($$result, $$slots["default"])}
</a>`;
});

const trackEvent = (event, details) => splitbee.track(event, details);
const setUser$1 = (name, email) => splitbee.user.set({
  name,
  email
});
__astro_tag_component__(trackEvent, "@astrojs/react");
__astro_tag_component__(setUser$1, "@astrojs/react");

const EmailSelect = () => {
  return /* @__PURE__ */ jsxs(Menu, {
    as: "div",
    className: "relative inline-block text-left",
    children: [/* @__PURE__ */ jsx("div", {
      children: /* @__PURE__ */ jsx(Menu.Button, {
        className: "text-t-blue hover:underline text-lg underline-offset-[3px]",
        children: "Contact"
      })
    }), /* @__PURE__ */ jsx(Transition, {
      as: Fragment$1,
      enter: "transition ease-out duration-100",
      enterFrom: "transform opacity-0 scale-95",
      enterTo: "transform opacity-100 scale-100",
      leave: "transition ease-in duration-75",
      leaveFrom: "transform opacity-100 scale-100",
      leaveTo: "transform opacity-0 scale-95",
      children: /* @__PURE__ */ jsxs(Menu.Items, {
        className: "absolute right-0  z-10 mt-2 w-56 origin-top-right rounded-xl border border-neutral-700 bg-t-black shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-neutral-700",
        children: [/* @__PURE__ */ jsx(Menu.Item, {
          children: ({
            active
          }) => /* @__PURE__ */ jsx("div", {
            className: `block px-4 py-2 text-sm cursor-pointer rounded-t-xl w-full border-b border-neutral-700 ${active ? "bg-neutral-800" : ""}`,
            onClick: () => {
              navigator.clipboard.writeText("chris@tetrateras.com");
              trackEvent("Email Copied");
            },
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Copy Email"
              }), /* @__PURE__ */ jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 1.5,
                stroke: "currentColor",
                className: `w-4 h-4 ${active ? "rotate-[24deg]" : ""}`,
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                })
              })]
            })
          })
        }), /* @__PURE__ */ jsx(Menu.Item, {
          children: ({
            active
          }) => /* @__PURE__ */ jsx("a", {
            className: `block px-4 py-2 text-sm rounded-b-xl hover:no-underline w-full ${active ? "bg-neutral-800" : ""}`,
            href: "mailto:chris@tetrateras.com",
            "data-splitbee-event": "Email Sent",
            children: /* @__PURE__ */ jsxs("div", {
              className: "flex justify-between",
              children: [/* @__PURE__ */ jsx("span", {
                children: "Send Email"
              }), /* @__PURE__ */ jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 1.5,
                stroke: "currentColor",
                className: `w-4 h-4 ${active ? "-rotate-[24deg]" : ""}`,
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                })
              })]
            })
          })
        })]
      })
    })]
  });
};
__astro_tag_component__(EmailSelect, "@astrojs/react");

const $$Astro$a = createAstro("/Users/chrisrussell/portfolio/src/components/Header.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="astro-IAT4DFVT">
  <nav class="flex gap-3 astro-IAT4DFVT">
    ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/", "class": "astro-IAT4DFVT" }, { "default": () => renderTemplate`Home` })}
    ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/blog", "class": "astro-IAT4DFVT" }, { "default": () => renderTemplate`Blog` })}
    ${renderComponent($$result, "HeaderLink", $$HeaderLink, { "href": "/guestbook", "class": "astro-IAT4DFVT" }, { "default": () => renderTemplate`Guestbook` })}
    <!-- <HeaderLink
      href="https://github.com/chrisrusselljr"
      target="_blank"
      data-splitbee-event="Visit Github"
      data-splitbee-event-linkType="Header">GitHub</HeaderLink
    > -->
    ${renderComponent($$result, "EmailSelect", EmailSelect, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/chrisrussell/portfolio/src/components/EmailSelect", "client:component-export": "EmailSelect", "class": "astro-IAT4DFVT" })}
  </nav>
</header>
`;
});

const $$Astro$9 = createAstro("/Users/chrisrussell/portfolio/src/components/Footer.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Footer;
  const today = new Date();
  const { twitter, github, linkedin, animate } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<hr data-animate${addAttribute(`--stagger:${animate}`, "style")} class="border-t-2 border-t-neutral-800 mt-14 astro-3WIV3B3L">

<footer data-animate${addAttribute(`--stagger:${animate}`, "style")} class="l-footer astro-3WIV3B3L">
  <ul class="c-links astro-3WIV3B3L">
    <li class="c-links__item astro-3WIV3B3L">
      <a${addAttribute(`https://twitter.com/${twitter}`, "href")} data-splitbee-event="Visit Twitter" data-splitbee-event-linkType="Footer" target="_blank" class="astro-3WIV3B3L">
        <i class="fa-brands fa-twitter astro-3WIV3B3L" title="twitter"></i>
      </a>
    </li>

    <li class="c-links__item astro-3WIV3B3L">
      <a${addAttribute(`https://github.com/${github}`, "href")} data-splitbee-event="Visit Github" data-splitbee-event-linkType="Footer" target="_blank" class="astro-3WIV3B3L">
        <i class="fa-brands fa-github astro-3WIV3B3L" title="github"></i>
      </a>
    </li>

    <li class="c-links__item astro-3WIV3B3L">
      <a${addAttribute(`https://linkedin.com/in/${linkedin}`, "href")} data-splitbee-event="Visit LinkedIn" data-splitbee-event-linkType="Footer" target="_blank" class="astro-3WIV3B3L">
        <i class="fa-brands fa-linkedin-in astro-3WIV3B3L" title="linkedin"></i>
      </a>
    </li>

    <li class="c-links__item astro-3WIV3B3L">
      <a href="/rss.xml" target="_blank" class="astro-3WIV3B3L">
        <i class="fa-solid fa-rss astro-3WIV3B3L" title="rss"></i>
      </a>
    </li>

    <li class="c-links__item astro-3WIV3B3L">
      <a href="/sitemap-index.xml" target="_blank" class="astro-3WIV3B3L">
        <i class="fa-regular fa-map astro-3WIV3B3L" title="sitemap"></i>
      </a>
    </li>
  </ul>

  <p class="p-copyright astro-3WIV3B3L"></p>

  <p class="text-neutral-400 justify-center mt-5 text-sm astro-3WIV3B3L">
    &copy; ${today.getFullYear()}
  </p>
</footer>

`;
});

const SITE_TITLE = "chris russell jr \u2022";
const SITE_DESCRIPTION = "Aspiring engineer. Into big problems. Always learning. Supply Chain Technology @ SpaceX \u{1F468}\u200D\u{1F4BB}\u{1F680} ";
const LINKEDIN = "chrisrusselljr";
const GITHUB = "chrisrusselljr";
const TWITTER = "chrisrusselljr";

const $$Astro$8 = createAstro("/Users/chrisrussell/portfolio/src/components/Project.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Project = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Project;
  const { name, owner, description, stars, language } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(`https://github.com/${owner}/${name}`, "href")} target="_blank" class="hover:no-underline" data-splitbee-event="Visit Github" data-splitbee-event-linkType="Body"${addAttribute(name, "data-splitbee-event-project")}>
  <div class="h-36 flex flex-col justify-between gap-y-2 border border-neutral-700 bg-t-black hover:scale-105 ease-out transition-transform p-4 rounded-xl">
    <div class="flex flex-col gap-y-2">
      <span class="text-xl font-medium">${name}</span>
      <p class="text-sm text-neutral-200">${description}</p>
    </div>
    <div class="flex items-center gap-x-2 text-sm text-neutral-200">
      <div class="flex gap-x-1 items-center">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"></path>
          </svg>
        </span>
        <span>${stars}</span>
      </div>

      <span>•</span>

      <div class="text-sm">${language}</div>
    </div>
  </div>
</a>`;
});

function resolveSize(transform) {
  if (transform.width && transform.height) {
    return transform;
  }
  if (!transform.width && !transform.height) {
    throw new Error(`"width" and "height" cannot both be undefined`);
  }
  if (!transform.aspectRatio) {
    throw new Error(
      `"aspectRatio" must be included if only "${transform.width ? "width" : "height"}" is provided`
    );
  }
  let aspectRatio;
  if (typeof transform.aspectRatio === "number") {
    aspectRatio = transform.aspectRatio;
  } else {
    const [width, height] = transform.aspectRatio.split(":");
    aspectRatio = Number.parseInt(width) / Number.parseInt(height);
  }
  if (transform.width) {
    return {
      ...transform,
      width: transform.width,
      height: Math.round(transform.width / aspectRatio)
    };
  } else if (transform.height) {
    return {
      ...transform,
      width: Math.round(transform.height * aspectRatio),
      height: transform.height
    };
  }
  return transform;
}
async function resolveTransform(input) {
  if (typeof input.src === "string") {
    return resolveSize(input);
  }
  const metadata = "then" in input.src ? (await input.src).default : input.src;
  let { width, height, aspectRatio, background, format = metadata.format, ...rest } = input;
  if (!width && !height) {
    width = metadata.width;
    height = metadata.height;
  } else if (width) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    height = height || Math.round(width / ratio);
  } else if (height) {
    let ratio = parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
    width = width || Math.round(height * ratio);
  }
  return {
    ...rest,
    src: metadata.src,
    width,
    height,
    aspectRatio,
    format,
    background
  };
}
async function getImage(transform) {
  var _a, _b, _c;
  if (!transform.src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  let loader = (_a = globalThis.astroImage) == null ? void 0 : _a.loader;
  if (!loader) {
    const { default: mod } = await Promise.resolve().then(() => sharp).catch(() => {
      throw new Error(
        "[@astrojs/image] Builtin image loader not found. (Did you remember to add the integration to your Astro config?)"
      );
    });
    loader = mod;
    globalThis.astroImage = globalThis.astroImage || {};
    globalThis.astroImage.loader = loader;
  }
  const resolved = await resolveTransform(transform);
  const attributes = await loader.getImageAttributes(resolved);
  const isDev = (_b = (Object.assign({"PUBLIC_APP_URL":"http://localhost:3000","PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID":"729492878188-s1j7pni8adokkdg5fsj3pa08uajgnu97.apps.googleusercontent.com","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,SSR:true,}))) == null ? void 0 : _b.DEV;
  const isLocalImage = !isRemoteImage(resolved.src);
  const _loader = isDev && isLocalImage ? globalThis.astroImage.defaultLoader : loader;
  if (!_loader) {
    throw new Error("@astrojs/image: loader not found!");
  }
  const { searchParams } = isSSRService(_loader) ? _loader.serializeTransform(resolved) : globalThis.astroImage.defaultLoader.serializeTransform(resolved);
  const imgSrc = !isLocalImage && resolved.src.startsWith("//") ? `https:${resolved.src}` : resolved.src;
  let src;
  if (/^[\/\\]?@astroimage/.test(imgSrc)) {
    src = `${imgSrc}?${searchParams.toString()}`;
  } else {
    searchParams.set("href", imgSrc);
    src = `/_image?${searchParams.toString()}`;
  }
  if ((_c = globalThis.astroImage) == null ? void 0 : _c.addStaticImage) {
    src = globalThis.astroImage.addStaticImage(resolved);
  }
  return {
    ...attributes,
    src
  };
}

async function resolveAspectRatio({ src, aspectRatio }) {
  if (typeof src === "string") {
    return parseAspectRatio(aspectRatio);
  } else {
    const metadata = "then" in src ? (await src).default : src;
    return parseAspectRatio(aspectRatio) || metadata.width / metadata.height;
  }
}
async function resolveFormats({ src, formats }) {
  const unique = new Set(formats);
  if (typeof src === "string") {
    unique.add(extname(src).replace(".", ""));
  } else {
    const metadata = "then" in src ? (await src).default : src;
    unique.add(extname(metadata.src).replace(".", ""));
  }
  return Array.from(unique).filter(Boolean);
}
async function getPicture(params) {
  const { src, widths, fit, position, background } = params;
  if (!src) {
    throw new Error("[@astrojs/image] `src` is required");
  }
  if (!widths || !Array.isArray(widths)) {
    throw new Error("[@astrojs/image] at least one `width` is required");
  }
  const aspectRatio = await resolveAspectRatio(params);
  if (!aspectRatio) {
    throw new Error("`aspectRatio` must be provided for remote images");
  }
  const allFormats = await resolveFormats(params);
  const lastFormat = allFormats[allFormats.length - 1];
  const maxWidth = Math.max(...widths);
  let image;
  async function getSource(format) {
    const imgs = await Promise.all(
      widths.map(async (width) => {
        const img = await getImage({
          src,
          format,
          width,
          fit,
          position,
          background,
          aspectRatio
        });
        if (format === lastFormat && width === maxWidth) {
          image = img;
        }
        return `${img.src} ${width}w`;
      })
    );
    return {
      type: mime.getType(format) || format,
      srcset: imgs.join(",")
    };
  }
  const sources = await Promise.all(allFormats.map((format) => getSource(format)));
  return {
    sources,
    image
  };
}

const $$Astro$7 = createAstro("/Users/chrisrussell/portfolio/node_modules/@astrojs/image/components/Image.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Image;
  const { loading = "lazy", decoding = "async", ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    warnForMissingAlt();
  }
  const attrs = await getImage(props);
  return renderTemplate`${maybeRenderHead($$result)}<img${spreadAttributes(attrs)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}>`;
});

const $$Astro$6 = createAstro("/Users/chrisrussell/portfolio/node_modules/@astrojs/image/components/Picture.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Picture;
  const {
    src,
    alt,
    sizes,
    widths,
    aspectRatio,
    fit,
    background,
    position,
    formats = ["avif", "webp"],
    loading = "lazy",
    decoding = "async",
    ...attrs
  } = Astro2.props;
  if (alt === void 0 || alt === null) {
    warnForMissingAlt();
  }
  const { image, sources } = await getPicture({
    src,
    widths,
    formats,
    aspectRatio,
    fit,
    background,
    position
  });
  delete image.width;
  delete image.height;
  return renderTemplate`${maybeRenderHead($$result)}<picture>
	${sources.map((attrs2) => renderTemplate`<source${spreadAttributes(attrs2)}${addAttribute(sizes, "sizes")}>`)}
	<img${spreadAttributes(image)}${addAttribute(loading, "loading")}${addAttribute(decoding, "decoding")}${addAttribute(alt, "alt")}${spreadAttributes(attrs)}>
</picture>`;
});

let altWarningShown = false;
function warnForMissingAlt() {
  if (altWarningShown === true) {
    return;
  }
  altWarningShown = true;
  console.warn(`
[@astrojs/image] "alt" text was not provided for an <Image> or <Picture> component.

A future release of @astrojs/image may throw a build error when "alt" text is missing.

The "alt" attribute holds a text description of the image, which isn't mandatory but is incredibly useful for accessibility. Set to an empty string (alt="") if the image is not a key part of the content (it's decoration or a tracking pixel).
`);
}

const $$Astro$5 = createAstro("/Users/chrisrussell/portfolio/src/pages/index.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index;
  const pinnedRepos = await fetch("https://gh-pinned-repos.egoist.dev/?username=chrisrusselljr").then(async (response) => {
    return await response.json();
  });
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "BaseHead", $$BaseHead, { "title": `${SITE_TITLE} home`, "description": SITE_DESCRIPTION })}
  ${renderHead($$result)}</head>
  <body>
    ${renderComponent($$result, "Header", $$Header, { "title": SITE_TITLE })}
    <main class="text-lg text-neutral-200">
      <div class="flex justify-evenly">
        ${renderComponent($$result, "Image", $$Image, { "data-animate": true, "style": "--stagger:1", "src": heroImage, "class": "rounded-full m-3 w-3/4", "alt": "hero-image" })}
      </div>

      <h1 data-animate style="--stagger:2" class="text-4xl pb-2 mt-4">Hi, I'm Chris</h1>
      <br>

      <p data-animate style="--stagger:2">
        I'm a <b>Mechanical Engineer</b>, <b>Supply Chain Expert</b>, and self-taught
        <b>Web Developer</b>, located in Los Angeles. I'm currently working as a Systems Analyst at SpaceX, driving process improvement for
        the Raptor, Starship, and Launch Vehicle Supply Chain Teams.
      </p>

      <br>
      <p data-animate style="--stagger:2">
        In my free time, you can find me watching web development tutorials, catching splat points at Orangetheory, or producing <a href="https://soundcloud.com/crussell" data-splitbee-event="Visit Soundcloud" data-splitbee-event-linkType="Body" target="_blank">house music</a>. I also enjoy <a href="/blog">writing</a>, djing, and photography.
      </p>
      <br>
      <br>
      <h2 data-animate style="--stagger:3" class="text-3xl pb-4">Things I've Built</h2>

      <section data-animate style="--stagger:3" id="projects" class="grid grid-cols-1 gap-4 auto-cols-max sm:grid-cols-2 sm:gap-3">
        ${pinnedRepos.map((repo) => {
    return renderTemplate`${renderComponent($$result, "Project", $$Project, { "name": repo.repo, "owner": repo.owner, "description": repo.description, "stars": repo.stars, "language": repo.language })}`;
  })}
      </section>
    </main>
    ${renderComponent($$result, "Footer", $$Footer, { "twitter": TWITTER, "github": GITHUB, "linkedin": LINKEDIN, "animate": 4 })}
    ${maybeRenderHead($$result)}
  </body>
</html>`;
});

const $$file$2 = "/Users/chrisrussell/portfolio/src/pages/index.astro";
const $$url$2 = "";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

const guestbookLoader = async () => {
  return await prisma.post.findMany({
    select: {
      postId: true,
      content: true,
      userId: true,
      userName: true,
      createdAt: true
    },
    orderBy: {
      createdAt: "desc"
    },
    where: {
      published: true
    }
  });
};

const $$Astro$4 = createAstro("/Users/chrisrussell/portfolio/src/components/Message.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Message = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Message;
  const { postId, content, userId, userName, createdAt } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(postId, "data-message-id")}${addAttribute(userId, "data-user-id")} class="flex flex-col space-y-2">
  <p class="w-full break-words">${content}</p>
  <div class="flex items-center space-x-3">
    <p class="text-sm text-gray-500">
      ${userName} / ${format(new Date(createdAt), "d MMM yyyy 'at' h:mm bb")}
    </p>
  </div>
</div>`;
});

const $$Astro$3 = createAstro("/Users/chrisrussell/portfolio/src/components/GuestbookForm.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$GuestbookForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$GuestbookForm;
  return renderTemplate`${maybeRenderHead($$result)}<form id="form" class="relative my-4 astro-727DAELY" data-animate style="--stagger:3">
  <input id="userInput" name="userInput" aria-label="Your message" placeholder="Your message..." maxlength="100" required class="pl-4 pr-32 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full border-gray-300 rounded-md bg-gray-800 text-gray-100 astro-727DAELY">
  <button id="submit-button" class="flex items-center justify-center absolute right-1 top-1 px-4 pt-1 font-medium h-8 bg-gray-700 text-gray-100 rounded w-28 astro-727DAELY" type="submit">
    Submit
  </button>
</form>

<p id="thank-you-message" class="items-center text-sm font-bold text-green-400 #thank-you-message astro-727DAELY">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="mr-2 h-4 w-4 astro-727DAELY">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" class="astro-727DAELY"></path>
  </svg>
  Thank you for your submission!
</p>



${maybeRenderHead($$result)}`;
});

const AUTH_COOKIE_NAME = "__session_crj";
const JWT_SECRET = "EdXzq9g+Xb649BgGqncEYwWvORoc5pqrv8zo6+XFEPo=";
const SIGN_IN_WITH_GOOGLE_CLIENT_ID = {"PUBLIC_APP_URL":"http://localhost:3000","PUBLIC_SIGN_IN_WITH_GOOGLE_CLIENT_ID":"729492878188-s1j7pni8adokkdg5fsj3pa08uajgnu97.apps.googleusercontent.com","BASE_URL":"/","MODE":"production","DEV":false,"PROD":true}.SIGN_IN_WITH_GOOGLE_CLIENT_ID;

async function isLoggedIn(req) {
  let user = {};
  const cookie = req.headers.get("cookie");
  if (cookie) {
    const parsed = parse(cookie);
    if (parsed.__session_crj) {
      jwt.verify(parsed.__session_crj, JWT_SECRET, (e, decoded) => {
        if (!e && !!decoded) {
          user = {
            authed: true,
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture
          };
        }
      });
    }
  }
  return {
    ...user
  };
}

const $$Astro$2 = createAstro("/Users/chrisrussell/portfolio/src/pages/guestbook.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Guestbook = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Guestbook;
  const messages = await guestbookLoader();
  const user = await isLoggedIn(Astro2.request);
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "BaseHead", $$BaseHead, { "title": `${SITE_TITLE} guestbook`, "description": "Stop by and say 'hi." })}
  ${renderHead($$result)}</head>
  <body>
    ${renderComponent($$result, "Header", $$Header, {})}

    <h1 data-animate style="--stagger:1" class="pb-6">Guestbook</h1>
    <p class="text-gray-400 mb-4" data-animate style="--stagger:2">
      Leave a comment below. It could be anything - appreciation, information, wisdom, or even humor. Surprise me!
    </p>

    <div id="submission-form" class="border rounded p-6 my-4 w-full border-gray-800 bg-blue-opaque" data-animate style="--stagger:2">
      <h5 class="text-lg md:text-xl font-bold text-gray-100">Sign the Guestbook</h5>
      <p class="my-1 text-gray-200">Share a message for a future visitor of my site.</p>

      ${user.authed ? renderTemplate`<p>Signed in as ${user.name}</p><a class="logout auth-link flex items-center justify-center my-4 font-bold h-8  bg-gray-700 text-gray-100 rounded w-28" href="/api/logout">
              Logout
            </a>${renderComponent($$result, "GuestbookForm", $$GuestbookForm, {})}<p class="text-sm text-gray-200">Your information is only used to display your name.</p>` : renderTemplate`<div id="buttonDiv" class="ml-2 mt-2"></div>`}
    </div>

    <section id="messages-list" data-animate style="--stagger:3">
      <div class="mt-4 space-y-8">
        ${messages.map((message) => renderTemplate`${renderComponent($$result, "Message", $$Message, { "postId": message.postId, "content": message.content, "userId": message.userId, "userName": message.userName, "createdAt": message.createdAt })}`)}
      </div>
    </section>

    ${renderComponent($$result, "Footer", $$Footer, { "twitter": TWITTER, "github": GITHUB, "linkedin": LINKEDIN, "animate": 4 })}
    ${maybeRenderHead($$result)}
  </body>
</html>`;
});

const $$file$1 = "/Users/chrisrussell/portfolio/src/pages/guestbook.astro";
const $$url$1 = "/guestbook";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Guestbook,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const get$1 = () =>
  rss({
    // `<title>` field in output xml
    title: "chris russell jr • blog",
    // `<description>` field in output xml
    description: "Learnings of an aspiring engineer.",
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: 'https://www.chrisrusselljr.com/',
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: /* #__PURE__ */ Object.assign({"./blog/dont-ask-for-feedback.mdx": () => Promise.resolve().then(() => _page5),"./blog/empowerment.mdx": () => Promise.resolve().then(() => _page6),"./blog/five-tips-for-effective-team-members.mdx": () => Promise.resolve().then(() => _page4)}),
    stylesheet: "/rss/styles.xsl",
  });

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get: get$1
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$2 = async function ({
  children
}) {
  const Layout = (await import('./chunks/BlogPost.3a56813e.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$2;
  content.file = file$2;
  content.url = url$2;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$2,
    url: url$2,
    content,
    frontmatter: content,
    headings: getHeadings$2(),
    "server:root": true,
    children
  });
};
const frontmatter$2 = {
  "readingTime": "2 min read",
  "layout": "../../layouts/BlogPost.astro",
  "title": "Five Tips for Effective Team Members",
  "description": "Don't block. Speak Up. Skip the drama. Choose Your Battles. Commit.",
  "pubDate": "June 24, 2021"
};
function getHeadings$2() {
  return [{
    "depth": 2,
    "slug": "do-not-impede-others-work",
    "text": "Do not impede other\u2019s work"
  }, {
    "depth": 2,
    "slug": "speak-up",
    "text": "Speak Up"
  }, {
    "depth": 2,
    "slug": "skip-the-drama",
    "text": "Skip the Drama"
  }, {
    "depth": 2,
    "slug": "choose-your-battles",
    "text": "Choose Your Battles"
  }, {
    "depth": 2,
    "slug": "commit",
    "text": "Commit"
  }];
}
function _createMdxContent$2(props) {
  const _components = Object.assign({
    h2: "h2",
    a: "a",
    span: "span",
    p: "p"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "do-not-impede-others-work",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#do-not-impede-others-work",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Do not impede other\u2019s work"]
    }), "\n", createVNode(_components.p, {
      children: "Good teammates do not impede other\u2019s work. This applies in both vertical and horizontal relationships. If your Manager plans to implement a process that will impede your team, is it your absolute obligation to speak up. If your coworker is working on a project, you must not impede their progress in any way, unless their actions directly impact you."
    }), "\n", createVNode("br", {}), "\n", createVNode(_components.h2, {
      id: "speak-up",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#speak-up",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Speak Up"]
    }), "\n", createVNode(_components.p, {
      children: "Authenticity is perishable. From the moment you feel it in your gut, the countdown begins. Once the conversation is over, you\u2019ve missed your chance. Recognize these moments and take action. I see future leaders around me when people speak what\u2019s on their mind. It motivates me to do the same."
    }), "\n", createVNode("br", {}), "\n", createVNode(_components.h2, {
      id: "skip-the-drama",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#skip-the-drama",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Skip the Drama"]
    }), "\n", createVNode(_components.p, {
      children: "It is extremely human to develop opinions on the occurrence of events. The expression of these thoughts is unnecessary if you\u2019re not involved. Unless you\u2019re designated as an agent or facilitator between parties, keep your mouth shut. Getting involved in other people\u2019s situations is like having a conversation while blending a smoothie; you\u2019re already lost in the noise. Other people need to take responsibility for themselves."
    }), "\n", createVNode("br", {}), "\n", createVNode(_components.h2, {
      id: "choose-your-battles",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#choose-your-battles",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Choose Your Battles"]
    }), "\n", createVNode(_components.p, {
      children: "Every day, you have a limited amount of energy. You must be selective on which challenges you direct it towards.  If you\u2019re like me, you are strongly confident in your own opinion and like having things go your own way. This is not a unique trait. Others will see you, look at you, hear your voice, and do exactly what they want, regardless of how you feel. Picking your battles is out getting out of their way and exerting your energy on more productive enterprises."
    }), "\n", createVNode("br", {}), "\n", createVNode(_components.h2, {
      id: "commit",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#commit",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Commit"]
    }), "\n", createVNode(_components.p, {
      children: "Commitment is the only outcome of conflict. Either you agree and commit or disagree and commit. The important part is you\u2019ve expressed an opinion."
    })]
  });
}
function MDXContent$2(props = {}) {
  return createVNode(MDXLayout$2, {
    ...props,
    children: createVNode(_createMdxContent$2, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings$2, "astro:jsx");
__astro_tag_component__(MDXContent$2, "astro:jsx");
MDXContent$2[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$2.layout);
const url$2 = "/blog/five-tips-for-effective-team-members";
const file$2 = "/Users/chrisrussell/portfolio/src/pages/blog/five-tips-for-effective-team-members.mdx";
function rawContent$2() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$2() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$2 = MDXContent$2;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	getHeadings: getHeadings$2,
	default: MDXContent$2,
	url: url$2,
	file: file$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	Content: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$1 = async function ({
  children
}) {
  const Layout = (await import('./chunks/BlogPost.3a56813e.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter$1;
  content.file = file$1;
  content.url = url$1;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$1,
    url: url$1,
    content,
    frontmatter: content,
    headings: getHeadings$1(),
    "server:root": true,
    children
  });
};
const frontmatter$1 = {
  "readingTime": "1 min read",
  "layout": "../../layouts/BlogPost.astro",
  "title": "Don't Ask for Feedback",
  "description": "You're already awesome.",
  "pubDate": "May 23, 2021"
};
function getHeadings$1() {
  return [{
    "depth": 2,
    "slug": "youre-already-awesome",
    "text": "You\u2019re already awesome."
  }];
}
function _createMdxContent$1(props) {
  const _components = Object.assign({
    h2: "h2",
    a: "a",
    span: "span",
    p: "p",
    em: "em"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "youre-already-awesome",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#youre-already-awesome",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "You\u2019re already awesome."]
    }), "\n", createVNode(_components.p, {
      children: "You don\u2019t need anyone to verify this."
    }), "\n", createVNode(_components.p, {
      children: "Good teammates/managers will tell you what to work on."
    }), "\n", createVNode(_components.p, {
      children: "They\u2019re called blind spots for a reason."
    }), "\n", createVNode(_components.p, {
      children: ["Ask ", createVNode(_components.em, {
        children: "specific"
      }), " questions if you have them."]
    }), "\n", createVNode(_components.p, {
      children: "Let people rip into your work. Don\u2019t get defensive. Thank them profusely."
    }), "\n", createVNode(_components.p, {
      children: "Let your guard down."
    }), "\n", createVNode(_components.p, {
      children: "Listen to their words, hear what they say, then do what you want - others will do the same."
    }), "\n", createVNode(_components.p, {
      children: "Show people you see them. Look at them. Say \u201Cgood morning\u201D."
    }), "\n", createVNode(_components.p, {
      children: "Skip the code speak - say exactly what\u2019s on your mind."
    }), "\n", createVNode(_components.p, {
      children: "Authenticity = candor + directness"
    }), "\n", createVNode(_components.p, {
      children: "And most importantly:"
    }), "\n", createVNode(_components.p, {
      children: "Show you care first, or else you\u2019ll just sound like an asshole."
    })]
  });
}
function MDXContent$1(props = {}) {
  return createVNode(MDXLayout$1, {
    ...props,
    children: createVNode(_createMdxContent$1, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings$1, "astro:jsx");
__astro_tag_component__(MDXContent$1, "astro:jsx");
MDXContent$1[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$1.layout);
const url$1 = "/blog/dont-ask-for-feedback";
const file$1 = "/Users/chrisrussell/portfolio/src/pages/blog/dont-ask-for-feedback.mdx";
function rawContent$1() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$1() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$1 = MDXContent$1;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	getHeadings: getHeadings$1,
	default: MDXContent$1,
	url: url$1,
	file: file$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	Content: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout = async function ({
  children
}) {
  const Layout = (await import('./chunks/BlogPost.3a56813e.mjs')).default;
  const {
    layout,
    ...content
  } = frontmatter;
  content.file = file;
  content.url = url;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file,
    url,
    content,
    frontmatter: content,
    headings: getHeadings(),
    "server:root": true,
    children
  });
};
const frontmatter = {
  "readingTime": "1 min read",
  "layout": "../../layouts/BlogPost.astro",
  "title": "Empowerment",
  "description": "Make a plan for yourself.",
  "pubDate": "December 16, 2021"
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "if-you-dont-have-a-plan-for-yourself-youll-become-a-part-of-someone-elses",
    "text": "If you don\u2019t have a plan for yourself, you\u2019ll become a part of someone else\u2019s."
  }, {
    "depth": 2,
    "slug": "success-isnt-always-polite",
    "text": "Success isn\u2019t always polite."
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    h2: "h2",
    a: "a",
    span: "span",
    p: "p",
    em: "em",
    strong: "strong"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "if-you-dont-have-a-plan-for-yourself-youll-become-a-part-of-someone-elses",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#if-you-dont-have-a-plan-for-yourself-youll-become-a-part-of-someone-elses",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "If you don\u2019t have a plan for yourself, you\u2019ll become a part of someone else\u2019s."]
    }), "\n", createVNode(_components.p, {
      children: "Nothing will be given to you."
    }), "\n", createVNode(_components.p, {
      children: "Determine what you want and the necessary steps to get there."
    }), "\n", createVNode(_components.p, {
      children: "Then execute, every day, without apology."
    }), "\n", createVNode(_components.p, {
      children: ["Empowerment means ", createVNode(_components.em, {
        children: "you"
      }), " are in control of your path."]
    }), "\n", createVNode("br", {}), "\n", createVNode(_components.h2, {
      id: "success-isnt-always-polite",
      children: [createVNode(_components.a, {
        "aria-hidden": "true",
        tabIndex: "-1",
        href: "#success-isnt-always-polite",
        children: createVNode(_components.span, {
          className: "icon icon-link"
        })
      }), "Success isn\u2019t always polite."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "Everyone"
      }), " is competing to get to the next level."]
    }), "\n", createVNode(_components.p, {
      children: "If you\u2019re good at what you do, consider yourself a resource."
    }), "\n", createVNode(_components.p, {
      children: "Be helpful, but not at the cost of your plan."
    }), "\n", createVNode(_components.p, {
      children: "To compromise your bandwidth is stagnation."
    })]
  });
}
function MDXContent(props = {}) {
  return createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
const url = "/blog/empowerment";
const file = "/Users/chrisrussell/portfolio/src/pages/blog/empowerment.mdx";
function rawContent() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content = MDXContent;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	getHeadings,
	default: MDXContent,
	url,
	file,
	rawContent,
	compiledContent,
	Content
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro("/Users/chrisrussell/portfolio/src/components/Blog.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Blog$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Blog$1;
  const { title, description, date, readingTime, url } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(url, "href")} rel="prefetch" class="flex flex-col gap-y-3 hover:no-underline p-4 mb-4 hover:bg-neutral-800 transition-colors rounded-xl">
  <h3 class="text-t-blue text-xl md:text-2xl font-extrabold">${title}</h3>

  <p class="text-sm md:text-base">${description}</p>

  <div class="flex items-center gap-x-2 text-neutral-200 text-xs md:text-sm">
    <time${addAttribute(date, "datetime")}>
      ${new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}
    </time>

    <span>•</span>

    <span>${readingTime}</span>
  </div>
</a>`;
});

const $$Astro = createAstro("/Users/chrisrussell/portfolio/src/pages/blog.astro", "https://www.chrisrusselljr.com/", "file:///Users/chrisrussell/portfolio/");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const posts = (await Astro2.glob(/* #__PURE__ */ Object.assign({"./blog/dont-ask-for-feedback.mdx": () => Promise.resolve().then(() => _page5),"./blog/empowerment.mdx": () => Promise.resolve().then(() => _page6),"./blog/five-tips-for-effective-team-members.mdx": () => Promise.resolve().then(() => _page4)}), () => "./blog/*.{md,mdx}")).sort(
    (a, b) => new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
  );
  return renderTemplate`<html lang="en">
  <head>
    ${renderComponent($$result, "BaseHead", $$BaseHead, { "title": `${SITE_TITLE} blog`, "description": "Learnings of an aspiring engineer." })}
  ${renderHead($$result)}</head>
  <body>
    ${renderComponent($$result, "Header", $$Header, {})}
    <main>
      <h1 data-animate style="--stagger:1" class="pb-6">Blog</h1>
      <section data-animate style="--stagger:2">
        ${posts.map((post) => renderTemplate`${renderComponent($$result, "Blog", $$Blog$1, { "title": post.frontmatter.title, "description": post.frontmatter.description, "readingTime": post.frontmatter.readingTime, "date": post.frontmatter.pubDate, "url": post.url })}`)}
      </section>
    </main>
    ${renderComponent($$result, "Footer", $$Footer, { "twitter": TWITTER, "github": GITHUB, "linkedin": LINKEDIN, "animate": 3 })}
  ${maybeRenderHead($$result)}
</body></html>`;
});

const $$file = "/Users/chrisrussell/portfolio/src/pages/blog.astro";
const $$url = "/blog";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Blog,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const userData = map(null);
const setUser = (data) => {
  userData.set(data);
};

async function get() {
  const headers = new Headers();
  headers.append("Set-Cookie", `${AUTH_COOKIE_NAME}=""; Max-Age=1; Path=/; HttpOnly; Secure;`);
  headers.append("Location", "/guestbook");
  setUser(null);
  console.log(userData);
  return new Response(null, {
    status: 302,
    headers
  });
}

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	get
}, Symbol.toStringTag, { value: 'Module' }));

function sevenDaysFromNow() {
  const d = new Date();
  const time = 7 * 24 * 60 * 60 * 1e3;
  d.setTime(d.getTime() + time);
  return d.toUTCString();
}
function createHeaders({ jwt: jwt2, location }) {
  const expires = sevenDaysFromNow();
  const headers = new Headers();
  headers.append("Set-Cookie", `${AUTH_COOKIE_NAME}=${jwt2}; Expires=${expires}; Path=/; HttpOnly; Secure;`);
  headers.append("Location", location);
  return headers;
}
const createToken = ({ userId, name, email, picture }) => jwt.sign({ userId, name, email, picture }, JWT_SECRET, { expiresIn: "7d" });
const post$1 = async ({ request }) => {
  const CLIENT_ID = SIGN_IN_WITH_GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);
  const body = await request.json();
  const token = body.token;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  const upsertUser = await prisma.user.upsert({
    where: {
      email: payload.email
    },
    update: {},
    create: {
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    }
  });
  const jwt2 = createToken({ userId: upsertUser.userId, name: payload.name, email: payload.email, picture: payload.picture });
  const headers = createHeaders({ jwt: jwt2, location: "/guestbook" });
  setUser({ userId: upsertUser.userId, name: payload.name, email: payload.email, picture: payload.picture });
  console.log(userData.get());
  return new Response(null, {
    status: 200,
    headers
  });
};

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: createHeaders,
	createToken,
	post: post$1
}, Symbol.toStringTag, { value: 'Module' }));

const post = async ({ request }) => {
  const body = await request.json();
  const content = body.content;
  const userName = userData.get().name;
  const userId = userData.get().userId;
  const userEmail = userData.get().email;
  const userPicture = userData.get().picture;
  const newPost = await prisma.post.create({
    data: {
      content,
      userId,
      userEmail,
      userName,
      userPicture
    }
  });
  console.log(newPost);
  return new Response(null, {
    status: 200
  });
};

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['node_modules/@astrojs/image/dist/endpoint.js', _page0],['src/pages/index.astro', _page1],['src/pages/guestbook.astro', _page2],['src/pages/rss.xml.js', _page3],['src/pages/blog/five-tips-for-effective-team-members.mdx', _page4],['src/pages/blog/dont-ask-for-feedback.mdx', _page5],['src/pages/blog/empowerment.mdx', _page6],['src/pages/blog.astro', _page7],['src/pages/api/logout.ts', _page8],['src/pages/api/login.ts', _page9],['src/pages/api/sign.ts', _page10],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":[],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/image/dist/endpoint.js","pathname":"/_image","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css"],"scripts":[{"type":"external","value":"hoisted.4a18aa67.js"},{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css","assets/guestbook.77106a7b.css"],"scripts":[{"type":"external","value":"hoisted.c071352d.js"},{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/guestbook","type":"page","pattern":"^\\/guestbook\\/?$","segments":[[{"content":"guestbook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/guestbook.astro","pathname":"/guestbook","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/dont-ask-for-feedback.37f1ee27.css","assets/blog.c8e4a4e0.css"],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/rss.xml","type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css"],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/blog/five-tips-for-effective-team-members","type":"page","pattern":"^\\/blog\\/five-tips-for-effective-team-members\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"five-tips-for-effective-team-members","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/five-tips-for-effective-team-members.mdx","pathname":"/blog/five-tips-for-effective-team-members","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css"],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/blog/dont-ask-for-feedback","type":"page","pattern":"^\\/blog\\/dont-ask-for-feedback\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"dont-ask-for-feedback","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/dont-ask-for-feedback.mdx","pathname":"/blog/dont-ask-for-feedback","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css"],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/blog/empowerment","type":"page","pattern":"^\\/blog\\/empowerment\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"empowerment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/empowerment.mdx","pathname":"/blog/empowerment","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.c8e4a4e0.css","assets/dont-ask-for-feedback.37f1ee27.css"],"scripts":[{"type":"external","value":"hoisted.4a18aa672.js"},{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/api/logout","type":"endpoint","pattern":"^\\/api\\/logout$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/logout.ts","pathname":"/api/logout","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/api/login","type":"endpoint","pattern":"^\\/api\\/login$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/login.ts","pathname":"/api/login","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"page.5a6f3db5.js"}],"routeData":{"route":"/api/sign","type":"endpoint","pattern":"^\\/api\\/sign$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"sign","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/sign.ts","pathname":"/api/sign","_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.chrisrusselljr.com/","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"vitesse-dark","wrap":false},"remarkPlugins":[null],"rehypePlugins":[null],"remarkRehype":{},"extendDefaultPlugins":true,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/Users/chrisrussell/portfolio/src/layouts/BlogPost.astro":"chunks/BlogPost.3a56813e.mjs","/Users/chrisrussell/portfolio/src/components/EmailSelect":"EmailSelect.2cb1904b.js","@astrojs/react/client.js":"client.54547dd8.js","/astro/hoisted.js?q=0":"hoisted.4a18aa67.js","/astro/hoisted.js?q=1":"hoisted.c071352d.js","/astro/hoisted.js?q=2":"hoisted.4a18aa672.js","astro:scripts/page.js":"page.5a6f3db5.js","astro:scripts/before-hydration.js":""},"assets":["/assets/hero.854d866b.jpeg","/assets/blog.c8e4a4e0.css","/assets/dont-ask-for-feedback.37f1ee27.css","/assets/guestbook.77106a7b.css","/EmailSelect.2cb1904b.js","/client.54547dd8.js","/favicon.svg","/favicon_128.png","/favicon_192.png","/favicon_32.png","/favicon_apple_180.png","/hoisted.4a18aa67.js","/hoisted.4a18aa672.js","/hoisted.c071352d.js","/page.5a6f3db5.js","/robots.txt","/chunks/index.3e9d6765.js","/chunks/web.esm.50cf5f8e.js","/fonts/Inter-Black.woff2","/fonts/Inter-Bold.woff2","/fonts/Inter-ExtraBold.woff2","/fonts/Inter-Medium.woff2","/fonts/Inter-Regular.woff2","/fonts/hack-regular-subset.woff2","/rss/styles.xsl","/images/banner.png","/images/hero.jpeg","/page.5a6f3db5.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { $$BaseHead as $, GITHUB as G, LINKEDIN as L, TWITTER as T, createComponent as a, renderComponent as b, createAstro as c, renderHead as d, $$Header as e, renderSlot as f, $$Footer as g, handler, renderTemplate as r };

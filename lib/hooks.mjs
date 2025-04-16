import { vDom } from "./dom.mjs"

const Link = (url, ref) => {
    return vDom('a', { 'href': url, 'data-link': null, content: ref })
}

export { Link };
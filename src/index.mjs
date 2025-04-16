import { vDom } from "../lib/dom.mjs"
import { Link } from "../lib/hooks.mjs"

export default () => {
    return vDom('div', {},
        vDom('nav', {}, [
            Link('/', 'Home'),
            Link('/about', 'about'),
        ]),
        vDom('h1', { content: 'Home Page' })
    )

    return (
        `
        <nav>
            <a href="/" data-link>Home</a>
            <a href="/about" data-link>About</a>
        </nav>
        <h1>Home Page</h1>`
    )
}

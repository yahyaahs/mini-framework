import { Link } from "../lib/hooks.mjs";
import { createComponent } from "../lib/virtual_dom.mjs";

export default () => {
    const about = createComponent()

    return about.setElements(
        about.createElement('nav', {}, [
            about.createElement(...Link('/', 'return to home')),
        ]),
        about.createElement('h1', {}, ['welcom to about page'])
    );
};
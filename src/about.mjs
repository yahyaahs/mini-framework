import { Link } from "../lib/hooks.mjs";
import { createComponent } from "../lib/virtual_dom.mjs";
import { createElement } from "../lib/virtual_element.mjs";

export default () => {
    return createComponent(
        createElement('nav', {}, [
            createElement(...Link('/', 'return to home')),
        ]),
        createElement('h1', {}, ['welcom to about page'])
    );
};
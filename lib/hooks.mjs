import { navigate } from "./main.mjs";

const Link = (url, ref) => {
    return ['a', { 'href': url, 'data-link': null, }, [ref]]
}

const Redirect = (url) => {
    const fakeLink = document.createElement('a');
    fakeLink.setAttribute('href', url);

    navigate({
        target: fakeLink,
        preventDefault: () => { }
    });
}

export { Link, Redirect };
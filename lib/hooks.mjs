const Link = (url, ref) => {
    return ['a', { 'href': url, 'data-link': null, }, [ref]]
}

export { Link };
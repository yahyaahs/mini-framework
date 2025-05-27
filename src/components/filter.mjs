import { Link } from "../../dist/hooks.mjs"

const Filter = (root) => {
    return root.createElement('ul', { class: 'filters' }, [
        root.createElement('li', {}, [root.createElement(...Link('/', {}, 'All'))]),
        root.createElement('li', {}, [root.createElement(...Link('/active', {}, 'Active'))]),
        root.createElement('li', {}, [root.createElement(...Link('/completed', {}, 'Completed'))]),
    ])
}

export { Filter };
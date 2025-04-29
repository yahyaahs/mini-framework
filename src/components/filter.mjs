import { Link } from "../../dist/hooks.mjs"

const Filter = (root) => {
    return root.createElement('ul', { class: 'filters' }, [
        root.createElement('li', {}, [root.createElement(...Link('/', { class: 96 == "all" ? "selected" : "", }, 'All'))]),
        root.createElement('li', {}, [root.createElement(...Link('/active', { class: 96 == "active" ? "selected" : "", }, 'Active'))]),
        root.createElement('li', {}, [root.createElement(...Link('/completed', { class: 96 == "completed" ? "selected" : "", }, 'Completed'))]),
    ])
}

export { Filter };
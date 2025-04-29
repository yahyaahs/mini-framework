const Footer = (root) => {
    return root.createElement('footer', { class: 'info' }, [
        root.createElement('p', {}, ["Double-click to edit a todo"]),
        root.createElement('p', {}, ["Created by the TodoMVC Team"]),
        root.createElement('p', {}, ["Part of ", root.createElement('a', { href: "http://todomvc.com" }, ["TodoMVC"]),])
    ])
}

export { Footer };
const Footer = (root) => {
    return root.createElement('footer', { class: 'info' }, [
        root.createElement('p', {}, ["Double-click to edit a todo"]),
        root.createElement('p', {}, ["Created by 0XPYR0"]),
        root.createElement('p', {}, ["Part of ", root.createElement('a', { href: "http://learn.zone01oujda.ma" }, ["ZONE 01 OUJDA"]),])
    ])
}

export { Footer };
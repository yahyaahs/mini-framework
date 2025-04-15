export function parseHTML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div id="vdom-container">${str}</div>`, 'text/html');
    clean(doc.body);
    return doc.body.firstChild;
}

export function clean(node) {
    const nodesToRemove = [];
    // nodetypes 8// 3// empty
    for (const child of node.childNodes) {
        if (child.nodeType === 8 || // Comment node
            (child.nodeType === 3 && !/\S/.test(child.nodeValue))) {
            nodesToRemove.push(child);
        } else if (child.nodeType === 1) {
            clean(child);
        }
    }

    for (const child of nodesToRemove) {
        node.removeChild(child);
    }
}

function getNodeType(node) {
    return node.nodeType === 1 ? node.tagName.toLowerCase() : node.nodeType;
}

export function diff(source, target) {
    if (!target.hasChildNodes() && source.hasChildNodes()) {
        Array.from(source.childNodes).forEach(child => {
            target.appendChild(child.cloneNode(true));
        });
        return;
    }

    if (source.isEqualNode(target)) return;

    // Handle case where target has more nodes than source
    while (target.childNodes.length > source.childNodes.length) {
        target.removeChild(target.lastChild);
    }

    // diff child nodes
    Array.from(source.childNodes).forEach((sourceChild, i) => {
        const targetChild = target.childNodes[i];

        if (!targetChild) {
            // new node adding
            target.appendChild(sourceChild.cloneNode(true));
            return;
        }

        const sourceType = getNodeType(sourceChild);
        const targetType = getNodeType(targetChild);

        if (sourceType !== targetType) {
            // replace evtg when nodes are diffrent
            target.replaceChild(sourceChild.cloneNode(true), targetChild);
            return;
        }

        if (sourceChild.nodeType === 3) {
            // update content when diffrent in text node
            if (sourceChild.textContent !== targetChild.textContent) {
                targetChild.textContent = sourceChild.textContent;
            }
        } else {
            //update attrs and children in element node
            patchAttributes(sourceChild, targetChild);
            diff(sourceChild, targetChild);
        }
    });
}

function patchAttributes(source, target) {
    // remove attr tht dont exist
    Array.from(target.attributes).forEach(attr => {
        if (!source.hasAttribute(attr.name)) {
            target.removeAttribute(attr.name);
        }
    });

    // add  from source
    Array.from(source.attributes).forEach(attr => {
        if (target.getAttribute(attr.name) !== attr.value) {
            target.setAttribute(attr.name, attr.value);
        }
    });
}


// Virtual DOM creator 
export function vDom(tag, attrs = {}, children = []) {
    return { tag, attrs, children };
}

export function render(newNode, targetNode) {
    clean(targetNode);
    diff(newNode, targetNode);
}

/// you could either use vdom to create dom elemnt or create html and use parsehtml to parse it to vdom and render it 
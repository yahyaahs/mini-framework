let element_id = 1;

class __Element {
    constructor(tag, attrs = {}, children = []) {
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.events = new Map();
        this.id = element_id;
        element_id++;

        Object.entries(this.attrs).forEach(([key, value]) => {
            if (key.startsWith('on') && typeof value === 'function') {
                this.registerEvent(key.substring(2).toLowerCase(), value);
                delete this.attrs[key];
            }
        });
    }

    registerEvent(name, func) {
        this.events.set(name, func);
    }

    toJSON() {
        return {
            tag: this.tag,
            attrs: { ...this.attrs, key: this.id },
            children: this.children.map(child =>
                typeof child === 'string' ? child : child.toJSON()
            ),
            events: Array.from(this.events.entries()).map(([name, func]) => {
                return {
                    name,
                    handler: func.toString()
                };
            })
        };
    }

    render() {
        if (typeof this.tag === 'function') {
            return this.tag(this.attrs, this.children);
        }

        const element = document.createElement(this.tag);

        Object.entries(this.attrs).forEach(([key, value]) => {
            if (value !== undefined) {
                element.setAttribute(key, value);
            }
        });

        this.events.forEach((handler, eventName) => {
            element.addEventListener(eventName, handler);
            element.setAttribute(`data-event-${eventName}`, true);
        });

        this.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                const childElement = child.render();
                if (childElement) {
                    element.appendChild(childElement);
                }
            }
        });

        return element;
    }

    renderToString() {
        if (typeof this.tag === 'function') {
            const result = this.tag(this.attrs, this.children);
            return result instanceof Element ? result.renderToString() : String(result);
        }

        let html = `<${this.tag}`;

        Object.entries(this.attrs).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                html += ` ${key}="${String(value).replace(/"/g, '&quot;')}"`;
            }
        });

        this.events.forEach((_, eventName) => {
            html += ` data-event-${eventName}="true"`;
        });

        html += '>';

        this.children.forEach(child => {
            if (typeof child === 'string') {
                html += child;
            } else {
                html += child.renderToString();
            }
        });

        html += `</${this.tag}>`;

        return html;
    }
}

function createElement(tag, attrs = {}, children = []) {
    return new __Element(tag, attrs, children);
}

export { __Element, createElement };
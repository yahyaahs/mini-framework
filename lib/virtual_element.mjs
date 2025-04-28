class __Element {
    constructor(tag, attrs = {}, children = [], vdom) {
        this._vdom = vdom
        this.tag = tag;
        this.attrs = attrs;
        this.children = children;
        this.events = new Map();
        this.key = vdom.keys;
        vdom.keys++;

        Object.entries(this.attrs).forEach(([key, value]) => {
            if (key.startsWith('on') && typeof value === 'function') {
                this.registerEvent(key.substring(2).toLowerCase(), value);
                delete this.attrs[key];
            }
        });
    }


    toggleClass(className) {
        const prevClasses = this.attrs.class || '';
        const classList = prevClasses.split(/\s+/);

        if (classList.includes(className)) {
            this.removeClass(className);
        } else {
            this.addClass(className);
        }
    }

    addClass(newClass) {
        const prevClasses = this.attrs.class || '';
        const classList = prevClasses.split(/\s+/);

        if (!classList.includes(newClass)) {
            this.attrs.class = prevClasses === '' ? newClass : `${prevClasses} ${newClass}`;
            this.updateAttrs();
        }
    }

    removeClass(toRemove) {
        const prevClasses = this.attrs.class || '';
        const pattern = new RegExp(`\\b${toRemove}\\b`, 'g');
        this.attrs.class = prevClasses.replace(pattern, '').replace(/\s+/g, ' ').trim();

        this.updateAttrs();
    }


    updateAttrs() {
        let htmlElem = document.querySelector(`[key="${this.key}"]`)
        if (!htmlElem) {
            htmlElem = document.querySelector(`[key="${this.attrs.key}"]`)
        }

        for (let [key, value] of Object.entries(this.attrs)) {
            if (value != htmlElem.getAttribute(key)) {
                htmlElem.setAttribute(key, value)
            }
        }
    }

    registerEvent(name, func) {
        this.events.set(name, func);
    }

    toJSON() {
        return {
            tag: this.tag,
            attrs: { ...this.attrs, key: this.key },
            children: this.children.map(child =>
                typeof child === 'string' ? child : child.toJSON()
            ),
            events: Array.from(this.events.entries()).map(([name, func]) => {
                return {
                    name,
                    handler: func
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
            if (value !== undefined && key !== 'key') {
                element.setAttribute(key, value);
            }
        });

        if (element.getAttribute('key') === null) {
            element.setAttribute('key', String(this.key))
        }

        this.events.forEach((handler, eventName) => {
            element.addEventListener(eventName, handler);
            element.setAttribute(`data-event-${eventName}`, true);
        });

        this.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                const childElement = child.render(10);
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

export { __Element };
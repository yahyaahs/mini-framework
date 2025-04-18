import { __Element } from "./virtual_element.mjs";

class __V_Dom {
    constructor(...elements) {
        this.elements = elements;
        this.state = new Map();
        this.stateUpdaters = new Map();
        this.rootElement = null;
        this.stateIndex = 0;
    }

    create() {
        return this.elements.map(elem => {
            return typeof elem === 'function' ? elem() : elem;
        });
    }

    render(container) {
        if (!container) {
            throw new Error("Container element is required for rendering");
        }

        container.innerHTML = '';

        const elements = this.create();
        elements.forEach(elem => {
            const domElement = elem.render();
            container.appendChild(domElement);
        });

        this.rootElement = container;

        return this;
    }

    reRender(id_compo) {
        const compo = document.querySelector(`#${id_compo}`)
        if (!compo) {
            throw new Error('finding an element without id reference')
        }
        const key = compo.getAttribute('key')
        const vCompo = this.findElementByDom(key)

        vCompo.children = [String(this.state.get(id_compo))]
        compo.innerHTML = String(this.state.get(id_compo))
    }


    hydrate(container, serverData) {
        if (!container) {
            throw new Error("Container element is required for hydration");
        }

        const { elements, initialState, eventHandlers } = serverData;
        console.log('get this data', elements, initialState, eventHandlers)

        if (initialState) {
            Object.entries(initialState).forEach(([key, value]) => {
                this.state.set(key, value);
            });
        }

        this.elements = elements.map(elemData => this.recreateElement(elemData));

        this.render(container);

        return this;
    }

    recreateElement(elemData) {
        if (typeof elemData === 'string') {
            return elemData;
        }

        const { tag, attrs, children, events } = elemData;

        const elem = new __Element(tag, attrs, children.map(child => this.recreateElement(child)));

        if (events) {
            events.forEach(({ name, handler }) => {
                const handlerFn = (e) => {
                    const stateFn = this.getState.bind(this);
                    const setStateFn = this.setState.bind(this);

                    const hydrated = eval(`(${handler})`);
                    hydrated(stateFn, setStateFn, e);
                };

                elem.registerEvent(name, handlerFn);
            });
        }

        return elem;
    }

    findElementByDom(key) {
        if (!key) {
            throw new Error("How can be create element without key ya wld l97ba");
        }
        const search = (elem) => {
            const elemKey = elem.attrs?.["key"];
            if (elemKey == key) {
                return elem;
            }

            if (Array.isArray(elem.children)) {
                for (const child of elem.children) {
                    const found = search(child);
                    if (found) return found;
                }
            }

            return null;
        }

        for (const elem of this.elements) {
            const found = search(elem);
            if (found) return found;
        }

        return null;
    }

    getState(key) {
        return this.state.get(key);
    }

    setState(key, value) {
        this.state.set(key, value);

        if (this.rootElement) {
            this.reRender(key);
        }
    }

    renderToString() {
        const elements = this.create();
        return elements.map(elem => elem.renderToString()).join('');
    }

    toJSON() {
        return {
            elements: this.elements.map(elem =>
                typeof elem === 'function' ? elem().toJSON() : elem.toJSON()
            ),
            initialState: Object.fromEntries(this.state),
        };
    }
}

function createComponent(...elements) {
    return new __V_Dom(...elements);
}

export { __V_Dom, createComponent }

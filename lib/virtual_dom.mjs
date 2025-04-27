import { __Element } from "./virtual_element.mjs";

class __V_Dom {
    constructor(...elements) {
        this.elements = elements;
        this.state = new Map();
        this.stateUpdaters = new Map();
        this.rootElement = null;
        this.stateIndex = 0;
    }

    createElement(tag, attrs = {}, children = []) {
        return new __Element(tag, attrs, children, this);
    }

    setElements(...elements) {
        this.elements = elements;
        return this
    }

    getElement(key, root = this.elements) {
        const search = (elem) => {
            elem.forEach(elem => {
                if (elem.key == key) return elem;

                if (elem.children.length > 0) {
                    search(elem)
                }
            })
        }

        search(root)
        return null
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

        const existKey = (elems, key) => {
            for (let i = 0; i < elems.length; i++) {
                if (elems[i].key == key) {
                    return true
                }
            }
            return false
        }

        const key = compo.getAttribute('key')
        const vCompo = this.findElementByDom(key)
        const state_Compo = this.state.get(id_compo)

        vCompo.children = (Array.isArray(state_Compo)) ? [...state_Compo] : [state_Compo];
        console.log('rendering');
        if (Array.isArray(state_Compo)) {
            state_Compo.forEach(elem => {
                if (compo.querySelector(`[key="${elem.key}"]`) === null) {
                    compo.appendChild(elem.render(true));
                }
            });

            Array.from(compo.children).forEach(child => {
                if (!existKey(state_Compo, child.getAttribute('key'))) {
                    compo.removeChild(child);
                }
            });
        } else if (typeof state_Compo !== "object") {
            compo.innerHTML = state_Compo;
        }
    }


    hydrate(container, serverData) {
        if (!container) {
            throw new Error("Container element is required for hydration");
        }

        const { elements, initialState, eventHandlers } = this.toJSON();
        console.log('hydrate this data', elements, initialState, eventHandlers)

        if (initialState) {
            Object.entries(initialState).forEach(([key, value]) => {
                this.state.set(key, value);
            });
        }

        this.elements = elements.map(elemData => this.recreateElement(elemData, serverData));
        return this.render(container);
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
                    handler(stateFn, setStateFn, e);
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
            if (elemKey == key || elem.key == key) {
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
        const current = this.state.get(key);
        return (current === undefined) ? [] : current;
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

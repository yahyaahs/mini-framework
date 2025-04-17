import { Link } from "../lib/hooks.mjs";
import { createComponent } from "../lib/virtual_dom.mjs"
import { createElement } from "../lib/virtual_element.mjs";

export default () => {
    const app = createComponent(
        createElement(...Link('/about', 'go to about')),
        createElement('div', { class: 'counter', style: 'margin-top: 80px; display: flex; flex-direction: column ;justify-content: center; align-items: center; height: 100%;' }, [
            createElement('h1', { style: 'text-align: center; size: 25px;' }, ["nigga-mind Mini-frameWork"]),
            createElement('h2', {}, ['Counter']),
            createElement('p', { id: 'count', style: "color: red;" }, ['0']),
            createElement('button', {
                style: "width: 100px; heigth: 20px; border: 2px solid black;",
                onClick: function (state, setState) {
                    console.log('boobled: ', state('count'));
                    setState('count', (state('count') || 0) + 1);
                }
            }, ['Increment']),
            createElement('p', { id: 'change_input' }, ['You are Typing: ']),
            createElement('input', {
                style: 'margin-top: 10px;',
                value: '',
                onKeydown: function (state, setState, e) {
                    console.log('input event fired', state('change_input'));
                    setState('change_input', (state('change_input') || '') + e.target.value);
                }
            })
        ])
    );

    app.state.set('count', 0);
    app.state.set('change_input', '');
    // app.eventRegistry.set('gg', () => {
    // const input = document.querySelector('.nigga')
    // return input.value
    // })

    return app;
}
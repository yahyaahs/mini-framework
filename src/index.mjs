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
                onClick: (state, setState) => {
                    console.log('boobled: ', state('count'));
                    setState('count', (state('count') || 0) + 1);
                }
            }, ['Increment']),
            createElement('p', {}, [
                'You are Typing: ',
                createElement('span', { id: 'change_input', style: 'color: red;' })]),
            createElement('input', {
                style: 'margin-top: 10px;',
                value: '',
                onKeydown: (state, setState, e) => {
                    setState('change_input', e.target.value);
                    console.log('input event fired', e.target.value, state('change_input'));
                }
            })
        ])
    );

    app.state.set('count', 0);
    app.state.set('change_input', '');

    return app;
}
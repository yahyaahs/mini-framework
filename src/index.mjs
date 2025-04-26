import { Link } from "../lib/hooks.mjs";
import { createComponent } from "../lib/virtual_dom.mjs"
import { createElement } from "../lib/virtual_element.mjs";

export default () => {
    const home = createComponent()

    home.state.set('_countRef', 0);
    home.state.set('_textRef', '');

    const increment = (state, setState) => {
        console.log('boobled: ', state('_countRef'));
        setState('_countRef', (state('_countRef') || 0) + 1);
    }

    const updateText = (state, setState, e) => {
        setState('_textRef', e.target.value);
        console.log('input event fired', state('_textRef'));
    }


    home.state.set('_heart');
    const heart = ['span', { class: 'heart', style: 'margin-left: 10px; color: red;' }, ['<3']]

    const addHeart = (state, setState) => {
        const prev = state('_heart');

        (prev === undefined) ?
            setState('_heart', [createElement(...heart)])
            : setState('_heart', [...prev, createElement(...heart)]);
    }

    const removeHeart = (state, setState) => {
        const prev = state('_heart');

        if (prev !== undefined) {
            const newi = [...prev].slice(1)
            setState('_heart', newi);
        }
    }

    return home.setElements(
        createElement(...Link('/about', 'go to about')),
        createElement(...Link('/test', 'go to test')),
        createElement('div', { class: 'counter', style: 'margin-top: 80px; display: flex; flex-direction: column ;justify-content: center; align-items: center; height: 100%;' }, [
            createElement('h1', { style: 'text-align: center; size: 25px;' }, ["nigga-mind Mini-frameWork"]),
            createElement('h2', {}, ['Counter']),
            createElement('p', { id: '_countRef', style: "color: red;" }, ['0']),
            createElement('button', { style: "width: 100px; heigth: 20px; border: 2px solid black;", onClick: increment }, ['Increment']),
            createElement('p', {}, ['You are Typing: ', createElement('span', { id: '_textRef', style: 'color: red;' })]),
            createElement('input', { style: 'margin: 10px;', value: '', onKeydown: updateText }),
            createElement('div', { class: 'new', style: 'display: flex;' }, [
                createElement('button', {
                    style: "width: 20px; heigth: 20px; border: 2px solid black;",
                    onClick: addHeart
                }, ['+']),
                createElement('div', { id: '_heart', class: 'chess' }),
                createElement('button', {
                    style: "width: 20px; heigth: 20px; border: 2px solid black;",
                    onclick: removeHeart,
                }, ['-']),
            ])
        ]))
}
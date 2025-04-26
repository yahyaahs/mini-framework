import { Link } from "../lib/hooks.mjs";
import { createComponent } from "../lib/virtual_dom.mjs"

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


    const breakHeart = (_, __, e) => {
        const target = home.findElementByDom(e.target.getAttribute('key'))
        target.toggleClass('dead')
    }

    home.state.set('_heart');

    const addHeart = (state, setState) => {
        const prev = state('_heart');

        const newHeart = home.createElement('span', {
            class: 'heart alive',
            onClick: (e) => breakHeart(state, setState, e),
        }, ['<3']);

        (prev === undefined) ?
            setState('_heart', [newHeart])
            : setState('_heart', [...prev, newHeart]);
    }

    const removeHeart = (state, setState) => {
        const prev = state('_heart');

        if (prev !== undefined) {
            const newi = [...prev].slice(1)
            setState('_heart', newi);
        }
    }

    return home.setElements(
        home.createElement(...Link('/about', 'go to about')),
        home.createElement(...Link('/test', 'go to test')),
        home.createElement('div', { class: 'counter', style: 'margin-top: 80px; display: flex; flex-direction: column ;justify-content: center; align-items: center; height: 100%;' }, [
            home.createElement('h1', { style: 'text-align: center; size: 25px;' }, ["nigga-mind Mini-frameWork"]),
            home.createElement('h2', {}, ['Counter']),
            home.createElement('p', { id: '_countRef', style: "color: red;" }, ['0']),
            home.createElement('button', { style: "width: 100px; heigth: 20px; border: 2px solid black;", onClick: increment }, ['Increment']),
            home.createElement('p', {}, ['You are Typing: ', home.createElement('span', { id: '_textRef', style: 'color: red;' })]),
            home.createElement('input', { style: 'margin: 10px;', value: '', onKeydown: updateText }),
            home.createElement('div', { class: 'new', style: 'display: flex;' }, [
                home.createElement('button', {
                    style: "width: 20px; heigth: 20px; border: 2px solid black;",
                    onClick: addHeart
                }, ['+']),
                home.createElement('div', { id: '_heart', class: 'chess' }),
                home.createElement('button', {
                    style: "width: 20px; heigth: 20px; border: 2px solid black;",
                    onclick: removeHeart,
                }, ['-']),
            ])
        ]))
}
import { Link } from "../lib/hooks.mjs"
import { createComponent } from "../lib/virtual_dom.mjs"

export default () => {
    const home = createComponent()

    home.state.set('_todos', [
        { task: 'task 1', isDone: false },
        { task: 'task 2', isDone: false },
        { task: 'task 3', isDone: false },
    ])

    const addNewTask = (state, setState, e) => {
        if (e.key === 'Enter') {
            console.log('submit', e.target.value);
            const prevTask = state('_todos')
            setState('_todos', [...prevTask, { task: e.target.value, isDone: false }])
        }
    }

    const markTask = () => { }

    const markAllTask = () => {
        console.log('all marked');
    }

    const removeTask = () => {
        console.log('try to remove task');
    }
    const removeAllTask = () => { }
    const updateTask = () => { }
    const taskBlure = () => { }
    const insertUpdatTask = () => { }

    return home.setElements(
        home.createElement('div', {}, [
            home.createElement('section', { class: 'todoapp' }, [
                home.createElement('header', { class: 'header' }, [
                    home.createElement('h1', {}, ['todos']),
                    home.createElement('input', {
                        type: 'text', maxlength: 50, placeholder: 'What needs to be done?',
                        class: 'new-todo',
                        onKeydown: addNewTask,
                    })
                ]),
                home.createElement('section', { class: 'main' }, [
                    home.createElement('label', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox', onClick: markAllTask }, []),
                    home.createElement('label', { for: 'toggle-all', }, ['Mark all as complete']),
                    home.createElement('ul', { id: '_todos', class: 'todo-list' },
                        home.getState('_todos').map((task) => {
                            return home.createElement('li', { class: '' }, [
                                home.createElement('div', { class: 'view' }, [
                                    home.createElement('input', { class: 'toggle', type: 'checkbox', onClick: markTask }, []),
                                    home.createElement('label', { onDblClick: updateTask, onBlur: taskBlure, onKeyDown: insertUpdatTask }, [task.task]),
                                    home.createElement('button', { class: 'destroy', onClick: removeTask }, []),
                                ]),
                            ])
                        })
                    )
                ]),
                home.createElement('footer', { class: 'footer' }, [
                    home.createElement('span', { class: 'todo-count' }, [
                        home.createElement('strong', {}, [`${home.getState('_todos').length} items left`])
                    ]),
                    home.createElement('ul', { class: 'filters' }, [
                        home.createElement('li', {}, [home.createElement(...Link('/', { class: 96 == "all" ? "selected" : "", }, 'All'))]),
                        home.createElement('li', {}, [home.createElement(...Link('/active', { class: 96 == "active" ? "selected" : "", }, 'Active'))]),
                        home.createElement('li', {}, [home.createElement(...Link('/completed', { class: 96 == "completed" ? "selected" : "", }, 'Completed'))]),
                    ]),
                    home.createElement('button', { class: 'clear-completed', onclick: removeAllTask }, ['Clear completed']),
                ]),
            ]),
            home.createElement('footer', { class: 'info' }, [
                home.createElement('p', {}, ["Double-click to edit a todo"]),
                home.createElement('p', {}, ["Created by the TodoMVC Team"]),
                home.createElement('p', {}, ["Part of ", home.createElement('a', { href: "http://todomvc.com" }, ["TodoMVC"]),])
            ])
        ])
    )
}
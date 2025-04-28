import { createComponent } from "../lib/virtual_dom.mjs"
import { Filter } from "./components/filter.mjs"
import { Footer } from "./components/footer.mjs"
import { Task } from "./components/task.mjs"

export default (prevCall) => {
    if (prevCall) {
        const tasks = prevCall.getState('_todos');
        tasks.forEach(task => task.removeClass('hidden'));
        return null
    }

    const home = createComponent()

    home.useState('_todos', [])
    home.useState('_taskCount', '0 items left')

    const addNewTask = (e) => {
        if (e.key === 'Enter' && e.target.value.length > 0) {
            const prevTask = home.getState('_todos');
            home.setState('_todos', [...prevTask, Task(home, { task: e.target.value, isDone: false })]);
            home.setState('_taskCount', `${home.getState('_todos').length} items left`)
            e.target.value = '';
        }
    }

    const markAllTask = () => { // ??
        const tasks = root.getState('_todos');
        for (let task of tasks) {
            task.addClass('completed');
        }
    }

    const clearDoneTask = () => {
        const tasks = home.getState('_todos');
        const newtasks = tasks.filter(t => !t.attrs.class.includes('completed'));
        home.setState('_todos', newtasks)
        home.setState('_taskCount', `${home.getState('_todos').length} items left`)

    }

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
                        home.getState('_todos').map((task) => Task(home, task))
                    )
                ]),
                home.createElement('footer', { class: 'footer' }, [
                    home.createElement('span', { class: 'todo-count' }, [
                        home.createElement('strong', { id: '_taskCount' }, [`0 items left`])
                    ]),
                    Filter(home),
                    home.createElement('button', { class: 'clear-completed', onclick: clearDoneTask }, ['Clear completed']),
                ]),
            ]),
            Footer(home)
        ])
    )
}
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

            const newTasks = home.getState('_todos');
            home.setState('_taskCount', `${newTasks.length} items left`)

            if (newTasks.length === 1) {
                const footer = home.selectElement('footer.footer');
                footer.removeClass('hidden');
            }

            e.target.value = '';
        }
    }

    let ischecked = false
    const markAllTask = (e) => { // ??
        console.log('mark all');
        ischecked = !ischecked;

        const tasks = home.getState('_todos');
        for (let task of tasks) {
            const checkbox = task.children[0].children[0];
            ischecked ? task.addClass('completed') : task.removeClass('completed');
            ischecked ? checkbox.addAttrs('checked',true) : checkbox.removeAttrs('checked');
        }
    }

    const clearDoneTask = () => {
        const tasks = home.getState('_todos');
        const newtasks = tasks.filter(t => !t.attrs.class.includes('completed'));
        home.setState('_todos', newtasks)
        home.setState('_taskCount', `${newtasks.length} items left`)
        if (newtasks.length === 0) {
            const footer = home.selectElement('footer.footer');
            footer.addClass('hidden');
        }
    }

    return home.setElements(
        home.createElement('div', {}, [
            home.createElement('section', { class: 'todoapp' }, [
                home.createElement('header', { class: 'header' }, [
                    home.createElement('h1', {}, ['todos']),
                    home.createElement('input', {
                        type: 'text', maxlength: 50, placeholder: 'What needs to be done?',
                        class: 'new-todo',
                        autofocus: true,
                        onKeydown: addNewTask,
                    })
                ]),
                home.createElement('section', { class: 'main' }, [
                    home.createElement('label', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox' }, []),
                    home.createElement('label', { for: 'toggle-all', onClick: markAllTask }, ['Mark all as complete']),
                    home.createElement('ul', { id: '_todos', class: 'todo-list' },
                        home.getState('_todos').map((task) => Task(home, task))
                    )
                ]),
                home.createElement('footer', { class: 'footer hidden' }, [
                    home.createElement('span', { class: 'todo-count' }, [
                        home.createElement('strong', { id: '_taskCount' }, [`0 items left`])
                    ]),
                    Filter(home),
                    home.createElement('button', { class: 'clear-completed', onClick: clearDoneTask }, ['Clear completed']),
                ]),
            ]),
            Footer(home)
        ])
    )
}
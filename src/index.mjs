import { createComponent } from "../dist/virtual_dom.mjs"
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

            const count = newTasks.filter(t => t.attrs.class.includes("completed")).length;
            home.setState('_taskCount', `${newTasks.length - count} items left`)

            if (newTasks.length === 1) {
                const mark_all = home.selectElement('label[for="toggle-all"]');
                mark_all.removeClass('hide-mark');
                const footer = home.selectElement('footer.footer');
                footer.removeClass('hidden');
            }

            e.target.value = '';
        }
    }

    const markAllTask = () => {
        if (location.pathname === '/completed') return;

        const tasks = home.getState('_todos');
        const toggelMark = tasks.every(t => t.attrs.class == "completed");

        for (let task of tasks) {
            if (toggelMark) {
                task.removeClass('completed');
                const checkbox = task.children[0].children[0].useRef();
                checkbox.checked = false;
            } else {
                task.addClass('completed');
                const checkbox = task.children[0].children[0].useRef();
                checkbox.checked = true;
            }
        }

        const count = tasks.filter(t => t.attrs.class.includes("completed")).length;
        home.setState('_taskCount', `${tasks.length - count} items left`)
    }

    const clearDoneTask = () => {
        const tasks = home.getState('_todos');
        const newtasks = tasks.filter(t => !t.attrs.class.includes('completed'));
        home.setState('_todos', newtasks)

        const count = newtasks.filter(t => t.attrs.class.includes("completed")).length;
        home.setState('_taskCount', `${newtasks.length - count} items left`)

        if (newtasks.length === 0) {
            const mark_all = home.selectElement('label[for="toggle-all"]');
            mark_all.addClass('hide-mark');
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
                        id: 'todo-input',
                        class: 'new-todo',
                        type: 'text', maxlength: 50, placeholder: 'What needs to be done?',
                        autofocus: true,
                        onKeydown: addNewTask,
                    })
                ]),
                home.createElement('section', { class: 'main' }, [
                    home.createElement('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox' }),
                    home.createElement('label', { for: 'toggle-all', class: 'hide-mark', onClick: markAllTask }),
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
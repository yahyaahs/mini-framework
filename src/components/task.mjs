const Task = (root, newTask) => {
    const markTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const task = tasks.find(t => t.key == taskKey);

        if (task) task.toggleClass('completed');
        if (location.pathname === '/active') task.toggleClass('hidden');
        if (location.pathname === '/completed') task.toggleClass('hidden');

        const mark_all = root.selectElement('#toggle-all');
        if (tasks.every(t => t.attrs.class == "completed")) {
            mark_all.useRef().checked = true;
        } else {
            mark_all.useRef().checked = false;
        }

        const activeCount = tasks.filter(t => !t.attrs.class.includes('completed')).length;
        root.setState('_taskCount', `${activeCount} items left`);
    }

    const removeTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const newtasks = tasks.filter(t => t.key != taskKey);

        root.setState('_todos', newtasks);

        const activeCount = newtasks.filter(t => !t.attrs.class.includes('completed')).length;
        root.setState('_taskCount', `${activeCount} items left`);

        if (newtasks.length === 0) {
            const mark_all = root.selectElement('label[for="toggle-all"]');
            mark_all.addClass('hide-mark');
            const footer = root.selectElement('footer.footer');
            footer.addClass('hidden');
        }
    }

    const updateTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const task = tasks.find(t => t.key == taskKey);

        task.addClass('editing');
        const newInput = task.children[1].children[0].useRef();
        newInput.value = e.target.textContent;
        newInput.focus();
    }

    const insertUpdatTask = (e) => {
        if (e.key === 'Enter' && e.target.value.length > 0) {
            const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
            if (!taskKey) return;

            const tasks = root.getState('_todos');
            const task = tasks.find(t => t.key == taskKey);

            root.setState(taskId, e.target.value)
            task.removeClass('editing')
            e.target.value = ''
        }
    }

    const giveUp = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const task = tasks.find(t => t.key == taskKey);

        task.removeClass('editing')
    }

    const taskId = `_taskN_${root.getKey()}`
    root.useState(taskId, newTask.task)

    let taskClass = newTask.isDone ? 'completed' : ''
    if (location.pathname === '/completed') taskClass += ' hidden';

    return root.createElement('li', { class: taskClass, key: taskId }, [ 
        root.createElement('div', { class: 'view' }, [
            root.createElement('input', { class: 'toggle', type: 'checkbox', onClick: markTask }, []),
            root.createElement('label', { id: taskId, onDblClick: updateTask }, [newTask.task]),
            root.createElement('button', { class: 'destroy', onClick: removeTask }, []),
        ]),
        root.createElement('div', { class: 'input-container' }, [
            root.createElement('input', {
                id: 'edit-todo-input', class: 'edit', type: 'text',
                onKeydown: insertUpdatTask,
                onBlur: giveUp
            }, []),
            root.createElement('label', { class: 'visually-hidden', for: 'edit-todo-input' }, ['Edit Todo Input']),
        ]),
    ])
}

export { Task };

const Task = (root, newTask) => {
    const markTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const task = tasks.find(t => t.key == taskKey);

        if (task) task.toggleClass('completed');
        if (location.pathname === '/active') task.toggleClass('hidden');
        if (location.pathname === '/completed') task.toggleClass('hidden');
    }

    const removeTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const newtasks = tasks.filter(t => t.key != taskKey);

        root.setState('_todos', newtasks)
        root.setState('_taskCount', `${newtasks.length} items left`)
        if (newtasks.length === 0) {
            const footer = root.selectElement('footer.footer');
            footer.addClass('hidden');
        }
    }

    const updateTask = () => {
        console.log('try to update');
    }

    const insertUpdatTask = () => {
        console.log('inserting new update');
    }

    let taskClass = newTask.isDone ? 'completed' : ''
    if (location.pathname === '/completed') taskClass += ' hidden';

    return root.createElement('li', { class: taskClass }, [
        root.createElement('div', { class: 'view' }, [
            root.createElement('input', { class: 'toggle', type: 'checkbox', onClick: markTask }, []),
            root.createElement('label', { onDblClick: updateTask, onKeyDown: insertUpdatTask }, [newTask.task]),
            root.createElement('button', { class: 'destroy', onClick: removeTask }, []),
        ]),
    ])
}

export { Task };
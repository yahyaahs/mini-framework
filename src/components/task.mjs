const Task = (root, newTask) => {
    const markTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const task = tasks.find(t => t.key == taskKey);

        if (task) task.toggleClass('completed');
    }

    const removeTask = (e) => {
        const taskKey = e.target.parentElement?.parentElement?.getAttribute('key');
        if (!taskKey) return;

        const tasks = root.getState('_todos');
        const newtasks = tasks.filter(t => t.key != taskKey);

        root.setState('_todos', newtasks)
    }

    const updateTask = () => {
        console.log('try to update');
    }

    const insertUpdatTask = () => {
        console.log('inserting new update');
    }

    return root.createElement('li', { class: newTask.isDone ? 'completed' : '' }, [
        root.createElement('div', { class: 'view' }, [
            root.createElement('input', { class: 'toggle', type: 'checkbox', onClick: markTask }, []),
            root.createElement('label', { onDblClick: updateTask, onKeyDown: insertUpdatTask }, [newTask.task]),
            root.createElement('button', { class: 'destroy', onClick: removeTask }, []),
        ]),
    ])
}

export { Task };
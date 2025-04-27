const Task = (root, newTask) => {
    const markTask = () => { }

    const updateTask = () => { }

    const insertUpdatTask = () => { }

    const removeTask = (state, setState, e) => {
        console.log('try to remove task');
        console.log(state, setState, e);
        console.log(state('_todos'));
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
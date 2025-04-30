import { Redirect } from "../dist/hooks.mjs";
import { __V_Server } from "../dist/main.mjs";

export default () => {
    const homeData = __V_Server.PrevApp.get('/')
    if (typeof homeData === 'undefined') {
        Redirect('/')
        return
    }

    const tasks = homeData.getState('_todos')
    for (let task of tasks) {
        (!task.attrs.class.includes('completed')) ? task.addClass('hidden') : task.removeClass('hidden');
    }
    return null;
}
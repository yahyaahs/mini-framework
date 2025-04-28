import { Redirect } from "../lib/hooks.mjs";
import { __V_Server } from "../lib/main.mjs";

export default () => {
    const homeData = __V_Server.PrevApp.get('/')
    if (typeof homeData === 'undefined') {
        Redirect('/')
        return
    }

    console.log('call data from active ',homeData);
    

    const tasks = homeData.getState('_todos')
    for (let task of tasks) {
        (task.attrs.class.includes('completed')) ? task.addClass('hidden') : task.removeClass('hidden');
    }
    return null
}
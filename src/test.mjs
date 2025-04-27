import { Redirect } from "../lib/hooks.mjs";
import { __V_Server } from "../lib/main.mjs";

export default () => {
    const homeData = __V_Server.PrevApp.get('/')
    if (typeof homeData === "undefined") {
        Redirect('/')
        return
    }

    console.log(homeData.state);
    return null
}
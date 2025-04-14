import { render } from './dom.js';

//routing 
class Router {
    constructor(routes) {
      this.routes = routes;
      window.addEventListener('popstate', () => this.handleRoute());
      this.handleRoute(); 
    }
  
    handleRoute() {
      const path = window.location.pathname;
      const route = this.routes.find(r => r.path === path);
      
      if (route) {
        const component = route.component();
        render(component, document.getElementById('app'));
      }
    }
  
    navigate(path) {
      window.history.pushState({}, '', path);
      this.handleRoute();
    }
  }

export { Router };
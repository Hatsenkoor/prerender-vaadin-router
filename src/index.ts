// Import stylesheets
import './style.css';
import {LitElement, html} from 'lit';
import { Router } from '@vaadin/router';
import routes from './routes.json';

class App extends LitElement {
  private _router: Router;

  constructor() {
    super();
  }

  firstUpdated() {
    const outlet = this.shadowRoot.getElementById('outlet');
    this._router = new Router(outlet);
    this._router.setRoutes(routes.routes);
  }

  render() {
    return html`
      <div style="margin-bottom: 50px;">
        <a href="/">Home</a>
        <a href="/project">Project</a>
        <a href="/organization">Organization</a>
      </div>
      <div id="outlet"></div>
    `;
  }
}

class Home extends LitElement {
  render() {
    return html`
      <div>
        <h1>Home</h1>
      </div>
    `;
  }
}

class Project extends LitElement {
  render() {
    return html`
      <div>
        <h1>Project</h1>
      </div>
    `;
  }
}

class Organization extends LitElement {
  render() {
    return html`
      <div>
        <h1>Organization</h1>
      </div>
    `;
  }
}

customElements.define('my-app', App);
customElements.define('my-home', Home);
customElements.define('my-project', Project);
customElements.define('my-organization', Organization);

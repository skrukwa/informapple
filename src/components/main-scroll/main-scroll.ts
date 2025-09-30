import styles from './main-scroll.css?inline';

class MainScroll extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>
            
            <div>
                <article-search-demo-component></article-search-demo-component>
                <footer-component></footer-component>
            </div>
            `
    }
}

customElements.define('main-scroll-component', MainScroll)

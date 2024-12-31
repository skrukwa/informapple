class MainScroll extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/main-scroll/main-scroll.css">
            
            <div>
                <article-search-demo-component></article-search-demo-component>
                <footer-component></footer-component>
            </div>
            `
    }
}

customElements.define('main-scroll-component', MainScroll)

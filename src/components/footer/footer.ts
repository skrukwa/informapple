class Footer extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/footer/footer.css">
            
            <footer class="dark-mode">&copy; Evan Skrukwa. All rights reserved. This website is not affiliated with Apple.</footer>
            `
    }
}

customElements.define('footer-component', Footer)

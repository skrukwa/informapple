import styles from './footer.css?inline';

class Footer extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>
            
            <footer class="dark-mode">&copy; Evan Skrukwa. All rights reserved. This website is not affiliated with Apple.</footer>
            `
    }
}

customElements.define('footer-component', Footer)

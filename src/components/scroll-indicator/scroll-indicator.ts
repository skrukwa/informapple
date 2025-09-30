import styles from './scroll-indicator.css?inline';

class ScrollIndicator extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            
            <div>
                <span>></span>
            </div>
            `
    }
}

customElements.define('scroll-indicator-component', ScrollIndicator)

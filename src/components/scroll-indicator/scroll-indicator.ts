class ScrollIndicator extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/components/scroll-indicator/scroll-indicator.css">
            
            <div>
                <span>></span>
            </div>
            `
    }
}

customElements.define('scroll-indicator-component', ScrollIndicator)

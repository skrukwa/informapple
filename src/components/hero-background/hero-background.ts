class HeroBackground extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/hero-background/hero-background.css">
            
            <video playsinline autoplay muted loop>
                <source src="media/hero-background.mp4" type="video/mp4">
            </video>
            `
    }
}

customElements.define('hero-background-component', HeroBackground)

import styles from './hero-background.css?inline';

class HeroBackground extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>
            
            <video playsinline autoplay muted loop>
                <source src="hero-background-compressed.h264.mp4" type="video/mp4">
            </video>
            `
    }
}

customElements.define('hero-background-component', HeroBackground)

class HeroContent extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/hero-content/hero-content.css">
            
            <main class="section-padding-with-header">
                <div>
                    <h1>welcome to<br><a class="inline" href="">informapple.ca</a></h1>
                    <h3>An analytical project classifying 8 years of top Apple news articles</h3>
                    <h4>Developed by <a class="inline" href="https://linkedin.com/in/skrukwa">Evan Skrukwa</a></h4>
                </div>
                <step-cards-component></step-cards-component>
            </main>
            `
    }
}

customElements.define('hero-content-component', HeroContent)

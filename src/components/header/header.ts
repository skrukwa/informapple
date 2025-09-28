class Header extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/header/header.css">
            
            <header id="header-light">
                <img alt="Informapple logo" src="media/logo.svg">
                <a class="inline" href="https://github.com/skrukwa/informapple">see the source code</a>
            </header>
                        
            <div id="header-dark-container">
                <header id="header-dark">
                    <img alt="Informapple logo" src="media/logo.svg">
                    <a class="inline" href="https://github.com/skrukwa/informapple">see the source code</a>
                </header>
                <div id="header-placeholder"></div>    
            </div>
            
            <header id="source-code-container">
                <img alt="Informapple logo" src="media/logo.svg">
                <a class="inline" href="https://github.com/skrukwa/informapple">see the source code</a>
            </header>
            `
    }
}

customElements.define('header-component', Header)

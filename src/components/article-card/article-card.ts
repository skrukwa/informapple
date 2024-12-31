class ArticleCard extends HTMLElement {

    private _darkColor: string
    private _lightColor: string
    private _label: string
    private _title: string
    private _body: string
    private _href: string

    static get observedAttributes() {
        return ['dark-color', 'light-color', 'label', 'title', 'body', 'href']
    }

    constructor() {
        super()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (!newValue) return

        switch (name) {
            case 'dark-color':
                this._darkColor = newValue
                break
            case 'light-color':
                this._lightColor = newValue
                break
            case 'label':
                this._label = newValue
                break
            case 'title':
                this._title = newValue
                break
            case 'body':
                this._body = newValue
                break
            case 'href':
                this._href = newValue
                break
        }

        this.removeAttribute(name)
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML =
            `
            <link rel="stylesheet" href="/components/article-card/article-card.css">
            
            <article>
                <span style="color: ${this._darkColor}; background-color: ${this._lightColor}">${this._label}</span>
                <h4>${this._title}</h4>
                <p>${this._body}</p>
                <a href="${this._href}" class="fill-div"></a>
            </article>
            `
    }
}

customElements.define('article-card-component', ArticleCard)
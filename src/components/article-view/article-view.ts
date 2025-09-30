import {fetchArticle} from '../../scripts/common'
import styles from './article-view.css?inline';

class ArticleView extends HTMLElement {

    constructor() {
        super()
    }

    async connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search)
        const monthParam = urlParams.get('m') as string
        const yearParam = urlParams.get('y') as string
        const articleParam = urlParams.get('a') as string
        const article = await fetchArticle(monthParam, yearParam, articleParam)

        document.title = `${article.title} - Informapple`

        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>

            <div class="section-padding" id="article-view-container">
                <div id="article-view-content">
                    <h2>${article.title}</h2>
                    <div id="grid-bar-graph"></div>
                    <p><a href="${article.url}">${this.cleanURL(article.url)}</a></p>
                    <p>${article.body.replace(/\n/g, '<br><br>')}</p>
                </div>
            </div>
            `

        const barGraph = this.shadowRoot.getElementById('grid-bar-graph')
        const firstValue = Object.values(article.labels)[0] as number
        for (const [label, confidence] of Object.entries(article.labels) as [string, number][]) {
            const rounded = (confidence * 100).toFixed(1)
            const scaled = (confidence / firstValue * 100).toFixed(1)

            barGraph.insertAdjacentHTML('beforeend',
                `
                <div class="grid-bar" style="width: min(calc(${scaled}% + 0.5rem), 100%)"></div>
                <span class="grid-value">${rounded}%</span>
                <span class="grid-label">${label}</span>
                `
            )
        }
    }

    private cleanURL(url: string): string {
        url = url.replace(/^https?:\/\//, '') // remove http:// or https://
        url = url.replace(/^www\./, '') // remove www.
        url = url.replace(/\?.*/, '') // remove ? and parameters
        url = url.replace(/\/$/, '') // remove trailing /
        return url
    }
}

customElements.define('article-view-component', ArticleView)
import { Article, Category, fetchArticle } from './common.js'

async function loadPage() {
    const urlParams = new URLSearchParams(window.location.search)
    const monthParam = urlParams.get('m') as string
    const yearParam = urlParams.get('y') as string
    const articleParam = urlParams.get('a') as string
    const article = await fetchArticle(monthParam, yearParam, articleParam)
    displayArticle(article)
}

function displayArticle(article: Article): void {
    const h2 = document.getElementById('h2') as HTMLHeadingElement
    const barGraph = document.getElementById('grid-bar-graph') as HTMLDivElement
    const a = document.getElementById('a') as HTMLAnchorElement
    const p = document.getElementById('p') as HTMLParagraphElement

    h2.innerHTML = article.title
    document.title = `${article.title} - Informapple`

    const firstValue = Object.values(article.labels)[0]
    for (const [label, confidence] of Object.entries(article.labels) as [Category, number][]) {
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

    a.href = article.url
    a.innerHTML = cleanURL(article.url)

    p.innerHTML = article.body.replace(/\n/g, '<br><br>')
}

function cleanURL(url: string): string {
    url = url.replace(/^https?:\/\//, '') // remove http:// or https://
    url = url.replace(/^www\./, '') // remove www.
    url = url.replace(/\?.*/, '') // remove ? and parameters
    url = url.replace(/\/$/, '') // remove trailing /
    return url
}

loadPage()

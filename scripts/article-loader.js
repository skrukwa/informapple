async function fetchArticle(monthCode, yearCode, articleCode) {
    const filePath = '/pyfiles/article_data/' + yearCode + '_' + monthCode + '.json'
    const response = await fetch(filePath)
    const json = await response.json()
    const article = json[articleCode]
    return article
}

async function onLoad() {
    const urlParams = new URLSearchParams(window.location.search)
    const monthCode = urlParams.get('m')
    const yearCode = urlParams.get('y')
    const articleCode = urlParams.get('a')

    const article = await fetchArticle(monthCode, yearCode, articleCode)
    updateDisplay(article)
}

function updateDisplay(article) {
    const h2 = document.getElementById('h2')
    const barGraph = document.getElementById('grid-bar-graph')
    const a = document.getElementById('a')
    const p = document.getElementById('p')

    h2.innerHTML = article.title

    const firstValue = Object.values(article.labels)[0]
    for (let label of Object.keys(article.labels)) {
        const rounded = (article.labels[label] * 100).toFixed(1)
        const scaled = (article.labels[label] / firstValue * 100).toFixed(1)

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

function cleanURL(url) {
    url = url.replace(/^https?:\/\//, '') // remove http:// or https://
    url = url.replace(/^www./, '') // remove www.
    url = url.replace(/\?.*/, '') // remove ? and parameters
    url = url.replace(/\/$/, '') // remove trailing /
    return url
}

onLoad()
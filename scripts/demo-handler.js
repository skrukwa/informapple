const months = new Map ([
    ['january', 1],
    ['february', 2],
    ['march', 3],
    ['april', 4],
    ['may', 5],
    ['june', 6],
    ['july', 7],
    ['august', 8],
    ['september', 9],
    ['october', 10],
    ['november', 11],
    ['december', 12]
])
const monthInputField = document.getElementById('month-field')
const yearInputField = document.getElementById('year-field')
const articleContainer = document.getElementById('articles-container')

// https://m2.material.io/design/color/the-color-system.html
// light colors are 200
// dark colors are 900
const blue = {light: '#90CAF9', dark: '#0D47A1'}
const teal = {light: '#80CBC4', dark: '#004D40'}
const brown = {light: '#BCAAA4', dark: '#3E2723'}
const lime = {light: '#E6EE9C', dark: '#827717'}
const pink = {light: '#F48FB1', dark: '#880E4F'}
const green = {light: '#A5D6A7', dark: '#1B5E20'}
const purple = {light: '#CE93D8', dark: '#4A148C'}
const orange = {light: '#FFCC80', dark: '#E65100'}
const customDarkGray = {light: '#626769', dark: '#080b0c'}

const colors = new Map ([
    ['mac computers', blue],
    ['iphone', blue],
    ['ipad', blue],
    ['apple watch', teal],
    ['airpods', teal],
    ['airtag', teal],
    ['apple tv or apple music', brown],
    ['employees', lime],
    ['leaks or rumours', pink],
    ['money or stock', green],
    ['software', purple],
    ['data privacy', orange],
    ['not sure', customDarkGray]
])

let currentMonth = null // (0 <= int <= 12) or null
let currentYear = null // (0 <= int) or null

monthInputField.addEventListener('keyup', () => {
    let input = monthInputField.value
    let month = toMonthInt(input)

    if (month !== currentMonth) {
        currentMonth = month
        updateDisplay()
    }
})

yearInputField.addEventListener('keyup', () => {
    let input = yearInputField.value
    let year = toYearInt(input)

    if (year !== currentYear) {
        currentYear = year
        updateDisplay()
    }
})

function toMonthInt(input) {
    // returns (0 <= int <= 12) or null

    input = input.toLowerCase()

    if (/^[0-9]+$/.test(input)) {
        // input is 1 or more numbers
        input = parseInt(input)
        if (1 <= input && input <= 12) {
            return input
        }
    } else if (/^[a-z]+$/.test(input)) {
        // input is 1 or more letters
        if (input.length >= 3) {
            for (const [month, num] of months) {
                if (month.startsWith(input)) {
                    return num
                }
            }
        }
    }
    return null
}

function toYearInt(input) {
    // returns (0 <= int) or null

    if (/^[0-9]+$/.test(input)) {
        // input is 1 or more numbers
        input = parseInt(input)
        return input
    }
    return null
}

function checkValidDate() {
    // assumes currentMonth and currentYear are not null

    if (2015 <= currentYear && currentYear <= 2022) {
        return true
    } else {
        return false
    }
}

function updateDisplay() {
    if (currentMonth === null || currentYear === null) {
        articleContainer.innerHTML = ''
    } else if (checkValidDate()) {
        articleContainer.innerHTML = ''
        updateArticles()
    } else {
        articleContainer.innerHTML = '<p>Dates start Jan 2015 and end Dec 2022.<br><br>Please update your search.</p>'
    }
}

async function updateArticles() {

    const currentMonthCode = currentMonth.toLocaleString(undefined, {minimumIntegerDigits: 2})
    const currentYearCode = currentYear

    const filePath = '/pyfiles/article_data/' + currentYearCode + '_' + currentMonthCode + '.json'
    const response = await fetch(filePath)
    const json = await response.json()
    
    for (let key of Object.keys(json)) {

        const article = json[key]

        let label = Object.keys(article.labels)[0]
        const confidence = article.labels[label]
        let displayLabel = `${label} (${Math.round(confidence * 100)}%)`

        if (confidence < 0.35) {
            label = 'not sure'
            displayLabel = 'not sure'
        }

        const lightColor = colors.get(label).light
        const darkColor = colors.get(label).dark
        const title = article.title
        const body = article.body
        const href = `/article?m=${currentMonthCode}&y=${currentYearCode}&a=${key}`

        articleContainer.insertAdjacentHTML('beforeend',
        `
        <article>
          <span style="color: ${darkColor}; background-color: ${lightColor}">${displayLabel}</span>
          <h4>${title}</h4>
          <p>${body}</p>
          <a href="${href}" class="fill-div"></a>
        </article>
        `
        )
    }
}
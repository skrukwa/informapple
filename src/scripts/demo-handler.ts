import { Category, fetchArticles } from './common.js'

type ButtonColor = {
    light: string
    dark: string
}

// https://m2.material.io/design/color/the-color-system.html
// light colors are 200
// dark colors are 900
const blue: ButtonColor = {light: '#90CAF9', dark: '#0D47A1'}
const teal: ButtonColor = {light: '#80CBC4', dark: '#004D40'}
const brown: ButtonColor = {light: '#BCAAA4', dark: '#3E2723'}
const lime: ButtonColor = {light: '#E6EE9C', dark: '#827717'}
const pink: ButtonColor = {light: '#F48FB1', dark: '#880E4F'}
const green: ButtonColor = {light: '#A5D6A7', dark: '#1B5E20'}
const purple: ButtonColor = {light: '#CE93D8', dark: '#4A148C'}
const orange: ButtonColor = {light: '#FFCC80', dark: '#E65100'}
const other: ButtonColor = {light: '#626769', dark: '#080b0c'}

const colors: Record<Category, ButtonColor> = {
    'mac computers': blue,
    'iphone': blue,
    'ipad': blue,
    'apple watch': teal,
    'airpods': teal,
    'airtag': teal,
    'apple tv or apple music': brown,
    'employees': lime,
    'leaks or rumours': pink,
    'money or stock': green,
    'software': purple,
    'data privacy': orange,
    'not sure': other
}

const months = new Map([
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

const monthInputField = document.getElementById('month-field') as HTMLInputElement
const yearInputField = document.getElementById('year-field') as HTMLInputElement
const articleContainer = document.getElementById('articles-container') as HTMLDivElement

let currentMonth: number | null = null // (1 <= int <= 12) or null
let currentYear: number | null = null // (0 <= int) or null

monthInputField.addEventListener('keyup', () => {
    const input = monthInputField.value
    const month = toMonthInt(input)
    if (month !== currentMonth) {
        currentMonth = month
        updateDemo()
    }
})

yearInputField.addEventListener('keyup', () => {
    const input = yearInputField.value
    const year = toYearInt(input)
    if (year !== currentYear) {
        currentYear = year
        updateDemo()
    }
})

function toMonthInt(input: string): number | null {
    // returns (1 <= int <= 12) or null

    input = input.toLowerCase()
    input = input.replace(/\s/g, '')

    if (/^[0-9]+$/.test(input)) {
        // input is 1 or more numbers
        const num = parseInt(input)
        if (1 <= num && num <= 12) {
            return num
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

function toYearInt(input: string): number | null {
    // returns (0 <= int) or null

    input = input.replace(/\s/g, '')
    
    if (/^[0-9]+$/.test(input)) {
        // input is 1 or more numbers
        return parseInt(input)
    }
    return null
}

function checkValidDate() {
    return currentMonth !== null && currentYear !== null && 2015 <= currentYear && currentYear <= 2022
}

function updateDemo() {
    if (currentMonth !== null && currentYear !== null) {
        if (checkValidDate()) {
            articleContainer.innerHTML = ''
            updateArticles()
            return
        }
    }
    
    articleContainer.innerHTML = '<p>Dates start Jan 2015 and end Dec 2022.<br><br>Please update your search.</p>'
}

async function updateArticles() {

    const monthParam = String(currentMonth).padStart(2, '0')
    const yearParam = String(currentYear)

    const articles = await fetchArticles(monthParam, yearParam)

    
    for (const articleParam in articles) {
        const article = articles[articleParam]

        let [label, confidence] = Object.entries(article.labels)[0] as [Category, number]
        let displayLabel = `${label} (${Math.round(confidence * 100)}%)`

        if (confidence < 0.35) {
            label = 'not sure'
            displayLabel = 'not sure'
        }

        const lightColor = colors[label].light
        const darkColor = colors[label].dark
        const title = article.title
        const body = article.body
        const href = `/article?m=${monthParam}&y=${yearParam}&a=${articleParam}`

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

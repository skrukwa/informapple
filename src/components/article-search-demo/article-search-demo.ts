import { Category, fetchArticles } from '../../scripts/common';
import styles from './article-search-demo.css?inline';

type ButtonColor = {
    light: string
    dark: string
}

class ArticleSearchDemo extends HTMLElement {

    private monthInput: HTMLInputElement | null = null
    private yearInput: HTMLInputElement | null = null
    private articleContainer: HTMLDivElement | null = null
    private currentMonth: number | null = null
    private currentYear: number | null = null

    private readonly blue: ButtonColor = {light: '#90CAF9', dark: '#0D47A1'}
    private readonly teal: ButtonColor = {light: '#80CBC4', dark: '#004D40'}
    private readonly brown: ButtonColor = {light: '#BCAAA4', dark: '#3E2723'}
    private readonly lime: ButtonColor = {light: '#E6EE9C', dark: '#827717'}
    private readonly pink: ButtonColor = {light: '#F48FB1', dark: '#880E4F'}
    private readonly green: ButtonColor = {light: '#A5D6A7', dark: '#1B5E20'}
    private readonly purple: ButtonColor = {light: '#CE93D8', dark: '#4A148C'}
    private readonly orange: ButtonColor = {light: '#FFCC80', dark: '#E65100'}
    private readonly other: ButtonColor = {light: '#626769', dark: '#080b0c'}

    private readonly colors: Record<Category, ButtonColor> = {
        'mac computers': this.blue,
        'iphone': this.blue,
        'ipad': this.blue,
        'apple watch': this.teal,
        'airpods': this.teal,
        'airtag': this.teal,
        'apple tv or apple music': this.brown,
        'employees': this.lime,
        'leaks or rumours': this.pink,
        'money or stock': this.green,
        'software': this.purple,
        'data privacy': this.orange,
        'not sure': this.other
    }

    private readonly months = new Map([
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

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>

            <div class="section-padding-with-header dark-mode" id="demo-container">
                <div id="date-selector-container">
                    <h2>Top 25 Apple articles for</h2>
                    <form autocomplete="off">
                        <div class="text-input-div">
                            <input type="text" class="dark-mode" id="month-field" placeholder="">
                            <label for="month-field">Month</label>
                        </div>
                        <div class="text-input-div">
                            <input type="text" class="dark-mode" id="year-field" placeholder="">
                            <label for="year-field">Year</label>
                        </div>
                    </form>
                </div>
                <div id="articles-container">
                    <!--article-card-component>...</article-card-component-->
                </div>
            </div>
            `
        this.setupElements()
        this.setupEventListeners()
    }

    private setupElements() {

        this.monthInput = this.shadowRoot.querySelector('#month-field')
        this.yearInput = this.shadowRoot.querySelector('#year-field')
        this.articleContainer = this.shadowRoot.querySelector('#articles-container')
    }

    private setupEventListeners() {

        this.monthInput.addEventListener('keyup', () => {
            const month = this.toMonthInt(this.monthInput?.value || '')
            if (month !== this.currentMonth) {
                this.currentMonth = month
                this.updateDemo()
            }
        })

        this.yearInput.addEventListener('keyup', () => {
            const year = this.toYearInt(this.yearInput?.value || '')
            if (year !== this.currentYear) {
                this.currentYear = year
                this.updateDemo()
            }
        })
    }

    private toMonthInt(input: string): number | null {
        // returns (1 <= int <= 12) or null

        input = input.toLowerCase()
        input = input.replace(/\s/g, '')  // remove whitespace

        if (/^[0-9]+$/.test(input)) {
            // input is 1 or more numbers
            const num = parseInt(input)
            if (1 <= num && num <= 12) {
                return num
            }
        } else if (/^[a-z]+$/.test(input)) {
            // input is 1 or more letters
            if (input.length >= 3) {
                for (const [month, num] of this.months) {
                    if (month.startsWith(input)) {
                        return num
                    }
                }
            }
        }
        return null
    }

    private toYearInt(input: string): number | null {
        // returns (0 <= int) or null

        input = input.replace(/\s/g, '')  // remove whitespace

        if (/^[0-9]+$/.test(input)) {
            // input is 1 or more numbers
            return parseInt(input)
        }
        return null
    }

    private checkValidDate(): boolean {
        return this.currentMonth !== null &&
            this.currentYear !== null &&
            2015 <= this.currentYear &&
            this.currentYear <= 2022
    }

    private updateDemo() {

        if (this.currentMonth !== null && this.currentYear !== null) {
            if (this.checkValidDate()) {
                this.articleContainer.innerHTML = ''
                this.updateArticles()
                return
            }
        }

        this.articleContainer.innerHTML =
            '<p>Dates start Jan 2015 and end Dec 2022.<br><br>Please update your search.</p>'
    }

    private async updateArticles() {

        const monthParam = String(this.currentMonth).padStart(2, '0')
        const yearParam = String(this.currentYear)

        const articles = await fetchArticles(monthParam, yearParam)

        for (const articleParam in articles) {
            const article = articles[articleParam]
            let [label, confidence] = Object.entries(article.labels)[0] as [Category, number]
            let displayLabel = `${label} (${Math.round(confidence * 100)}%)`

            if (confidence < 0.35) {
                label = 'not sure'
                displayLabel = 'not sure'
            }

            const lightColor = this.colors[label].light
            const darkColor = this.colors[label].dark
            const title = article.title
            const body = article.body
            const href = `/article?m=${monthParam}&y=${yearParam}&a=${articleParam}`

            const card = document.createElement('article-card-component')
            card.setAttribute('dark-color', darkColor)
            card.setAttribute('light-color', lightColor)
            card.setAttribute('label', displayLabel)
            card.setAttribute('title', title)
            card.setAttribute('body', body)
            card.setAttribute('href', href)

            this.articleContainer.appendChild(card)
        }
    }
}

customElements.define('article-search-demo-component', ArticleSearchDemo)
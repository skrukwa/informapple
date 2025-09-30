import styles from './step-cards.css?inline';

class StepCards extends HTMLElement {

    constructor() {
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})

        const htmlContent =
            `
            <style>${styles}</style>
            
            <figure>
                <div class="step-card" id="step-card-1">
                    <p class="step-card-header" id="step-card-header-1">Step 1</p>
                    <div class="step-card-inner" id="step-card-inner-1">
                        <div class="prompt-wrapper">
                            <span>></span>
                            <p>parse roughly 490GB of open-source Zstandard compressed Reddit archives</p>
                        </div>
                        <div class="prompt-wrapper">
                            <span>></span>
                            <p>use <a class="inline" href="https://github.com/praw-dev/praw">PRAW</a> to sort those submissions by current upvote status</p>
                        </div>
                    </div>
                </div>
                <div class="step-card" id="step-card-2">
                    <p class="step-card-header" id="step-card-header-2">Step 2</p>
                    <div class="step-card-inner" id="step-card-inner-2">
                        <div class="prompt-wrapper">
                            <span>></span>
                            <p>scrape contents of external articles found in the most popular Reddit submissions</p>
                        </div>
                    </div>
                </div>
                <div class="step-card" id="step-card-3">
                    <p class="step-card-header" id="step-card-header-3">Step 3</p>
                    <div class="step-card-inner" id="step-card-inner-3">
                        <div class="prompt-wrapper">
                            <span>></span>
                            <p>classify each article header from 12 possible labels using Meta's BART-based zero-shot text classification <a class="inline" href="https://huggingface.co/facebook/bart-large-mnli">model</a></p>
                        </div>
                    </div>
                </div>
            </figure>
            `
        this.shadowRoot.innerHTML = htmlContent
    }
}

customElements.define('step-cards-component', StepCards)

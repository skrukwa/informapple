import styles from './lvh.css?inline';

class LVH extends HTMLElement {

    private lvh100: HTMLElement | null
    private lvh: number
    private readonly boundLvhHandler: (this: Window, ev: UIEvent) => any

    constructor() {
        super()
        this.boundLvhHandler = this.lvhHandler.bind(this)
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML =
            `
            <style>${styles}</style>

            <div id="lvh100"></div>
            `
        this.lvh100 = this.shadowRoot.getElementById('lvh100')
        this.lvh = this.lvh100.offsetHeight / 100
        window.addEventListener('resize', this.boundLvhHandler)
    }

    private onMobile() {
        const mobileWidth = (window.innerWidth <= 750)
        const mobileAspectRatio = ((window.innerWidth / window.innerHeight) <= 3 / 4)
        return mobileWidth && mobileAspectRatio
    }

    private updateLvh() {
        if (this.lvh100.offsetHeight / 100 > this.lvh) {
            this.lvh = this.lvh100.offsetHeight / 100
            document.documentElement.style.setProperty('--lvh', this.lvh + 'px')
        }
    }

    private lvhHandler() {
        if (this.onMobile()) {
            this.updateLvh()
        } else {
            document.documentElement.style.setProperty('--lvh', '1lvh')
            this.lvh = this.lvh100.offsetHeight / 100
        }
    }
}

customElements.define('lvh-component', LVH)

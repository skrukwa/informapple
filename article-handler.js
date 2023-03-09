const months = {
    "january": "01",
    "february": "02",
    "march": "03",
    "april": "04",
    "may": "05",
    "june": "06",
    "july": "07",
    "august": "08",
    "september": "09",
    "october": "10",
    "november": "11",
    "december": "12"
}
const iterableMonths = Object.entries(months)
const monthInputField = document.getElementById("month-field")
const yearInputField = document.getElementById("year-field")
const articleContainer = document.getElementById("articles-container")

var currentMonthCode = null
var currentYearCode = null
var currentFile = null

monthInputField.addEventListener("keyup", (event) => {
    var input = monthInputField.value
    var result = toMonthCode(input)
    if (result != null) {
        currentMonthCode = result
        if (currentYearCode != null) {checkValid()}
    } else {clear()}
})

yearInputField.addEventListener("keyup", (event) => {
    var input = yearInputField.value
    if (input.length == 4 && !isNaN(input) == true) {
        currentYearCode = input
        if (currentMonthCode != null) {checkValid()}
    } else {clear()}
})

function toMonthCode(input) {


    input = input.toLowerCase()
    for (let [key, value] of Object.entries(months)) {
        if (key.startsWith(input) && input.length >= 3) {
            return value
        }
    }
    return null
}

function checkValid() {
    if ((currentYearCode < 2015) ||
        (currentYearCode == 2022 && Number(currentMonthCode) >= 7) ||
        (currentYearCode > 2022)) {
        clear()
        articleContainer.innerHTML = '<h4>Dates start Jan 2015 and end June 2022. Please update your search.</h4>'
        return null
    } else {
        getJSON()
    }
}

function getJSON() {
    currentFile = "pyfiles/article_data/" + currentYearCode + "_" + currentMonthCode + ".json"
    fetch(currentFile)
    .then((response) => response.json())
    .then((json) => updateArticles(json));
}

function updateArticles(json) {
    clear()
    let iterableJSON = Object.keys(json)
    for (let key of iterableJSON) {
        articleContainer.insertAdjacentHTML("beforeend",
        `
        <div class="article">
          <h3>${json[key]["title"]}</h3>
          <h4>${json[key]["body"]}</h4>
          <div class="green-bar" style="height: calc(${(json[key]["sentiment"] + 1) / 0.02}% - 0.5px)"></div>
          <div class="red-bar" style="height: calc(${100 - (json[key]["sentiment"] + 1) / 0.02}% - 0.5px)"></div>
          <a href=${currentFile} class="fill-div"></a>
        </div>
        `
        )
      }
}

function clear() {
    articleContainer.innerHTML = ''
}
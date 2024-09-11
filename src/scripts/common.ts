export type Article = {
    title: string
    body: string
    url: string
    labels: Record<Category, number>
}

export type Category =
    | 'mac computers'
    | 'iphone'
    | 'ipad'
    | 'apple watch'
    | 'airpods'
    | 'airtag'
    | 'apple tv or apple music'
    | 'employees'
    | 'leaks or rumours'
    | 'money or stock'
    | 'software'
    | 'data privacy'
    | 'not sure'

export async function fetchArticle(monthParam: string, yearParam: string, articleParam: string): Promise<Article> {
    const articles = await fetchArticles(monthParam, yearParam)
    return articles[articleParam]
}

export async function fetchArticles(monthParam: string, yearParam: string): Promise<Record<string, Article>> {
    const filePath = `article_data/${yearParam}_${monthParam}.json`
    const response = await fetch(filePath)
    return await response.json()
}

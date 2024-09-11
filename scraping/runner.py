"""
----------Objectives----------
Create a JSON output for a given ZST archive.
"""
import json

import article_scraper
import reddit_submissions
import text_classification


def run_on_archive(subreddit: str, input_archive_file: str, output_json_file: str, labels: list[str]) -> None:
    submissions = reddit_submissions.get_submissions(input_archive_file, subreddit)
    cleaned = reddit_submissions.get_url_submissions(submissions)
    ordered = reddit_submissions.sort_submissions(cleaned)
    scraped = article_scraper.scrape_top_25_articles(ordered)
    labeled = text_classification.classify_headlines(scraped, labels)

    json_dict = {}
    for index, submission in enumerate(labeled):
        json_dict[f'article_{index}'] = {
            'title': submission.archive['title'],
            'body': submission.newsplease.maintext,
            'url': submission.archive['url'],
            'labels': submission.labels
        }

    with open(output_json_file, 'w') as file:
        json.dump(json_dict, file, indent=4)


if __name__ == '__main__':

    SUBREDDIT = 'apple'
    INPUT_ARCHIVE_FILE = 'RS_2022-12.zst'
    OUTPUT_JSON_FILE = 'out/2022_12.json'
    LABELS = [
        'mac computers',
        'iphone',
        'ipad',
        'apple watch',
        'airpods',
        'airtag',
        'apple tv or apple music',
        'employees',
        'leaks or rumours',
        'money or stock',
        'software',
        'data privacy'
    ]

    run_on_archive(SUBREDDIT, INPUT_ARCHIVE_FILE, OUTPUT_JSON_FILE, LABELS)

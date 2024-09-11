# Informappple
Informapple has been a personal project that I have had with me since April 3, 2015, when I registered the domain. For the first few years of its life, it was a [WordPress](https://wordpress.com) blog with some custom graphics and content I wrote. I learned the basics of [Google AdSense](https://adsense.google.com/start) and [Google Analytics](https://developers.google.com/analytics) among other things. Now, Informapple has been fully revitalized from scratch to become an interactive, unique, and valuable custom project.

# Front End
The website was written using pure HTML, CSS, and TypeScript. In fact, the files you see above are the files that run the website, as the website is hosted by [Github Pages](https://pages.github.com). The front end is built and deployed using [Github Actions](https://docs.github.com/en/actions) to compile the TypeScript and deploy the build artifact.

# Data Scraping
All data processing, scraping, and classifying was done using Python. Initially, roughly 490GB of open-source Zstandard compressed archive files of all Reddit posts were used to find popular Apple-related news for a given month. Those articles were then retrieved from the web, and finally, were categorized using [Meta's BART-based zero-shot text classification model](https://huggingface.co/facebook/bart-large-mnli).

These Reddit archive files exist as a byproduct of the Pushshift API which has been affected by [Reddit's API changes](https://en.wikipedia.org/wiki/2023_Reddit_API_controversy).

The file structure consists of the following:
* **reddit_submissions.py**
Responsible for reading Reddit submissions from Zstandard compressed archive files, and then using the [Python Reddit API Wrapper](https://github.com/praw-dev/praw) to sort those submissions by *current* upvote status.
* **article_scraper.py**
Responsible for scraping the contents of external articles found in the most popular Reddit submissions. This is done using the [news-please](https://github.com/fhamborg/news-please) library.
* **text_classification.py**
Responsible for classifying each article header from 12 possible labels. This is done using [Meta's BART-based zero-shot text classification model](https://huggingface.co/facebook/bart-large-mnli).
* **exception_subclasses.py**
Responsible for creating custom error classes that inherit from `Exception` to be used in other files for better error handling.
* **object_subclasses.py**
Responsible for creating custom classes to be used in other files.
* **runner.py**
Responsible for calling the relevant functions from the other modules with the appropriate file paths and data.

# `runner.py` Example Output
(Line breaks added for ease of viewing.)
```
uncompressing zst file: 100%|██████████| 10439494623/10439494623 [14:59<00:00, 11607196.89it/s]

INFO:reddit_submissions:cleaning submissions
INFO:reddit_submissions:submissions cleaned

INFO:reddit_submissions:trying to get scores from reddit_info_generator
INFO:reddit_submissions:successfully got scores from reddit_info_generator

INFO:article_scraper:trying to scrape article at index 0
INFO:article_scraper:successful scrape at index 0
INFO:article_scraper:trying to scrape article at index 1
INFO:article_scraper:successful scrape at index 1
INFO:article_scraper:trying to scrape article at index 2
INFO:article_scraper:successful scrape at index 2
INFO:article_scraper:trying to scrape article at index 3
INFO:article_scraper:successful scrape at index 3
INFO:article_scraper:trying to scrape article at index 4
INFO:article_scraper:successful scrape at index 4
INFO:article_scraper:trying to scrape article at index 5
INFO:article_scrapper:failed scrape at index 5 due to article maintext was less than 30 characters
INFO:article_scraper:trying to scrape article at index 6
INFO:article_scraper:successful scrape at index 6
INFO:article_scraper:trying to scrape article at index 7
INFO:article_scraper:successful scrape at index 7
INFO:article_scraper:trying to scrape article at index 8
INFO:article_scraper:successful scrape at index 8
INFO:article_scraper:trying to scrape article at index 9
INFO:article_scraper:successful scrape at index 9
INFO:article_scraper:trying to scrape article at index 10
INFO:article_scraper:successful scrape at index 10
INFO:article_scraper:trying to scrape article at index 11
INFO:article_scraper:successful scrape at index 11
INFO:article_scraper:trying to scrape article at index 12
INFO:article_scraper:successful scrape at index 12
INFO:article_scraper:trying to scrape article at index 13
INFO:article_scraper:successful scrape at index 13
INFO:article_scraper:trying to scrape article at index 14
INFO:article_scraper:successful scrape at index 14
INFO:article_scraper:trying to scrape article at index 15
INFO:article_scraper:successful scrape at index 15
INFO:article_scraper:trying to scrape article at index 16
INFO:article_scraper:failed scrape at index 16 due to object of type 'NoneType' has no len()
INFO:article_scraper:trying to scrape article at index 17
INFO:article_scraper:successful scrape at index 17
INFO:article_scraper:trying to scrape article at index 18
INFO:article_scraper:successful scrape at index 18
INFO:article_scraper:trying to scrape article at index 19
INFO:article_scraper:failed scrape at index 19 due to object of type 'NoneType' has no len()
INFO:article_scraper:trying to scrape article at index 20
INFO:article_scraper:successful scrape at index 20
INFO:article_scraper:trying to scrape article at index 21
INFO:article_scraper:successful scrape at index 21
INFO:article_scraper:trying to scrape article at index 22
INFO:article_scraper:successful scrape at index 22
INFO:article_scraper:trying to scrape article at index 23
INFO:article_scraper:successful scrape at index 23
INFO:article_scraper:trying to scrape article at index 24
INFO:article_scraper:successful scrape at index 24
INFO:article_scraper:trying to scrape article at index 25
INFO:article_scraper:successful scrape at index 25
INFO:article_scraper:trying to scrape article at index 26
INFO:article_scraper:successful scrape at index 26
INFO:article_scraper:trying to scrape article at index 27
INFO:article_scraper:successful scrape at index 27

classifying headlines: 100%|██████████| 25/25 [00:52<00:00,  2.10s/it]

Process finished with exit code 0
```

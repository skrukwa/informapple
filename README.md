# Informappple
Informapple has been a personal project that I have had with me since April 3, 2015, when I regestered the domain. For the first chapter of its life, it was as WordPress blog with some custom graphics and content made by me ([Evan Skrukwa](https://www.linkedin.com/in/evan-skrukwa/)). Now, it has been fully revitalized from scratch to become an interactive, unique, and valuable custom project.

# Front End
The website was written using pure HTML, CSS, and JS. In fact, the files you see above are the files that run the website, as the website is hosted by this [Github page](https://pages.github.com/) itself.

# Back End
The back end is written in Python, all of which you can view above. The file structure consistes of the following:
* **requester.py**
Responsible for making requests to APIs with request timeouts supported by multi-threaded opperation and multiple failed attempts. Uses the builtin libraries `requests`, `signal`, and `logging`.
* **reddit_scrapper.py**
Responsible for gathering all Reddit posts in a given time period, from a given subreddit, sorted by upvotes, as well as filtering out unwanted posts (those that do not link to external articles). This is done by first using the [pushshift API](https://www.reddit.com/r/pushshift/) in chucks of size 1000 until all desired posts have been retrieved, and then using [Python Reddit API Wrapper](https://github.com/praw-dev/praw) to sort those posts by *current* upvote status. Uses the builtin libraries `datetime`, `time`, and `logging`.
* **article_scrapper.py**
Responsible for scraping the contents of external articles found in the most popular Reddit posts. This is mainly done using [news-please](https://github.com/fhamborg/news-please) which I like to think of as a more built out version of [newspaper](https://github.com/codelucas/newspaper). Uses the builtin libraries `time` and `logging`.
* **article_sentiment_classifier.py**
Responsible for classifying the sentiment of an article content. This is done by splitting the article into sentences, and then either using [NewsMTSC](https://github.com/fhamborg/NewsMTSC) if a target (ex. Apple) can be isolated (prefered method), or using [FlairNLP](https://github.com/flairNLP/flair) otherwise. Uses the builtin libraries `re`, `statistics`, and `logging`.
* **exception_subclasses.py**
Responsible for creating custom error classes that inheriet from `Exception` to be used in other files for better error handeling.

# Installation
If you would like to try running the script yourself (i.e. using **example_runner.py**), as of January 2023, I would reccomend having a Python 3.7 `venv` as that is what `flair` officially supports. However, you will then have to use a constraint (`pip install -c`) when installing `NewsSentiment`. Finally, you *may* need to `pip install pydantic==1.10.2` or some other version if you run into errors created by the prior constraint install.

# Sample `example_runner.py` Output
(Line breaks added for ease of viewing.)
```
loading file /Users/evanskrukwa/.flair/models/sentiment-en-mix-distillbert_4.pt

INFO:requester:trying a request (try 1)
INFO:requester:request completed
INFO:requester:trying a request (try 1)
INFO:requester:request completed
INFO:requester:trying a request (try 1)
INFO:requester:request completed
INFO:requester:trying a request (try 1)
INFO:requester:request completed

INFO:reddit_scrapper:trying to get scores from reddit_info_generator
INFO:reddit_scrapper:successfully got scores from reddit_info_generator

INFO:article_scrapper:trying to scrape article at index 0
INFO:article_scrapper:successful scrape at index 0
INFO:article_scrapper:trying to scrape article at index 1
INFO:article_scrapper:failed scrape at index 1 due to article maintext was less than 30 characters
INFO:article_scrapper:trying to scrape article at index 2
INFO:article_scrapper:successful scrape at index 2
INFO:article_scrapper:trying to scrape article at index 3
INFO:article_scrapper:successful scrape at index 3
INFO:article_scrapper:trying to scrape article at index 4
INFO:article_scrapper:successful scrape at index 4
INFO:article_scrapper:trying to scrape article at index 5
INFO:article_scrapper:successful scrape at index 5
INFO:article_scrapper:trying to scrape article at index 6
INFO:article_scrapper:successful scrape at index 6
INFO:article_scrapper:trying to scrape article at index 7
INFO:article_scrapper:successful scrape at index 7
INFO:article_scrapper:trying to scrape article at index 8
INFO:article_scrapper:successful scrape at index 8
INFO:article_scrapper:trying to scrape article at index 9
INFO:article_scrapper:successful scrape at index 9
INFO:article_scrapper:trying to scrape article at index 10
INFO:article_scrapper:successful scrape at index 10
INFO:article_scrapper:trying to scrape article at index 11
INFO:article_scrapper:successful scrape at index 11
INFO:article_scrapper:trying to scrape article at index 12
INFO:article_scrapper:successful scrape at index 12
INFO:article_scrapper:trying to scrape article at index 13
INFO:article_scrapper:successful scrape at index 13
INFO:article_scrapper:trying to scrape article at index 14
INFO:article_scrapper:successful scrape at index 14
INFO:article_scrapper:trying to scrape article at index 15
INFO:article_scrapper:successful scrape at index 15
INFO:article_scrapper:trying to scrape article at index 16
INFO:article_scrapper:successful scrape at index 16
INFO:article_scrapper:trying to scrape article at index 17
INFO:article_scrapper:successful scrape at index 17
INFO:article_scrapper:trying to scrape article at index 18
INFO:article_scrapper:successful scrape at index 18
INFO:article_scrapper:trying to scrape article at index 19
INFO:article_scrapper:successful scrape at index 19
INFO:article_scrapper:trying to scrape article at index 20
INFO:article_scrapper:successful scrape at index 20
INFO:article_scrapper:trying to scrape article at index 21
INFO:article_scrapper:successful scrape at index 21
INFO:article_scrapper:trying to scrape article at index 22
INFO:article_scrapper:successful scrape at index 22
INFO:article_scrapper:trying to scrape article at index 23
INFO:article_scrapper:successful scrape at index 23
INFO:article_scrapper:trying to scrape article at index 24
INFO:article_scrapper:successful scrape at index 24
INFO:article_scrapper:trying to scrape article at index 25
INFO:article_scrapper:successful scrape at index 25

INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using FlairNLP
<478 lines collapsed>
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP
INFO:article_sentiment_classifier:using NewsMTSC
INFO:article_sentiment_classifier:using FlairNLP

Process finished with exit code 0
```

from __future__ import annotations
"""
----------Objectives----------
1. Scrape content of articles.

----------Resources used----------
For using the newsplease library:
https://github.com/fhamborg/news-please
"""
from exception_subclasses import MaintextTooShort

from newsplease import NewsPlease
import time

import logging
logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def scrape_top_25_articles(submissions: list[dict]) -> list[dict]:
    """
    Return a list of the first 25 items of submissions with a new key, newsplease.
    Now, each of dicts has 3 keys:
    - score: the karma of the post
    - pushshift: the original submission dict from the pushshift API
    - newsplease: NewsArticle.NewsArticle object
    """
    index = 0
    results = []
    while len(results) < 25:
        if index != 0:
            time.sleep(6)
        link = submissions[index]['pushshift']['url']

        LOGGER.info('trying to scrape article at index %s' % index)
        try:
            article = NewsPlease.from_url(link, timeout=10)
            if len(article.maintext) > 250 and all({'porn' not in article.maintext,
                                                    'sex' not in article.maintext,
                                                    'domain on sale' not in article.maintext}):
                LOGGER.info('successful scrape at index %s' % index)
                results.append(
                    {'score': submissions[index]['score'],
                     'pushshift': submissions[index]['pushshift'],
                     'newsplease': article}
                )
            else:
                raise MaintextTooShort
        except Exception as e:
            LOGGER.info('failed scrape at index %s due to %s' % (index, e))
        index += 1
    return results

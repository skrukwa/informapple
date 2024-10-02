"""
Scrape content of articles.

See also:
https://github.com/fhamborg/news-please
"""
import logging
import time

from newsplease import NewsPlease

from exception_subclasses import *
from object_subclasses import *

logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def scrape_top_25_articles(submissions: list[Submission]) -> list[Submission]:
    """
    Return a new list of the first 25 successfully scraped Submission objects
    where each object is assigned a newsplease attribute.

    No new Submission objects are created.

    Assumes submissions are sorted in descending order by score.
    """
    content_blacklist = {'porn',
                         'sex',
                         'domain on sale'}
    index = 0
    results = []
    while len(results) < 25:
        if index != 0:
            time.sleep(6)
        link = submissions[index].archive['url']

        LOGGER.info('trying to scrape article at index %s' % index)
        try:
            article = NewsPlease.from_url(link, timeout=10)

            if len(article.maintext) < 250:
                raise MaintextTooShort
            elif any(item in article.maintext for item in content_blacklist):
                raise BlacklistedContent
            else:
                LOGGER.info('successful scrape at index %s' % index)

                submissions[index].newsplease = article
                results.append(submissions[index])

        except Exception as e:
            LOGGER.info('failed scrape at index %s due to %s' % (index, e))

        index += 1

    return results

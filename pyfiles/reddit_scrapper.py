from __future__ import annotations
"""
----------Objectives----------
1. Scrape all submissions in a given month using pushshift API.
2. Order those submissions by score using Python Reddit API Wrapper (PRAW).

----------Resources used----------
For using pushshift API post COLO transition:
https://api.pushshift.io/docs
For naming the PRAW_USERAGENT:
https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example
For creating the praw.reddit.Reddit object:
https://github.com/praw-dev/praw
"""
from credentials import PRAW_CLIENT_ID, PRAW_CLIENT_SECRET, PRAW_USERNAME, PRAW_PASSWORD, PRAW_USERAGENT

import requester
import datetime
import time
import praw

import logging
logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def get_epoch(year: int,
              month: int,
              day: int,
              hour: int = 0,
              minute: int = 0,
              second: int = 0) -> int:
    """
    Returns epoch time.

    Preconditions:
    - 1970 <= year
    - 1 <= month <= 12
    - 1 <= day <= 31
    - 0 <= hour <= 23
    - 0 <= minute <= 59
    - 0 <= second <= 59

    >>> get_epoch(2004, 7, 9)
    1089331200
    """
    delta = datetime.datetime(year, month, day, hour, minute, second) - datetime.datetime(1970, 1, 1)
    return int(delta.total_seconds())


def get_submissions(subreddit: str,
                    start_time: tuple[int, int, int],
                    end_time: tuple[int, int, int]) -> list[dict]:
    """
    Takes 2 times in the form of (year, month, day) and returns all submissions in that time.
    Submissions will be in order of newest to oldest.

    Note that the pushshift API also returns submissions on users profiles
    where the username includes the subreddit str.
    """
    results = []

    utc_start_time = get_epoch(*start_time)
    earliest_created_utc = None
    while True:
        endpoint = '/reddit/search/submission'
        if earliest_created_utc is None:
            queries = {'subreddit': subreddit,
                       'until': str(get_epoch(*end_time)),
                       'limit': '1000'}
        else:
            queries = {'subreddit': subreddit,
                       'until': str(earliest_created_utc - 1),
                       'limit': '1000'}
        query_list = [f'{key}={queries[key]}' for key in queries]
        query_string = '&'.join(query_list)
        link = f'https://api.pushshift.io{endpoint}?{query_string}'
        response = requester.make_request_with_timeout(link)

        if len(response['data']) == 0:
            return results  # ran out of submissions (start_time is before subreddit was created?)

        for submission in response['data']:
            if submission['created_utc'] < utc_start_time:
                return results
            results.append(submission)

        earliest_created_utc = results[-1]['created_utc']
        time.sleep(3)


def clean_submissions(submissions: list[dict], subreddit: str) -> list[dict]:
    """
    Removes all submissions where:
    - 'url' is a blacklisted link (defined below)
    - 'url' is empty
    - 'subreddit' is not subreddit

    Also makes sure that 'url' content is lowercase.
    """
    blacklist = {'reddit.com',
                 'twitter.com',
                 'youtube.com',
                 'youtu.be',
                 '.jpg',
                 '.jpeg',
                 '.png',
                 'imgur.com'}

    filtered = []
    for submission in submissions:
        blacklist_status = all({link not in submission['url'] for link in blacklist})
        if all({blacklist_status, submission['url'] != '', submission['subreddit'] == subreddit}):
            submission['url'] = submission['url'].lower()
            filtered.append(submission)
    return filtered


def sort_submissions(submissions: list[dict]) -> list[dict]:
    """
    Return a list of dicts where each dict now has 2 keys:
    - score: the karma of the post
    - pushshift: the original submission dict from the pushshift API
    """
    full_names = ['t3_' + submission['id'] for submission in submissions]

    reddit = praw.Reddit(
        client_id=PRAW_CLIENT_ID,
        client_secret=PRAW_CLIENT_SECRET,
        username=PRAW_USERNAME,
        password=PRAW_PASSWORD,
        user_agent=PRAW_USERAGENT
    )
    reddit_info_generator = reddit.info(fullnames=full_names)
    LOGGER.info('trying to get scores from reddit_info_generator')
    scores = [submission.score for submission in reddit_info_generator]
    LOGGER.info('successfully got scores from reddit_info_generator')
    results = []
    for index, score in enumerate(scores):
        results.append(
            {'score': score,
             'pushshift': submissions[index]}
        )
    results = sorted(results, reverse=True, key=lambda d: d['score'])
    return results

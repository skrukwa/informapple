"""
Read and scrape all submissions from a given subreddit using a ZST archive.
Order those submissions by -current- upvote count using Python Reddit API Wrapper (PRAW).

See also:
https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example (for PRAW_USERAGENT)
"""
import io
import json
import logging
import os

import praw
from tqdm import tqdm
from zstandard import ZstdDecompressor

from credentials import PRAW_CLIENT_ID, PRAW_CLIENT_SECRET, PRAW_USERNAME, PRAW_PASSWORD, PRAW_USERAGENT
from object_subclasses import *

logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def get_submissions(path: str, subreddit: str) -> list[Submission]:
    """
    Read a Zstandard compressed Reddit archive file and return a list of Submission objects.
    """
    result = []
    with open(path, 'rb') as file:
        decompress_context = ZstdDecompressor(max_window_size=2 ** 31)  # 2147483648 kibibytes or 2 tebibytes
        with tqdm(total=os.stat(path).st_size, desc='uncompressing zst file') as pbar:  # progress bar
            with decompress_context.stream_reader(file) as stream_reader:
                with io.TextIOWrapper(stream_reader, encoding='utf-8') as text_stream:

                    for submission in text_stream:
                        pbar.update(file.tell() - pbar.n)  # progress bar
                        temp = json.loads(submission)
                        try:
                            if temp['subreddit'].lower() == subreddit.lower():
                                result.append(
                                    Submission(archive=temp)
                                )
                        except KeyError:
                            pass  # some earlier zst archives contain non-submission entries?
    return result


def get_url_submissions(submissions: list[Submission]) -> list[Submission]:
    """
    Return a new list of Submission objects with the following removed:
    - archive 'url' contains a blacklisted link (defined below)
    - archive 'url' is empty

    Also ensures that archive 'url' content is lowercase.

    No new Submission objects are created.
    """
    url_blacklist = {'reddit.com',
                     'twitter.com',
                     'youtube.com',
                     'youtu.be',
                     '.jpg',
                     '.jpeg',
                     '.png',
                     'imgur.com'}

    LOGGER.info('cleaning submissions')
    filtered = []
    for submission in submissions:
        if (
                submission.archive['url'] is not None and
                submission.archive['url'] != '' and
                all(link not in submission.archive['url'] for link in url_blacklist)
        ):
            submission.archive['url'] = submission.archive['url'].lower()
            filtered.append(submission)
    LOGGER.info('submissions cleaned')
    return filtered


def sort_submissions(submissions: list[Submission]) -> list[Submission]:
    """
    Return a new list of Submission objects where each object is assigned a score attribute.

    The output list is sorted in descending order by score.

    No new Submission objects are created.
    """
    full_names = ['t3_' + submission.archive['id'] for submission in submissions]

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
        submissions[index].score = score
        results.append(submissions[index])
    results.sort(key=lambda sub: sub.score, reverse=True)
    return results

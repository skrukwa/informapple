from __future__ import annotations
"""
----------Objectives----------
1. Classify sentiment of article contents.
"""
import re
import statistics

from flair.models import TextClassifier
from flair.data import Sentence
CLASSIFIER = TextClassifier.load('en-sentiment')

from NewsSentiment import TargetSentimentClassifier
TARGET_CLASSIFIER = TargetSentimentClassifier()

import logging
logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def split_into_sentences(text: str) -> list[str]:
    """
    https://stackoverflow.com/a/31505798
    """
    alphabets = "([A-Za-z])"
    prefixes = "(Mr|St|Mrs|Ms|Dr)[.]"
    suffixes = "(Inc|Ltd|Jr|Sr|Co)"
    starters = "(Mr|Mrs|Ms|Dr|He\s|She\s|It\s|They\s|Their\s|Our\s|We\s|But\s|However\s|That\s|This\s|Wherever)"
    acronyms = "([A-Z][.][A-Z][.](?:[A-Z][.])?)"
    websites = "[.](com|net|org|io|gov)"
    digits = "([0-9])"
    text = " " + text + "  "
    text = text.replace("\n"," ")
    text = re.sub(prefixes,"\\1<prd>",text)
    text = re.sub(websites,"<prd>\\1",text)
    text = re.sub(digits + "[.]" + digits,"\\1<prd>\\2",text)
    if "..." in text: text = text.replace("...","<prd><prd><prd>")
    if "Ph.D" in text: text = text.replace("Ph.D.","Ph<prd>D<prd>")
    text = re.sub("\s" + alphabets + "[.] "," \\1<prd> ",text)
    text = re.sub(acronyms+" "+starters,"\\1<stop> \\2",text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>\\3<prd>",text)
    text = re.sub(alphabets + "[.]" + alphabets + "[.]","\\1<prd>\\2<prd>",text)
    text = re.sub(" "+suffixes+"[.] "+starters," \\1<stop> \\2",text)
    text = re.sub(" "+suffixes+"[.]"," \\1<prd>",text)
    text = re.sub(" " + alphabets + "[.]"," \\1<prd>",text)
    if "”" in text: text = text.replace(".”","”.")
    if "\"" in text: text = text.replace(".\"","\".")
    if "!" in text: text = text.replace("!\"","\"!")
    if "?" in text: text = text.replace("?\"","\"?")
    text = text.replace(".",".<stop>")
    text = text.replace("?","?<stop>")
    text = text.replace("!","!<stop>")
    text = text.replace("<prd>",".")
    sentences = text.split("<stop>")
    sentences = sentences[:-1]
    sentences = [s.strip() for s in sentences]
    return sentences


def get_sentiments(submissions: list[dict]) -> list[dict]:
    """
    Return a list of dicts where each dict now has 4 keys:
    - score: the karma of the post
    - pushshift: the original submission dict from the pushshift API
    - newsplease: NewsArticle.NewsArticle object
    - flair: the sentiment analysis of the newsplease article.maintext
    """
    mentions = ['apple',
                'AAPL',
                'iphone',
                'ipad',
                'ios',
                'imac',
                'macbook',
                'mac',
                'macos',
                'airpod']
    results = []
    for submission in submissions:
        text = submission['newsplease'].maintext
        sentences = split_into_sentences(text)
        sentences = [sentence.lower() for sentence in sentences]
        values = []
        for sentence in sentences:
            value = None

            for mention in mentions:  # method 1: use TARGET_CLASSIFIER
                if sentence.count(mention) == 1:
                    LOGGER.info('using NewsMTSC')
                    try:
                        confidences = TARGET_CLASSIFIER.infer_from_text(sentence.split(mention, 1)[0],
                                                                        mention,
                                                                        sentence.split(mention, 1)[1])
                    except Exception as e:
                        LOGGER.info('switching to FlairNLP since NewsMTSC failed due to %s' % e)
                    positive, negative = None, None
                    for classification in confidences:
                        if classification['class_label'] == 'positive':
                            positive = classification['class_prob']
                        elif classification['class_label'] == 'negative':
                            negative = classification['class_prob']
                    value = positive - negative
                    break

            if value is None:  # method 2: use CLASSIFIER
                obj = Sentence(sentence)
                LOGGER.info('using FlairNLP')
                CLASSIFIER.predict(obj)
                sentiment = obj.tag
                confidence = obj.score
                if sentiment == 'POSITIVE':
                    value = confidence
                elif sentiment == 'NEGATIVE':
                    value = -1 * confidence

            values.append(value)

        if len(values) > 0:
            final_value = statistics.mean(values)
        else:
            final_value = 0  # rare edge case since all articles SHOULD be valid and have >0 sentences
        results.append(
            {'score': submission['score'],
             'pushshift': submission['pushshift'],
             'newsplease': submission['newsplease'],
             'flair': final_value}
        )
    return results

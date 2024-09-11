"""
----------Objectives----------
Apply zero shot text classification to submission article headlines.

----------Resources used----------
For using the pre-trained zero shot model:
https://huggingface.co/facebook/bart-large-mnli
"""
from tqdm import tqdm
from transformers import pipeline

from object_subclasses import *


def classify_headlines(submissions: list[Submission], labels: list[str]) -> list[Submission]:
    """
    Return a new list of Submission objects where each object is assigned a labels attribute.

    No new Submission objects are created.
    """
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    result = []
    for submission in tqdm(submissions, desc='classifying headlines'):
        headline = submission.archive['title']
        label_results = classifier(headline, labels)
        submission.labels = dict(zip(label_results['labels'], label_results['scores']))
        result.append(submission)
    return result

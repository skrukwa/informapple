"""
Define custom classes to be used in other files.
"""
from dataclasses import dataclass
from typing import Any, Optional

from newsplease import NewsArticle


@dataclass(kw_only=True, slots=True)
class Submission:
    """
    An object containing information about a single Reddit submission (aka post).

    Instance Attributes:
    - archive: the original submission data from the ZST archive
    - score: the -current- upvote count of the post
    - newsplease: the returned data from newsplease
    - labels: all labels and corresponding values in descending order
    """
    archive: Optional[dict[str, Any]] = None
    score: Optional[int] = None
    newsplease: Optional[NewsArticle.NewsArticle] = None
    labels: Optional[dict[str, float]] = None

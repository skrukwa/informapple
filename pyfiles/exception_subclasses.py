from __future__ import annotations
"""
Defines Exception subclasses to be used in other files.
"""


class SignalAlarmError(Exception):
    """Exception raised when a signal.alarm expires."""
    def __str__(self) -> str:
        """Return a string representation of this error."""
        return 'signal alarm expired'


class FailedRequestError(Exception):
    """Exception raised when make_request_with_timeout fails."""
    def __str__(self) -> str:
        """Return a string representation of this error."""
        return 'ran out of tries to complete the request'


class MaintextTooShort(Exception):
    """Exception raised when scrape_top_25_articles gets a short maintext."""
    def __str__(self) -> str:
        """Return a string representation of this error."""
        return 'article maintext was less than 30 characters'

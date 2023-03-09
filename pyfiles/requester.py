from __future__ import annotations
"""
File responsible for making requests using the requests library.
"""
from exception_subclasses import SignalAlarmError, FailedRequestError

import requests
import signal

import logging
logging.basicConfig()
LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)


def signal_handler(signum, frame) -> None:
    """
    Handles signal.alarm expirations.
    """
    raise SignalAlarmError


signal.signal(signal.SIGALRM, signal_handler)


def make_request_with_timeout(link: str, timeout: int = 8, repeats: int = 6) -> dict:
    """
    Calls make_request but times out the request if the given amount of seconds passes.
    Returns an error if the request fails the given number of times.
    """
    repeated = 0
    while repeated < repeats:
        repeated += 1
        LOGGER.info('trying a request (try %s)' % repeated)
        signal.alarm(timeout)
        try:
            result = requests.get(link).json()
            signal.alarm(0)
            LOGGER.info('request completed')
            return result
        except SignalAlarmError:
            pass
    raise FailedRequestError

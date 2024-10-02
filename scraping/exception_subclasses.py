"""
Define Exception subclasses to be used in other files.
"""


class MaintextTooShort(Exception):
    """Exception raised when scrape_top_25_articles gets a short maintext."""
    def __str__(self) -> str:
        """Return a string representation of this error."""
        return 'article maintext was less than 30 characters'


class BlacklistedContent(Exception):
    """Exception raised when scrape_top_25_articles gets a maintext which includes blacklisted content."""
    def __str__(self) -> str:
        """Return a string representation of this error."""
        return 'article maintext contains blacklisted content'

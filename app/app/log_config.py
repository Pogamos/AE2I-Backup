import logging
from colorlog import ColoredFormatter

def setup_logger(name: str):
    """
    Configure and return a logger with colored output for console and plain text for file.
    :param name: Name of the current_app.logger.
    :return: Configured current_app.logger.
    """
    LOG_LEVEL = logging.DEBUG

    formatter = ColoredFormatter(
        "%(log_color)s%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
        log_colors={
            "DEBUG": "blue",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "bold_red",
        },
    )

    # Handler pour console
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(LOG_LEVEL)
    stream_handler.setFormatter(formatter)

    # Handler pour log file
    file_handler = logging.FileHandler("app.log")
    file_handler.setLevel(LOG_LEVEL)
    file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))

    logger = logging.getLogger(name)
    logger.setLevel(LOG_LEVEL)
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)

    return logger

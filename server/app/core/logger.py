import logging
import os
from logging.handlers import RotatingFileHandler

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"

logging.basicConfig(
    level=logging.INFO,
    format=LOG_FORMAT,
)

logger = logging.getLogger("flipit")

# File handler
file_handler = RotatingFileHandler(
    "logs/flipit.log",
    maxBytes=5 * 1024 * 1024,  # 5 MB
    backupCount=3,
)

file_handler.setFormatter(logging.Formatter(LOG_FORMAT))

logger.addHandler(file_handler)
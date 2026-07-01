import asyncio

from app.core.database import SessionLocal
from app.core.logger import logger
from app.services.auction_service import close_expired_auctions


async def auction_scheduler():
    """
    Runs forever while the FastAPI server is running.
    Every minute it checks for expired auctions.
    """

    logger.info("Auction scheduler started.")

    while True:

        async with SessionLocal() as db:

            try:
                await close_expired_auctions(db)

            except Exception as e:
                logger.exception(e)

        # Check every 60 seconds
        await asyncio.sleep(60)
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI):
    """
    Register global exception handlers.
    """

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):
        logger.warning(
            f"{request.method} {request.url.path} -> {exc.status_code}: {exc.detail}"
        )

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        logger.warning(
            f"Validation failed on {request.method} {request.url.path}"
        )

        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": "Validation Error",
                "details": exc.errors(),
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception(exc)

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal Server Error",
            },
        )
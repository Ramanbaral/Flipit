from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.router import listings, bids, auctions


# ==========================================================
# APPLICATION LIFESPAN
# ==========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Flipit API...")
    yield
    print("Shutting down Flipit API...")


# ==========================================================
# FASTAPI APP
# ==========================================================

app = FastAPI(
    title="Flipit API",
    description="Backend API for the Flipit re-commerce marketplace.",
    version="1.0.0",
    lifespan=lifespan,
)

# ==========================================================
# GLOBAL EXCEPTION HANDLERS
# ==========================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException,
):
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
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation failed.",
            "details": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception,
):
    print(exc)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error.",
        },
    )
# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# ROUTERS
# ==========================================================

app.include_router(listings.router)
app.include_router(bids.router)
app.include_router(auctions.router)


# ==========================================================
# ROOT
# ==========================================================

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Flipit API is running",
        "version": app.version,
    }


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "service": "flipit-api",
    }
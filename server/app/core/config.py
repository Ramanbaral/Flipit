import os
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, "../../.env")


class Settings(BaseSettings):
    app_name: str
    admin_secret: str

    supabase_url: str
    supabase_key: str

    database_url: str

    webhook_secret: str
    resend_apikey: str
    frontend_url: str
    gemini_api_key: str

    bucket_name: str
    bucket_endpoint: str
    aws_secret_access_key: str
    aws_access_key_id: str

    # FIXED validator
    @field_validator("database_url")
    @classmethod
    def ensure_asyncpg_driver(cls, v: str):
        if v.startswith("postgresql://"):
            return v.replace(
                "postgresql://",
                "postgresql+asyncpg://",
                1
            )
        return v

    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
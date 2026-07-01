from supabase._async.client import create_client, AsyncClient

from .config import settings


def get_supabase() -> AsyncClient:
    return create_client(
        settings.supabase_url,
        settings.supabase_key,
    )
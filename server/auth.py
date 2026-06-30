import requests
from fastapi import HTTPException, Header

SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
SUPABASE_JWT_SECRET = "YOUR_SUPABASE_JWT_SECRET"


def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")

    response = requests.get(
        f"{SUPABASE_URL}/auth/v1/user",
        headers={"Authorization": f"Bearer {token}"}
    )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = response.json()
    return user

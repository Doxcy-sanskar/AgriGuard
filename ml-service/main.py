"""
main.py — AgriGuard ML microservice

Run:
    pip install -r requirements.txt
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Endpoints:
    GET  /health              -> service liveness check
    POST /analyze              -> upload a leaf image (multipart/form-data, field "file")
                                   returns a real diagnosis computed from the image
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from classifier import analyze_leaf_image

app = FastAPI(title="AgriGuard ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this to your backend's origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/jpg", "image/webp"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "agriguard-ml"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB).")

    try:
        result = analyze_leaf_image(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return result

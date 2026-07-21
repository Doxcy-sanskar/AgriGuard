# AgriGuard — AI-Driven Crop Disease Detection Platform

A real, runnable full-stack project: farmers upload a leaf photo, get an
actual computer-vision diagnosis, and see advisory, alerts, and nearby
suppliers/experts — in English or Hindi, on mobile or desktop.

```
agriguard-project/
├── frontend/     React + Vite + Tailwind — the UI (mobile-first, responsive)
├── backend/      Node/Express API — auth, scans, advisory, alerts, market
└── ml-service/   Python/FastAPI — real image-analysis disease detector
```

## How the pieces fit together

```
 Browser (React app, :5173)
        │  fetch()
        ▼
 Backend API (Node/Express, :4000)
   - phone+OTP auth (JWT)
   - stores users/scans as JSON files in backend/data/
   - forwards uploaded leaf photos to the ML service
        │  multipart POST
        ▼
 ML service (FastAPI, :8000)
   - decodes the image, runs HSV color + lesion-spot analysis
   - returns a real status (healthy / warning / diseased),
     a label, confidence, and % of leaf area affected
```

None of this is mocked — the OTP is logged to the backend console instead
of sent by real SMS (no gateway wired up yet), and the disease detector is
a color/texture heuristic instead of a trained CNN (no labeled dataset
available yet) — but the diagnosis genuinely depends on the pixels in the
photo you upload. See "Upgrading to a trained CNN" below for the next step.

## Quick start (run all three)

You'll need Node.js 18+, Python 3.10+, and three terminal tabs.

**1. ML service**
```bash
cd ml-service
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**2. Backend**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Register with any 10-digit number — the
OTP will be printed in the backend terminal (and also returned in the API
response for the demo, so the login screen shows it directly).

## Testing the diagnosis for real

Upload any photo of a leaf. Brownish/rust/yellow blotches will push the
result toward "diseased"; a mostly uniform green leaf will read as
"healthy". Because it's real HSV segmentation (not random), the same photo
always gives the same result, and you can inspect the `details` field in
the API response to see the exact color-ratio math behind the call.

## Project structure in detail

### `ml-service/`
- `classifier.py` — the actual detection logic (HSV masks for healthy
  green, chlorotic yellow, necrotic brown, rust orange, dark spots; lesion
  counting via contour detection)
- `main.py` — FastAPI app exposing `POST /analyze`
- `train_cnn_example.py` — a documented reference script for training a
  real MobileNetV2-based CNN once you have a labeled leaf-disease dataset

### `backend/`
- `server.js` — Express app wiring up all routes
- `db.js` — minimal JSON-file persistence (swap for Postgres at scale —
  see below)
- `otpStore.js` — in-memory OTP store (swap for Redis + a real SMS gateway)
- `routes/auth.js` — phone+OTP register/login, issues JWT
- `routes/scans.js` — receives leaf photo uploads, calls the ML service,
  persists the result, serves scan history
- `routes/advisory.js` — remedy library keyed by diagnosis status
- `routes/alerts.js` — alerts generated from each user's real scan history
- `routes/market.js` — supplier/expert directory (static seed data for now)

### `frontend/`
- `src/App.jsx` — navigation shell (bottom tabs on mobile, sidebar on
  desktop), session handling, online/offline indicator
- `src/api.js` — fetch wrapper talking to the backend
- `src/components/` — one file per screen (Auth, Home, Scan, Advisory,
  Alerts, Market, Profile)
- `src/i18n/strings.js` — English + Hindi copy, easy to extend with more
  languages

## Upgrading to a trained CNN

1. Collect/label leaf images into `dataset/train/<class>/*.jpg` and
   `dataset/val/<class>/*.jpg` (or use the public PlantVillage dataset as a
   starting point, then add your own local/regional crop photos).
2. `pip install tensorflow` and run:
   ```bash
   python train_cnn_example.py --data_dir ./dataset --epochs 15
   ```
3. In `main.py`, load the saved model with
   `tf.keras.models.load_model()` and replace the call to
   `analyze_leaf_image()` with `model.predict()`, mapping the output
   class index back to a status/label using `class_names.txt`.

## Making this production-ready

This is a working prototype, not yet a hardened production system. Before
any real deployment, at minimum:

- **Database:** replace `backend/db.js` (JSON files) with PostgreSQL —
  the JSON-file store is fine for a demo, not for concurrent real users.
- **SMS gateway:** wire `otpStore.js` to a real provider (MSG91, Twilio)
  instead of logging codes to the console.
- **File storage:** move uploaded images from local disk to S3/GCS/Azure
  Blob so the app can run on more than one server.
- **Secrets:** set a strong, unique `JWT_SECRET` in `.env` — never commit
  `.env` to version control.
- **HTTPS + rate limiting** on all public endpoints, especially
  `/auth/send-otp` (to prevent SMS-bombing abuse).
- **Offline mode:** the current app just shows an online/offline
  indicator. True offline support needs a service worker with a local
  request queue, and ideally an on-device TFLite model for basic
  classification without connectivity.
- **Weather/soil predictive analytics:** not yet built — the next service
  to add would combine a weather API (e.g. OpenWeather) with historical
  disease outbreak data to forecast risk, similar in shape to
  `ml-service/`.

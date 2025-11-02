# Loy Kratong Demo

Frontend for Loy Kratong (ลอยกระทง) Online application.

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

The app is configured to use the production backend API by default:
- **Production Backend**: `https://loy-kratong-api.onrender.com`

For local development, create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### Run Development Server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Deployment on Render

1. **Environment Variables**: Set `VITE_API_URL` if you want to override the default:
   ```
   VITE_API_URL=https://loy-kratong-api.onrender.com
   ```

2. **Build Command**:
   ```
   npm install && npm run build
   ```

3. **Start Command**:
   ```
   npm run preview
   ```
   Or use a static file server like `npx serve -s dist`

## API Connection

The frontend connects to the backend API at:
- **Backend URL**: `https://loy-kratong-api.onrender.com`
- **Endpoints**:
  - `GET /kratong` - Get all kratongs
  - `POST /kratong` - Create a new kratong
  - `GET /health` - Health check

## Frontend URL

- **Production**: `https://loy-kratong-tse.onrender.com`

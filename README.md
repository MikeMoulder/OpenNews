# OpenNews

An intelligent cryptocurrency news analysis platform that leverages AI to analyze market sentiment, detect high-impact news, and provide structured insights about crypto market developments.

## Features

- **AI-Powered News Analysis**: Uses OpenGradient LLM to analyze cryptocurrency news articles
- **RSS Feed Integration**: Automatically parse and process news from multiple RSS feeds
- **Market Sentiment Detection**: Classify news as bullish, bearish, or neutral with confidence scoring
- **Structured Analysis**: Extract key claims, market impact, and uncertainty assessments
- **Real-time API**: FastAPI backend with WebSocket-ready architecture
- **Modern UI**: React + Next.js frontend with dark mode support and responsive design
- **Type-Safe**: Full TypeScript support for type safety and better developer experience

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Python 3.8+** - Core runtime
- **OpenGradient** - LLM integration for AI analysis
- **feedparser** - RSS feed parsing
- **httpx** - Async HTTP client
- **Pydantic** - Data validation

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **next-themes** - Dark mode support

## Prerequisites

- **Python 3.8+**
- **Node.js 18+** and npm/yarn
- **OpenGradient API Key** (sign up at [opengradient.ai](https://opengradient.ai))

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/opennews.git
cd opennews
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Set required environment variables in `.env`:
```
OG_PRIVATE_KEY=your_opengradient_private_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create `.env.local` (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Configure environment variables if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

The API will be available at `http://localhost:8000`
- Swagger Documentation: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
Use a production ASGI server like Gunicorn:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## API Endpoints

### POST `/analyze`
Analyzes a cryptocurrency news article

**Request Body:**
```json
{
  "url": "https://example.com/news",
  "content": "Article content...",
  "title": "Article Title"
}
```

**Response:**
```json
{
  "summary": "2-3 sentence summary",
  "market_impact": "bullish|bearish|neutral",
  "impact_reason": "Explanation of market impact",
  "key_claims": ["claim1", "claim2", "claim3"],
  "uncertainty": "Unknown or unverified elements",
  "verdict": "noise|watch|important|high_impact",
  "confidence": 0.85
}
```

## Configuration

### Environment Variables

**Backend (.env)**
- `OG_PRIVATE_KEY` - Your OpenGradient private key (required)
- `ALLOWED_ORIGINS` - CORS allowed origins (default: http://localhost:3000)

**Frontend (.env.local)**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)

## Development

### Code Quality

Lint frontend code:
```bash
cd frontend
npm run lint
```

### Project Structure

```
opennews/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Example environment variables
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── styles/         # Global styles
│   ├── package.json        # Node dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── tailwind.config.ts  # Tailwind CSS config
└── README.md
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Ensure code follows project style conventions
- Write clear commit messages
- Update documentation as needed
- Test your changes before submitting

## Troubleshooting

### Backend Issues

**Module not found error:**
Ensure virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

**CORS errors:**
Check `ALLOWED_ORIGINS` in `.env` matches your frontend URL

**API key errors:**
Verify `OG_PRIVATE_KEY` is correctly set in `.env`

### Frontend Issues

**API connection errors:**
Ensure backend is running and `NEXT_PUBLIC_API_URL` is correctly configured

**Build errors:**
Clear cache and reinstall:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation in `/docs`
- Review API documentation at `http://localhost:8000/docs`

## Acknowledgments

- [OpenGradient](https://opengradient.ai) - LLM infrastructure
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Made with ❤️ by the OpenNews team**

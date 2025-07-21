# SportsAnalyticsPro ⚽📊

A modern sports analytics platform that provides data-driven insights into player and team performance using cutting-edge technologies.

## 🌟 Features

- **Interactive dashboards** with real-time player/team statistics
- **Advanced visualizations** (heatmaps, radar charts, trend analysis)
- **AI-powered predictions** (match outcomes, player performance)
- **Multi-sport support** (football, basketball, cricket)
- **Responsive design** works on desktop and mobile

## 🛠 Tech Stack

| Area        | Technology |
|-------------|------------|
| Frontend    | Next.js (TypeScript), CSS, ReChart |
| Backend     | Python FastAPI, Next.js |
| Data        | Snowflake (warehouse), Kaggle datasets |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Snowflake account
- Kaggle API key

### Installation

```bash
1. Clone the repository
git clone https://github.com/codervishwesh/SportsAnalyticsPro.git
cd SportsAnalyticsPro

2. Set up frontend
cd frontend
npm install
cp .env.example .env.local  # Update with your values
npm run dev

3. Set up backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
cp .env.example .env      # Update with your values
uvicorn main:app --reload

4. Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000

5.Environment Variables

Frontend (.env.local):
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SNOWFLAKE_ACCOUNT=your_account

Backend (.env):
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
```
Contact
Vishwesh Patel - @codervishwesh
Project Link: https://github.com/codervishwesh/SportsAnalyticsPro

# 🏋️ FitStreak - Workout Tracking MVP

> "App giúp bạn không bỏ buổi tập bằng cách theo dõi tối thiểu, phản hồi rõ ràng, và tạo cảm giác tiến bộ."

## 🎯 Concept

MVP tập trung vào **1 hành vi duy nhất**: Check-in buổi tập (tập xong → bấm 1 nút)

### Core Features
- 🏁 **Check-in tập luyện**: Chọn loại tập → thời gian → cường độ
- 📅 **Lịch tập đơn giản**: Hiển thị chuỗi ngày liên tục
- 🔥 **Streak**: Chuỗi ngày không bỏ tập
- 📊 **Feedback sau buổi tập**: "Hôm nay bạn tập tốt hơn 60% tuần trước"
- 📝 **Ghi chú ngắn**: "Hôm nay mệt / đau / khỏe"

## 🛠 Tech Stack

### Backend
- **Ruby on Rails 7** (API-only mode)
- **MySQL 8** (Database)
- **JWT** (Authentication)

### Frontend
- **React 18** + **Vite**
- **TailwindCSS** + **shadcn/ui**
- **Zustand** (State management)
- **React Query** (Data fetching)

## 📦 Project Structure

```
rail-app/
├── backend/                 # Rails 7 API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── serializers/
│   ├── config/
│   └── db/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── hooks/
│   │   └── pages/
│   └── public/
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Ruby 3.2+ (for local development)
- Node.js 20+ (for local development)

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Setup database
docker-compose exec backend rails db:create db:migrate db:seed

# Access
# - Frontend: http://localhost:3001
# - Backend API: http://localhost:3000
```

### Local Development

```bash
# Backend
cd backend
bundle install
rails db:create db:migrate db:seed
rails s

# Frontend
cd frontend
pnpm install
pnpm dev
```

## 📊 Data Model

```
User {
  id, email, name, created_at
}

Workout {
  id, user_id, date, type, duration, feeling, note, created_at
}
```

### Workout Types
- `gym` - Gym / Weights
- `running` - Running / Cardio
- `yoga` - Yoga / Stretch
- `other` - Other activities

### Feeling Scale
- `1` - 😫 Exhausted
- `2` - 😐 Normal
- `3` - 😄 Great

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    # Register new user
POST   /api/v1/auth/login       # Login
DELETE /api/v1/auth/logout      # Logout
GET    /api/v1/auth/me          # Current user
```

### Workouts
```
GET    /api/v1/workouts         # List workouts (with filters)
POST   /api/v1/workouts         # Create workout (check-in)
GET    /api/v1/workouts/:id     # Show workout
PATCH  /api/v1/workouts/:id     # Update workout
DELETE /api/v1/workouts/:id     # Delete workout
```

### Stats
```
GET    /api/v1/stats/streak     # Current streak
GET    /api/v1/stats/weekly     # This week summary
GET    /api/v1/stats/monthly    # Monthly calendar data
GET    /api/v1/stats/comparison # Week-over-week comparison
```

## 🎨 User Flow (15 seconds)

```
Mở app → Bấm "Hôm nay đã tập" → Chọn:
  - Loại tập (Gym / Chạy / Yoga / Khác)
  - Thời gian (15–30–60 phút)
  - Cảm giác (😫 😐 😄)
→ Xong!
```

## 📈 Roadmap

### v0.1 (MVP) - Current
- [x] Basic check-in
- [x] Streak tracking
- [x] Simple calendar
- [x] Weekly stats

### v0.2
- [ ] Smart reminders
- [ ] Week comparison
- [ ] Export data

### v0.3
- [ ] "Am I declining?" insights
- [ ] Text-based insights (no charts)
- [ ] Social sharing

## 📄 License

MIT

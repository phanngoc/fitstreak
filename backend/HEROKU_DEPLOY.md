# Heroku Deployment Guide for FitStreak Rails API

## Prerequisites
1. Heroku CLI installed: https://devcenter.heroku.com/articles/heroku-cli
2. Git installed
3. Heroku account (verified)

## Quick Deploy Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
cd backend
heroku apps:create fitstreak-api
```

### 3. Add Heroku PostgreSQL
```bash
heroku addons:create heroku-postgresql:essential-0
```

### 4. Set Environment Variables
```bash
heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)
heroku config:set RAILS_ENV=production
heroku config:set RACK_ENV=production
```

### 5. Add Platforms (if needed)
```bash
bundle lock --add-platform x86_64-linux --add-platform ruby
```

### 6. Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 7. Run Migrations
```bash
heroku run rake db:migrate
heroku run rake db:seed
```

### 8. Open App
```bash
heroku open
```

## Useful Commands

### View Logs
```bash
heroku logs --tail
```

### Rails Console
```bash
heroku run rails console
```

### Check Dyno Status
```bash
heroku ps
```

### Scale Dynos
```bash
heroku ps:scale web=1
```

## Troubleshooting

### Check App Info
```bash
heroku info
```

### Check Database
```bash
heroku pg:info
```

### Restart App
```bash
heroku restart
```

## Cost Management
- Essential-0 Postgres: ~$5/month
- Eco dynos: Shared across account
- Delete when not in use:
  ```bash
  heroku addons:destroy heroku-postgresql
  heroku apps:destroy
  ```

# 🔧 RENDER DATABASE FIX

## Create PostgreSQL Database (if missing)

1. **Go to Render Dashboard** → Click "New +"
2. **Select "PostgreSQL"**
3. **Configure:**
   ```
   Name: tagelong-database
   Database: tagelong_production
   User: postgres
   Region: Same as your web service
   Plan: Free (sufficient for your needs)
   ```
4. **Click "Create Database"**

## Connect Database to Web Service

### Method 1: Environment Variable (Recommended)
1. **Go to your Web Service** → Settings → Environment
2. **Add this variable:**
   ```
   DATABASE_URL=${{tagelong-database.DATABASE_URL}}
   ```

### Method 2: Manual Connection String
If Method 1 doesn't work, get the connection details:

1. **Go to PostgreSQL service** → Info tab
2. **Copy the connection details:**
   - Host: `dpg-xxxxx-a.oregon-postgres.render.com`
   - Port: `5432` 
   - Database: `tagelong_database_xxxx`
   - Username: `postgres`
   - Password: `[your-generated-password]`

3. **Create DATABASE_URL manually:**
   ```
   DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
   ```

## Verify Environment Variables

Make sure these are set in your Web Service:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=10000
DATABASE_CLIENT=postgres
DATABASE_URL=${{tagelong-database.DATABASE_URL}}

# Your generated keys
ADMIN_JWT_SECRET=aa4f1fb5f69caaa72465a2be407d43bcfe7218d76dc0f9aba3a3b39f69d14098
JWT_SECRET=2023725fd2455e6d178aa5f2219a1d701dbcd4766ffbeb4e4000285e5028faea
API_TOKEN_SALT=36290613c19472badeb0803b6614b8d7cfe9756d1811ca099b702d9a6c9061c0
TRANSFER_TOKEN_SALT=7747184d1d25ccf4044d2057c5a8a802a763d31b9e6234fc3a1f2b26b764d2d0
APP_KEYS=94daf3965960a8a723a08d4abd5ced00,1118e415c40f27aaa0cc889caac90017,d713eedf4134d4c6b1cc226b2a8f637f,f961d6b52a6ba8c24f741c97f58c67d9
```

## After Adding DATABASE_URL

1. **Save Environment Variables**
2. **Redeploy** - Click "Manual Deploy" in your web service
3. **Check logs** - Should now connect successfully

## Troubleshooting

If still failing:
1. Check PostgreSQL service is "Available" 
2. Verify DATABASE_URL format is correct
3. Make sure both services are in same region

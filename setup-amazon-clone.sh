#!/bin/bash

echo "🔧 Setting up environment files..."

# Root .env
cat > .env.example << 'EOF'
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw

JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
JWT_ALGORITHM=HS256
EOF

# Auth Service .env
cat > services/auth/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
JWT_REFRESH_SECRET=8f3d2c28cfc259d03518230132654525cc8fbae9b2ed060a3de8bf9d494c9389d
JWT_ALGORITHM=HS256
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

# User Service .env
cat > services/user/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
JWT_ALGORITHM=HS256
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=5000
FRONTEND_URL=http://localhost:3000
AUTH_URL=http://auth:4000
EOF

# Product Service .env
cat > services/product/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=5001
EOF

# Cart Service .env
cat > services/cart/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=5002
EOF

# Order Service .env
cat > services/order/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=5003
EOF

# Payment Service .env
cat > services/payment/.env.example << 'EOF'
JWT_SECRET=525cc8fbae9b2ed060a3de8bf9d494c9389df3d2c28cfc259d03518230132654
SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
PORT=5004
STRIPE_SECRET_KEY=your_stripe_secret_key
EOF

# Frontend .env.local
cat > frontend/.env..example << 'EOF'
NEXT_PUBLIC_AUTH_API=http://localhost:4000
NEXT_PUBLIC_USER_API=http://localhost:5000
NEXT_PUBLIC_PRODUCT_API=http://localhost:5001/api
NEXT_PUBLIC_CART_API=http://localhost:5002/api
NEXT_PUBLIC_ORDER_API=http://localhost:5003/api
NEXT_PUBLIC_PAYMENT_API=http://localhost:5004/api
EOF

echo "✅ All .env files created successfully!"
echo "📝 Run this script anytime with: bash setup-env.sh"

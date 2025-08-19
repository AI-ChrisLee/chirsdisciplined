# ReadyToSell - Database & Backend Architecture Plan

## Project Overview
**Chris Disciplined** - Operating System for Human Subconscious
A transformation platform using daily voice recordings, affirmations, and violent action framework to reprogram the subconscious mind.

## Tech Stack
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **AI Integration**: ChatGPT API (OpenAI)
- **Email Marketing**: ConvertKit
- **Hosting**: Vercel
- **Storage**: Supabase Storage (for audio recordings & images)
- **Real-time**: Supabase Realtime (for live updates)

---

## 1. Database Schema (Supabase)

### Core Tables

#### users (extends Supabase auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  member_number TEXT UNIQUE, -- e.g., "047"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Subscription
  subscription_status TEXT DEFAULT 'trial', -- trial, active, cancelled, past_due
  subscription_tier TEXT DEFAULT 'founding', -- founding, standard, premium
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_price INTEGER DEFAULT 997, -- in cents ($9.97)
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  is_founding_member BOOLEAN DEFAULT FALSE,
  
  -- Profile
  timezone TEXT DEFAULT 'UTC',
  morning_protocol_time TIME DEFAULT '05:30',
  evening_review_time TIME DEFAULT '20:00',
  
  -- Stats
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_completed INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  average_discipline_rating DECIMAL(3,1) DEFAULT 0
);
```

#### daily_sessions
```sql
CREATE TABLE public.daily_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Morning Protocol
  morning_completed BOOLEAN DEFAULT FALSE,
  morning_completed_at TIMESTAMPTZ,
  recording_url TEXT, -- Supabase Storage URL
  recording_duration INTEGER, -- in seconds
  affirmations_version INTEGER DEFAULT 1, -- track which version was used
  vision_board_viewed BOOLEAN DEFAULT FALSE,
  
  -- Violent Action
  violent_action TEXT,
  violent_action_set_at TIMESTAMPTZ,
  action_completed BOOLEAN,
  
  -- Evening Review
  evening_completed BOOLEAN DEFAULT FALSE,
  evening_completed_at TIMESTAMPTZ,
  discipline_rating INTEGER CHECK (discipline_rating >= 1 AND discipline_rating <= 10),
  biggest_win TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- Index for fast queries
CREATE INDEX idx_daily_sessions_user_date ON daily_sessions(user_id, date DESC);
```

#### affirmations
```sql
CREATE TABLE public.affirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL, -- HTML content from Tiptap editor
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, version)
);
```

#### vision_boards
```sql
CREATE TABLE public.vision_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL, -- 1-8 for grid position
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, position)
);
```

#### violent_actions_library
```sql
CREATE TABLE public.violent_actions_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- business, personal, relationship, health
  action TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER DEFAULT 5, -- 1-10
  times_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### user_settings
```sql
CREATE TABLE public.user_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  push_notifications BOOLEAN DEFAULT TRUE,
  email_reminders BOOLEAN DEFAULT TRUE,
  sound_enabled BOOLEAN DEFAULT TRUE,
  auto_play_recording BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'light',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Daily sessions policies
CREATE POLICY "Users can manage own sessions" ON daily_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Affirmations policies
CREATE POLICY "Users can manage own affirmations" ON affirmations
  FOR ALL USING (auth.uid() = user_id);

-- Vision boards policies
CREATE POLICY "Users can manage own vision boards" ON vision_boards
  FOR ALL USING (auth.uid() = user_id);

-- Settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = id);
```

---

## 2. Authentication Flow (Supabase Auth)

### Sign Up Flow
1. User enters email/password or uses Google OAuth
2. Create Supabase auth user
3. Trigger `on_auth_user_created` function:
   - Create profile record
   - Assign member number
   - Create default settings
   - Send welcome email via ConvertKit
4. Redirect to qualification/payment flow

### Sign In Flow
1. Authenticate via Supabase Auth
2. Check subscription status
3. Update last_seen timestamp
4. Redirect to dashboard

### Database Functions
```sql
-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. API Endpoints & Backend Logic

### Supabase Edge Functions

#### `/api/daily-session`
```typescript
// GET - Get today's session
export async function GET(req: Request) {
  const { data: session } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
    
  return session || createNewSession();
}

// POST - Update session
export async function POST(req: Request) {
  const updates = await req.json();
  
  const { data } = await supabase
    .from('daily_sessions')
    .upsert({
      user_id: userId,
      date: today,
      ...updates,
      updated_at: new Date()
    });
    
  // Update streak calculation
  await updateUserStreaks(userId);
  
  return data;
}
```

#### `/api/upload-recording`
```typescript
export async function POST(req: Request) {
  const audioBlob = await req.blob();
  const fileName = `${userId}/${date}-recording.webm`;
  
  // Upload to Supabase Storage
  const { data } = await supabase.storage
    .from('recordings')
    .upload(fileName, audioBlob);
    
  // Update session with recording URL
  await supabase
    .from('daily_sessions')
    .update({ 
      recording_url: data.path,
      recording_duration: duration,
      morning_completed: true,
      morning_completed_at: new Date()
    })
    .eq('user_id', userId)
    .eq('date', today);
    
  return { success: true, url: data.path };
}
```

#### `/api/generate-affirmations`
```typescript
export async function POST(req: Request) {
  const { userData } = await req.json();
  
  // Call ChatGPT API
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Generate powerful, personalized affirmations based on user goals..."
      },
      {
        role: "user",
        content: JSON.stringify(userData)
      }
    ],
    temperature: 0.8,
    max_tokens: 2000
  });
  
  const affirmations = completion.choices[0].message.content;
  
  // Save to database
  await supabase
    .from('affirmations')
    .insert({
      user_id: userId,
      content: affirmations,
      version: nextVersion
    });
    
  return { affirmations };
}
```

#### `/api/streak-calculation`
```typescript
async function updateUserStreaks(userId: string) {
  // Get last 90 days of sessions
  const { data: sessions } = await supabase
    .from('daily_sessions')
    .select('date, morning_completed')
    .eq('user_id', userId)
    .gte('date', last90Days)
    .order('date', { ascending: false });
    
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  sessions.forEach(session => {
    if (session.morning_completed) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });
  
  // Update profile
  await supabase
    .from('profiles')
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_days_completed: completedCount,
      completion_rate: (completedCount / 90) * 100
    })
    .eq('id', userId);
}
```

---

## 4. Third-Party Integrations

### Stripe Integration
```typescript
// Webhook handler for subscription events
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  
  switch (event.type) {
    case 'customer.subscription.created':
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          stripe_subscription_id: event.data.object.id,
          subscription_started_at: new Date()
        })
        .eq('stripe_customer_id', event.data.object.customer);
      break;
      
    case 'customer.subscription.deleted':
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_ends_at: new Date()
        })
        .eq('stripe_customer_id', event.data.object.customer);
      break;
  }
}

// Create checkout session
export async function createCheckoutSession(userId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: process.env.STRIPE_PRICE_ID, // $997/month
      quantity: 1
    }],
    mode: 'subscription',
    success_url: `${domain}/payment/success`,
    cancel_url: `${domain}/payment/cancel`,
    metadata: { userId }
  });
  
  return session;
}
```

### ConvertKit Integration
```typescript
// Add subscriber on signup
export async function addSubscriber(email: string, name: string) {
  await fetch(`https://api.convertkit.com/v3/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      email,
      first_name: name,
      tags: ['chris-user', 'founding-member'],
      fields: {
        member_number: memberNumber,
        signup_date: new Date()
      }
    })
  });
}

// Send weekly progress email
export async function sendWeeklyEmail(userId: string) {
  const stats = await getUserWeeklyStats(userId);
  
  await fetch(`https://api.convertkit.com/v3/broadcasts`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: process.env.CONVERTKIT_API_KEY,
      subject: `Week ${stats.weekNumber} - ${stats.streak} Day Streak!`,
      content: generateEmailContent(stats),
      subscriber_ids: [subscriberId]
    })
  });
}
```

### ChatGPT Integration
```typescript
// Generate daily violent action suggestions
export async function generateViolentActions(userContext: any) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Generate 3 personalized "violent actions" - bold moves that push comfort zones.
                  Based on user's goals and recent actions, suggest progressively challenging actions.`
      },
      {
        role: "user",
        content: JSON.stringify(userContext)
      }
    ],
    temperature: 0.9,
    max_tokens: 500
  });
  
  return completion.choices[0].message.content;
}

// Analyze user progress and provide insights
export async function analyzeProgress(sessions: any[]) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Analyze user's transformation progress and provide actionable insights..."
      },
      {
        role: "user",
        content: JSON.stringify(sessions)
      }
    ]
  });
  
  return completion.choices[0].message.content;
}
```

---

## 5. Real-time Features (Supabase Realtime)

### Live Streak Updates
```typescript
// Subscribe to streak changes
const subscription = supabase
  .channel('streak-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${userId}`
    },
    (payload) => {
      // Update UI with new streak
      updateStreakDisplay(payload.new.current_streak);
    }
  )
  .subscribe();
```

### Community Features (Future)
```typescript
// Real-time leaderboard
const leaderboard = supabase
  .channel('leaderboard')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'profiles'
    },
    async () => {
      // Refresh leaderboard
      const { data } = await supabase
        .from('profiles')
        .select('full_name, current_streak, member_number')
        .order('current_streak', { ascending: false })
        .limit(50);
        
      updateLeaderboard(data);
    }
  )
  .subscribe();
```

---

## 6. Background Jobs & Cron Functions

### Daily Reminders (Supabase Cron)
```sql
-- Run every day at 5:00 AM UTC
SELECT cron.schedule(
  'morning-reminder',
  '0 5 * * *',
  $$
  SELECT send_morning_reminders();
  $$
);

CREATE OR REPLACE FUNCTION send_morning_reminders()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT * FROM profiles 
    WHERE subscription_status = 'active'
  LOOP
    -- Queue push notification
    INSERT INTO notification_queue (
      user_id, 
      type, 
      message,
      scheduled_for
    ) VALUES (
      user_record.id,
      'morning_reminder',
      'Time for your morning protocol!',
      NOW()
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### Streak Reset Check
```sql
-- Run daily at midnight
SELECT cron.schedule(
  'streak-check',
  '0 0 * * *',
  $$
  UPDATE profiles
  SET current_streak = 0
  WHERE id IN (
    SELECT user_id 
    FROM daily_sessions
    WHERE date = CURRENT_DATE - 1
    AND morning_completed = false
  );
  $$
);
```

---

## 7. Storage Structure (Supabase Storage)

### Buckets
```
recordings/
  ├── {user_id}/
  │   ├── 2024-01-15-recording.webm
  │   ├── 2024-01-16-recording.webm
  │   └── ...
  
vision-boards/
  ├── {user_id}/
  │   ├── image-1.jpg
  │   ├── image-2.jpg
  │   └── ...
  
exports/
  ├── {user_id}/
  │   ├── progress-report-2024-01.pdf
  │   └── ...
```

### Storage Policies
```sql
-- Users can only access their own recordings
CREATE POLICY "Users own recordings" ON storage.objects
  FOR ALL USING (
    bucket_id = 'recordings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 8. Performance Optimizations

### Database Indexes
```sql
-- Fast session lookups
CREATE INDEX idx_sessions_user_date ON daily_sessions(user_id, date DESC);
CREATE INDEX idx_sessions_morning ON daily_sessions(morning_completed) WHERE morning_completed = true;

-- Streak calculations
CREATE INDEX idx_profiles_streak ON profiles(current_streak DESC);

-- Subscription queries
CREATE INDEX idx_profiles_subscription ON profiles(subscription_status, subscription_ends_at);
```

### Caching Strategy
- Cache user profile in Redis/Vercel KV (5 min TTL)
- Cache today's session data (1 min TTL)
- Cache affirmations (24 hour TTL)
- Use Vercel Edge caching for static assets

### Query Optimization
```typescript
// Batch load weekly data
const getWeeklyData = async (userId: string) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const { data } = await supabase
    .from('daily_sessions')
    .select(`
      *,
      profiles!inner(
        current_streak,
        longest_streak,
        average_discipline_rating
      )
    `)
    .eq('user_id', userId)
    .gte('date', startDate.toISOString())
    .order('date', { ascending: false });
    
  return data;
};
```

---

## 9. Security Considerations

### Data Protection
- All audio recordings encrypted at rest
- SSL/TLS for all data in transit
- RLS policies enforce user isolation
- API rate limiting (100 req/min per user)

### Authentication Security
- JWT tokens with 1-hour expiry
- Refresh tokens stored securely
- MFA support via Supabase Auth
- Session management with device tracking

### PII Handling
- GDPR compliant data deletion
- User data export functionality
- Encrypted backups
- Audit logs for data access

---

## 10. Monitoring & Analytics

### Key Metrics to Track
```sql
-- Daily Active Users
SELECT COUNT(DISTINCT user_id) 
FROM daily_sessions 
WHERE date = CURRENT_DATE;

-- Completion Rate
SELECT 
  AVG(CASE WHEN morning_completed THEN 1 ELSE 0 END) as morning_rate,
  AVG(CASE WHEN evening_completed THEN 1 ELSE 0 END) as evening_rate
FROM daily_sessions 
WHERE date >= CURRENT_DATE - INTERVAL '30 days';

-- Revenue Metrics
SELECT 
  COUNT(*) as total_subscribers,
  SUM(subscription_price) as mrr
FROM profiles 
WHERE subscription_status = 'active';
```

### Error Tracking
- Sentry for error monitoring
- Supabase logs for database issues
- Vercel Analytics for performance
- Custom alerts for critical failures

---

## 11. Deployment Plan

### Phase 1: MVP (Week 1-2)
1. Set up Supabase project
2. Create database schema
3. Implement auth flow
4. Basic CRUD operations
5. File upload for recordings

### Phase 2: Core Features (Week 3-4)
1. Stripe integration
2. Daily session tracking
3. Streak calculations
4. Basic email notifications

### Phase 3: AI & Automation (Week 5-6)
1. ChatGPT integration
2. ConvertKit setup
3. Automated reminders
4. Progress analytics

### Phase 4: Optimization (Week 7-8)
1. Performance tuning
2. Real-time features
3. Advanced analytics
4. Mobile optimization

---

## 12. Cost Estimation (Monthly)

### Infrastructure Costs
- **Supabase**: $25/month (Pro plan)
- **Vercel**: $20/month (Pro plan)
- **Stripe**: 2.9% + $0.30 per transaction
- **OpenAI**: ~$50-100/month (depending on usage)
- **ConvertKit**: $29/month (up to 1,000 subscribers)

### At 50 Users ($997/month each)
- Revenue: $49,850/month
- Stripe fees: ~$1,500/month
- Infrastructure: ~$200/month
- **Net**: ~$48,150/month

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# OpenAI
OPENAI_API_KEY=

# ConvertKit
CONVERTKIT_API_KEY=
CONVERTKIT_API_SECRET=

# Vercel
VERCEL_URL=
```

---

## Next Steps

1. **Set up Supabase project** and create initial schema
2. **Configure authentication** with email/password and Google OAuth
3. **Implement core user flows** (signup, daily protocol, progress tracking)
4. **Integrate Stripe** for subscription management
5. **Add ChatGPT** for affirmation generation
6. **Set up ConvertKit** for email automation
7. **Deploy to Vercel** with environment variables
8. **Test end-to-end** with real users
9. **Monitor and optimize** based on usage patterns

---

This architecture is designed to be:
- **Scalable**: Can handle 500M+ users with proper scaling
- **Simple**: Uses Supabase for most backend needs
- **Cost-effective**: Minimal infrastructure costs
- **Maintainable**: Clear separation of concerns
- **Secure**: RLS policies and proper authentication
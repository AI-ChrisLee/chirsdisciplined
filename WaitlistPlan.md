# Waitlist Flow - Temporary Launch Plan

## Overview
Temporary flow change to use waitlist instead of immediate payment processing. Keep all existing UI/UX, just redirect payment flow to waitlist capture.

## Current Flow (Keep Everything)
1. Landing Page → ✅ Keep
2. Qualification → ✅ Keep  
3. Sign Up → ✅ Keep
4. ~~Payment~~ → 🔄 **Replace with Waitlist**
5. Dashboard → ✅ Keep (for testing/demo)

---

## Waitlist Implementation Plan

### 1. Database Changes
Add waitlist table to existing schema:

```sql
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  position INTEGER, -- Waitlist position number
  status TEXT DEFAULT 'pending', -- pending, approved, converted
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  notes TEXT, -- Why they want to join
  referral_source TEXT,
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own waitlist status" ON waitlist
  FOR SELECT USING (auth.uid() = user_id);
```

### 2. Flow Changes

#### After Sign Up:
Instead of `/payment` → Redirect to `/waitlist`

#### Waitlist Page (`/app/waitlist/page.tsx`):
- Show their position in line
- "You're #47 on the waitlist!"
- Estimated launch date
- Benefits they'll get as founding member
- Share buttons to move up the list
- "We'll email you when doors open"

#### Email Capture:
- Store in Supabase waitlist table
- Optional: Connect to ConvertKit later
- Send position number via email

### 3. Waitlist API Endpoints

#### `/api/waitlist/join`
```typescript
// POST - Add user to waitlist
- Check if qualified (from localStorage)
- Add to waitlist with position number
- Send confirmation email (optional)
- Return position number
```

#### `/api/waitlist/status`
```typescript
// GET - Check waitlist position
- Return current position
- Total people ahead
- Estimated wait time
```

#### `/api/waitlist/share`
```typescript
// POST - Track shares for moving up
- Generate unique referral link
- Move up 3 spots per successful referral
```

### 4. Admin Dashboard (Simple)
Create `/admin/waitlist` to:
- View all waitlist members
- Manually approve users
- Export emails
- See stats

### 5. Modified User Flow

```
Landing → Qualification → Sign Up → Waitlist → (Wait) → Email Notification → Payment → Dashboard
                                        ↓
                                  [Position #X]
                                  [Share to Skip]
```

### 6. UI Updates Needed

#### `/app/payment/page.tsx` → `/app/waitlist/page.tsx`
- Keep same design aesthetic
- Replace payment form with:
  - Waitlist position display
  - Benefits reminder
  - Share buttons
  - "Notify me" confirmation

#### Update Navigation:
- `signup/page.tsx`: Change redirect from `/payment` to `/waitlist`
- `qualification/page.tsx`: Update copy to mention "join waitlist"

### 7. Quick Implementation Steps

1. **Create waitlist table** ✓
2. **Create `/app/waitlist/page.tsx`**
3. **Create `/api/waitlist/join` endpoint**
4. **Update signup redirect**
5. **Add waitlist status to auth provider**
6. **Create success messaging**

### 8. Launch Benefits

#### For You:
- Launch immediately without Stripe
- Build audience before payment setup
- Create urgency/FOMO
- Test core features with early users
- Get feedback before charging

#### For Users:
- Exclusive "Founding Member" status
- Special pricing when launched
- Early access to features
- Lower member number (#001-100)

### 9. Conversion Strategy

When Stripe is ready:
1. Email top 50 on waitlist
2. Give 48-hour exclusive access
3. Special founding price ($9.97 vs future $19.97)
4. Roll out in batches
5. Create urgency with limited spots

### 10. Temporary Test Mode

For development/demo:
- Add "Test Mode" flag in profiles
- Bypass payment for test accounts
- Access full dashboard for testing

```typescript
// In auth provider
const isTestMode = profile?.subscription_status === 'test_mode'
if (isTestMode) {
  // Allow full access
}
```

---

## Implementation Priority

### Phase 1 (Today):
1. Create waitlist table ✅
2. Create waitlist page
3. Update redirects
4. Basic join endpoint

### Phase 2 (Optional):
1. Share-to-skip feature
2. Admin dashboard
3. Email notifications
4. Referral tracking

### Phase 3 (When Stripe Ready):
1. Payment integration
2. Batch invitations
3. Convert waitlist → paid

---

## Code Changes Needed

### 1. Update `app/signup/page.tsx`:
```typescript
// Line 41-44
router.push('/waitlist') // Instead of '/payment'
```

### 2. Update `providers/supabase-auth-provider.tsx`:
```typescript
// After signup
router.push('/waitlist') // Instead of '/qualification'
```

### 3. Update profile check:
```typescript
// Check waitlist status instead of subscription
const { data: waitlistStatus } = await supabase
  .from('waitlist')
  .select('position, status')
  .eq('user_id', user.id)
  .single()
```

---

## Benefits of This Approach

✅ **Minimal Code Changes** - Mostly just redirects
✅ **Keep Everything Built** - Don't lose any work
✅ **Launch Today** - No Stripe blocking
✅ **Build Hype** - Waitlist creates exclusivity
✅ **Validate Interest** - See real demand
✅ **Email List** - Build audience for launch
✅ **Test Features** - Use test mode for development

---

## Success Metrics

- Waitlist signups goal: 500 in first month
- Share rate: 20% share for early access
- Conversion rate target: 30% waitlist → paid
- Launch target: When 500+ on waitlist

This approach lets you launch immediately while building anticipation for the paid version!
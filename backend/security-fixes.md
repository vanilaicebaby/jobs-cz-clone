# Security Audit Report - BMW Carbon Shop API

## Critical Vulnerabilities Found

### 1. ❌ CRITICAL: Weak Password Hashing (SHA-256 without salt)
**Location:** `lambda.js:22-24`
**Issue:** Passwords hashed with SHA-256 only, no salt, vulnerable to rainbow tables
**Risk Level:** CRITICAL
**Fix:** Replace with bcrypt (cost factor 10+)

```javascript
// VULNERABLE CODE:
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// FIXED CODE:
import bcrypt from 'bcryptjs';
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
```

### 2. ❌ HIGH: Inefficient Auth (ScanCommand on entire table)
**Location:** `lambda.js:316-322`
**Issue:** ScanCommand reads entire users table for every auth request
**Risk Level:** HIGH (Performance + Cost)
**Fix:** Create GSI on authToken field

```javascript
// VULNERABLE CODE:
const command = new ScanCommand({
  TableName: USERS_TABLE,
  FilterExpression: 'authToken = :token',
  ExpressionAttributeValues: { ':token': token },
});

// FIXED CODE:
const command = new QueryCommand({
  TableName: USERS_TABLE,
  IndexName: 'AuthTokenIndex',
  KeyConditionExpression: 'authToken = :token',
  ExpressionAttributeValues: { ':token': token },
});
```

### 3. ❌ HIGH: No Input Validation
**Location:** All endpoints
**Issue:** No validation for email, phone, names, addresses
**Risk Level:** HIGH
**Fix:** Add comprehensive input validation

### 4. ❌ HIGH: No Rate Limiting
**Location:** `/auth/login`, `/auth/register`
**Issue:** Brute force attacks possible
**Risk Level:** HIGH
**Fix:** Implement rate limiting (max 5 attempts per IP per minute)

### 5. ⚠️ MEDIUM: Information Disclosure
**Location:** `lambda.js:361`
**Issue:** "User already exists" reveals existing emails
**Risk Level:** MEDIUM
**Fix:** Generic error messages

### 6. ⚠️ MEDIUM: No Security Headers
**Issue:** Missing security headers (CSP, HSTS, X-Frame-Options)
**Risk Level:** MEDIUM
**Fix:** Add security headers to all responses

### 7. ⚠️ LOW: Error Messages Expose Stack
**Location:** Multiple catch blocks
**Issue:** `error.message` exposes internal details
**Risk Level:** LOW
**Fix:** Remove `message: error.message` in production

## DynamoDB Injection Analysis

✅ **SAFE:** AWS SDK uses parameterized queries
- ExpressionAttributeValues prevent injection
- No string concatenation in queries
- All queries use proper SDK methods

## Recommendations Priority

1. **IMMEDIATE (Deploy today):**
   - Add input validation
   - Replace SHA-256 with bcrypt
   - Remove error.message from responses

2. **HIGH (Deploy this week):**
   - Create AuthTokenIndex GSI
   - Add rate limiting
   - Add security headers

3. **MEDIUM (Nice to have):**
   - Generic error messages
   - Add CAPTCHA for login
   - Add 2FA support

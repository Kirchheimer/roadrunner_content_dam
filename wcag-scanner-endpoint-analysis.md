# WCAG Scanner Endpoint Analysis

## Issue Summary
The `/api/demo/scan` endpoint on `https://wcagscanner.com` is returning a 404 "Endpoint not found" error.

## Test Results

### 1. Demo Scan Endpoint - ❌ FAILED
```bash
curl -X POST https://wcagscanner.com/api/demo/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```
**Response:** HTTP 404 - `{"error":"Endpoint not found"}`

### 2. Health Check Endpoint - ✅ SUCCESS
```bash
curl https://wcagscanner.com/health
```
**Response:** HTTP 200 - Server is healthy and running
- Service: backend-service  
- Storage service: Available
- Organizations: 6 active
- Users: 9 registered

### 3. API Root Path - ❌ FAILED
```bash
curl https://wcagscanner.com/api/
```
**Response:** HTTP 404 - `{"error":"Endpoint not found"}`

## Root Cause Analysis

The server infrastructure is working, but there are multiple routing issues:

1. **Server Infrastructure**: ✅ Working (Cloudflare proxy, SSL cert valid)
2. **Frontend Service**: ✅ Working (main website loads)
3. **Backend Service**: ✅ Running (health check responds)
4. **API Endpoint**: ❌ Missing from backend code
5. **Nginx Configuration**: ❌ API routes not properly configured

**Key Finding:** The `/api/demo/scan` returns backend JSON error while `/demo/scan` returns nginx HTML error, indicating different routing behaviors.

## Potential Causes

1. **Code Deployment Issue**: The latest code containing the demo scan endpoint hasn't been deployed to production
2. **Environment Configuration**: The endpoint might be disabled in production environment
3. **Proxy/Nginx Configuration**: API routes not properly forwarded to the backend service
4. **Path Mismatch**: The endpoint might exist under a different path structure

## Expected Endpoint Behavior

Based on the testkennel project code analysis, the endpoint should:

- Accept POST requests to `/api/demo/scan`
- Require `{"url": "string"}` in request body  
- Apply IP-based rate limiting (5 scans per day)
- Return WCAG scan results with:
  - Issues found
  - Severity breakdown
  - Overall compliance score
  - HTML report (base64 encoded)

## Recommended Solutions

### 1. 🚨 CRITICAL: Deploy Missing Backend Code
The `/api/demo/scan` endpoint is completely missing from production. Deploy the endpoint code:

```javascript
// Demo WCAG scan endpoint (no auth required)
app.post('/api/demo/scan', async (req, res) => {
  try {
    // Apply rate limiting by IP
    await demoRateLimiter.consume(req.ip);
    
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }
    
    // Validate URL format
    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Only HTTP and HTTPS URLs are allowed' 
        });
      }
    } catch (e) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid URL format' 
      });
    }
    
    console.log(`[Demo] Starting WCAG scan for: ${url} (IP: ${req.ip})`);
    
    // Run the single page scanner
    const { scanSinglePage } = require('./single-page-scanner');
    const results = await scanSinglePage(url, { 
      logger: console
    });
    
    res.json({
      success: true,
      url: results.url,
      timestamp: results.timestamp,
      summary: results.summary,
      issues: results.results.issues.slice(0, 10), // Top 10 issues
      total_issues: results.results.issues.length,
    });
    
  } catch (error) {
    if (error.message && error.message.includes('Rate limit')) {
      return res.status(429).json({ 
        success: false,
        error: 'Rate limit exceeded', 
        message: 'You have reached the maximum number of scans per day.'
      });
    }
    
    console.error('[Demo] Scan error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Scan failed', 
      message: 'Unable to complete the accessibility scan.'
    });
  }
});
```

### 2. Add Route Registration Logging
Add debug logging to confirm endpoint registration:
```javascript
console.log('Demo scan endpoint registered at /api/demo/scan');
```

### 3. ⚠️ Fix Nginx Configuration
Current nginx setup routes `/api/` to backend but returns generic 404 for unknown API paths. Verify nginx config includes:

```nginx
location /api/ {
    proxy_pass http://backend-service:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 4. Add Rate Limiter Configuration
Ensure the demo rate limiter is properly configured:
```javascript
const demoRateLimiter = new RateLimiterMemory({
  keyPrefix: 'demo_scan',
  keyBuilder: (req) => req.ip,
  points: 5, // 5 scans
  duration: 86400, // per day (in seconds)
});
```
### 4. Alternative Path Testing - ❌ FAILED
```bash
curl -X POST https://wcagscanner.com/demo/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```
**Response:** HTTP 404 - nginx-level 404 (not routed to backend)

### 5. Main Website - ✅ SUCCESS
```bash
curl -I https://wcagscanner.com/
```
**Response:** HTTP 200 - Frontend is working correctly

## Server Environment Details
- **Domain**: wcagscanner.com
- **CDN**: Cloudflare 
- **SSL**: Valid (Google Trust Services)
- **Protocol**: HTTP/2
- **Backend**: Node.js Express application
- **Organizations**: 6 (Sep102, aiken, demo, n4tn4t2n4tn4t2, rei, testorg)

## Next Steps
1. Deploy the missing endpoint code to production
2. Verify endpoint registration in server logs
3. Update any proxy/routing configuration
4. Test the endpoint functionality
5. Monitor for any additional issues

---
*Analysis conducted: October 13, 2025*

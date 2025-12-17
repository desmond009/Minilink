#!/usr/bin/env node

/**
 * Production-Grade URL Shortener Backend Test Suite
 * Tests all major endpoints and functionality
 */

const API_BASE = 'http://localhost:3000';
let authToken = '';
let createdUrlId = '';
let shortId = '';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    section: (msg) => console.log(`\n${colors.blue}━━━ ${msg} ━━━${colors.reset}`)
};

// Test helper function
async function testEndpoint(name, method, url, body = null, headers = {}) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            log.success(`${name}: ${response.status}`);
            return { success: true, data, status: response.status };
        } else {
            log.error(`${name}: ${response.status} - ${data.message}`);
            return { success: false, data, status: response.status };
        }
    } catch (error) {
        log.error(`${name}: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Test Suite
async function runTests() {
    console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║         MiniLink Backend API Test Suite v2.0            ║
║         Production-Grade URL Shortener Testing           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

    log.info(`Testing API at: ${API_BASE}`);
    log.info(`Started at: ${new Date().toISOString()}\n`);

    // 1. Health Check
    log.section('Health Check');
    await testEndpoint('Server Health', 'GET', `${API_BASE}/`);
    await testEndpoint('API Health', 'GET', `${API_BASE}/api/health`);

    // 2. User Registration
    log.section('User Registration & Authentication');
    const registerResult = await testEndpoint(
        'Register User',
        'POST',
        `${API_BASE}/api/auth/register`,
        {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'SecurePass123'
        }
    );

    if (registerResult.success) {
        authToken = registerResult.data.token;
        log.info(`Auth token received: ${authToken.substring(0, 20)}...`);
    }

    // 3. User Login
    const loginResult = await testEndpoint(
        'Login User',
        'POST',
        `${API_BASE}/api/auth/login`,
        {
            email: registerResult.data.data.email,
            password: 'SecurePass123'
        }
    );

    if (loginResult.success && !authToken) {
        authToken = loginResult.data.token;
    }

    // 4. Get User Profile
    await testEndpoint(
        'Get User Profile',
        'GET',
        `${API_BASE}/api/auth/profile`,
        null,
        { Authorization: `Bearer ${authToken}` }
    );

    // 5. URL Shortening
    log.section('URL Shortening');
    const createUrlResult = await testEndpoint(
        'Create Short URL',
        'POST',
        `${API_BASE}/api/urls`,
        {
            originalUrl: 'https://github.com/nodejs/node',
            metadata: {
                title: 'Node.js GitHub',
                description: 'Official Node.js repository',
                tags: ['nodejs', 'github']
            }
        },
        { Authorization: `Bearer ${authToken}` }
    );

    if (createUrlResult.success) {
        createdUrlId = createUrlResult.data.data.id;
        shortId = createUrlResult.data.data.shortId;
        log.info(`Created short URL: ${createUrlResult.data.data.shortUrl}`);
        log.info(`Short ID: ${shortId}`);
    }

    // 6. Custom Alias
    await testEndpoint(
        'Create URL with Custom Alias',
        'POST',
        `${API_BASE}/api/urls`,
        {
            originalUrl: 'https://www.npmjs.com/package/express',
            customAlias: `test${Date.now()}`
        },
        { Authorization: `Bearer ${authToken}` }
    );

    // 7. URL with Expiration
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    await testEndpoint(
        'Create URL with Expiration',
        'POST',
        `${API_BASE}/api/urls`,
        {
            originalUrl: 'https://nodejs.org/docs/latest/api/',
            expiresAt: futureDate.toISOString()
        },
        { Authorization: `Bearer ${authToken}` }
    );

    // 8. Get User URLs
    log.section('URL Management');
    await testEndpoint(
        'Get All User URLs',
        'GET',
        `${API_BASE}/api/urls?page=1&limit=10`,
        null,
        { Authorization: `Bearer ${authToken}` }
    );

    // 9. Get Specific URL
    if (createdUrlId) {
        await testEndpoint(
            'Get URL by ID',
            'GET',
            `${API_BASE}/api/urls/${createdUrlId}`,
            null,
            { Authorization: `Bearer ${authToken}` }
        );
    }

    // 10. Update URL
    if (createdUrlId) {
        await testEndpoint(
            'Update URL',
            'PUT',
            `${API_BASE}/api/urls/${createdUrlId}`,
            {
                metadata: {
                    title: 'Updated Node.js GitHub',
                    description: 'Updated description'
                }
            },
            { Authorization: `Bearer ${authToken}` }
        );
    }

    // 11. Analytics
    log.section('Analytics & Statistics');
    await testEndpoint(
        'Get Dashboard Stats',
        'GET',
        `${API_BASE}/api/urls/stats/dashboard`,
        null,
        { Authorization: `Bearer ${authToken}` }
    );

    if (createdUrlId) {
        await testEndpoint(
            'Get URL Analytics',
            'GET',
            `${API_BASE}/api/urls/${createdUrlId}/analytics`,
            null,
            { Authorization: `Bearer ${authToken}` }
        );
    }

    // 12. QR Code
    log.section('QR Code Generation');
    if (createdUrlId) {
        await testEndpoint(
            'Get QR Code',
            'GET',
            `${API_BASE}/api/urls/${createdUrlId}/qrcode`,
            null,
            { Authorization: `Bearer ${authToken}` }
        );
    }

    // 13. Redirect Test (GET request, will redirect)
    log.section('URL Redirect');
    if (shortId) {
        log.info(`Testing redirect: ${API_BASE}/r/${shortId}`);
        log.info('Note: This will redirect, check manually in browser');
    }

    // 14. OAuth URLs
    log.section('OAuth Integration');
    await testEndpoint(
        'Get Google OAuth URL',
        'GET',
        `${API_BASE}/api/oauth/google/url`
    );

    // 15. Validation Tests
    log.section('Input Validation');
    await testEndpoint(
        'Invalid URL (should fail)',
        'POST',
        `${API_BASE}/api/urls`,
        { originalUrl: 'not-a-valid-url' },
        { Authorization: `Bearer ${authToken}` }
    );

    await testEndpoint(
        'Reserved Alias (should fail)',
        'POST',
        `${API_BASE}/api/urls`,
        {
            originalUrl: 'https://example.com',
            customAlias: 'api'
        },
        { Authorization: `Bearer ${authToken}` }
    );

    // 16. Profile Update
    log.section('Profile Management');
    await testEndpoint(
        'Update Profile',
        'PUT',
        `${API_BASE}/api/auth/profile`,
        { name: 'Updated Test User' },
        { Authorization: `Bearer ${authToken}` }
    );

    // 17. Cleanup (optional)
    log.section('Cleanup');
    if (createdUrlId) {
        await testEndpoint(
            'Delete URL',
            'DELETE',
            `${API_BASE}/api/urls/${createdUrlId}`,
            null,
            { Authorization: `Bearer ${authToken}` }
        );
    }

    // Summary
    console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║                   Test Suite Complete                     ║${colors.reset}`);
    console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}`);
    log.info(`Completed at: ${new Date().toISOString()}`);
    log.info(`\nManual Tests Required:`);
    console.log(`  1. Test redirect: ${API_BASE}/r/${shortId}`);
    console.log(`  2. Test Google OAuth flow in browser`);
    console.log(`  3. Test QR code download in browser`);
    console.log(`\n${colors.green}All automated tests completed!${colors.reset}\n`);
}

// Run tests
runTests().catch(error => {
    log.error(`Test suite failed: ${error.message}`);
    process.exit(1);
});

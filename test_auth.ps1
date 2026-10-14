# Auth & Admin Panel Validation Script (PowerShell)
# Tests authentication flow and admin CRUD operations

$API_URL = "http://localhost:3000/api"
$ADMIN_EMAIL = "admin@test.com"
$ADMIN_PASSWORD = "admin123"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "AUTH & ADMIN PANEL VALIDATION" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test User Registration
Write-Host "1. Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    name = "Admin User"
    email = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
    role = "admin"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -SessionVariable session `
        -ErrorAction SilentlyContinue
    
    Write-Host "✅ Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($registerResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Registration response: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
Write-Host ""

# 2. Test Admin Login
Write-Host "2. Testing Admin Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $ADMIN_EMAIL
    password = $ADMIN_PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -SessionVariable session `
        -ErrorAction Stop
    
    Write-Host "✅ Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Gray
    Write-Host "Cookies set: $($session.Cookies.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
Write-Host ""

# 3. Test Protected Route (Create Project)
Write-Host "3. Testing Protected Route (Create Project)..." -ForegroundColor Yellow
$projectBody = @{
    title = "Test Project"
    slug = "test-project-$(Get-Random -Maximum 9999)"
    description = "Test Description"
    images = @()
    tags = @("test")
    featured = $false
} | ConvertTo-Json

try {
    $projectResponse = Invoke-WebRequest -Uri "$API_URL/projects" `
        -Method POST `
        -ContentType "application/json" `
        -Body $projectBody `
        -WebSession $session `
        -ErrorAction Stop
    
    Write-Host "✅ Status: $($projectResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($projectResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Create project failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Error details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
Write-Host ""

# 4. Test GET Projects (public route)
Write-Host "4. Testing GET Projects (public route)..." -ForegroundColor Yellow
try {
    $getProjectsResponse = Invoke-WebRequest -Uri "$API_URL/projects" `
        -Method GET `
        -ErrorAction Stop
    
    Write-Host "✅ Status: $($getProjectsResponse.StatusCode)" -ForegroundColor Green
    $projects = ($getProjectsResponse.Content | ConvertFrom-Json).data
    Write-Host "Projects count: $($projects.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ GET projects failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Test Unauthorized Access (without session)
Write-Host "5. Testing Unauthorized Access (without login)..." -ForegroundColor Yellow
$serviceBody = @{
    title = "Test Service"
    slug = "test-service"
} | ConvertTo-Json

try {
    $unauthResponse = Invoke-WebRequest -Uri "$API_URL/services" `
        -Method POST `
        -ContentType "application/json" `
        -Body $serviceBody `
        -ErrorAction SilentlyContinue
    
    Write-Host "⚠️  Unexpected success - should have been rejected!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "✅ Correctly rejected with 403 Forbidden" -ForegroundColor Green
    } else {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}
Write-Host ""

# 6. Test Logout
Write-Host "6. Testing Logout..." -ForegroundColor Yellow
try {
    $logoutResponse = Invoke-WebRequest -Uri "$API_URL/auth/logout" `
        -Method POST `
        -WebSession $session `
        -ErrorAction Stop
    
    Write-Host "✅ Status: $($logoutResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($logoutResponse.Content)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️ Logout response: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "VALIDATION COMPLETE" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Define paths
$SourceDir = "C:\Users\jblue\Documents\Code\repos\portfolio"
$StageDir  = "C:\Users\jblue\Documents\portfolio_clean"
$RemoteDir = "jbluepolarbear@jeremyrobertanderson.com:/home/jbluepolarbear/jeremyrobertanderson.com"

Write-Host "1. Staging files (excluding .git)..." -ForegroundColor Cyan
# Robocopy returns exit codes that PowerShell sometimes misinterprets as errors.
# We wrap it or pass through safely.
& robocopy $SourceDir $StageDir /E /XD ".git" | Out-Null

Write-Host "2. Uploading contents to remote server..." -ForegroundColor Cyan
# Using the trailing \* ensures only the contents inside the staging folder are sent
scp -r "${StageDir}\*" $RemoteDir

Write-Host "3. Cleaning up temporary local files..." -ForegroundColor Cyan
if (Test-Path $StageDir) {
    Remove-Item -Recurse -Force $StageDir
}

Write-Host "Deployment complete!" -ForegroundColor Green

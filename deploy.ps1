[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$SourceDir = $PSScriptRoot,
    [ValidatePattern('^[a-zA-Z0-9_][a-zA-Z0-9_.-]*(?:@[a-zA-Z0-9][a-zA-Z0-9.-]*)?$')]
    [string]$RemoteTarget = 'jbluepolarbear@jeremyrobertanderson.com',
    [ValidatePattern('^/[a-zA-Z0-9_./-]*$')]
    [string]$RemoteDirectory = '/home/jbluepolarbear/jeremyrobertanderson.com',
    [uri]$PublicUrl = 'https://jeremyrobertanderson.com/'
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false

# Normalize before checking the destination: /, //, and /./ all mean root.
$PathParts = @($RemoteDirectory.Split('/') | Where-Object { $_ -ne '' -and $_ -ne '.' })
if ($PathParts.Count -eq 0 -or $PathParts -contains '..') {
    throw 'RemoteDirectory must be a specific website directory without parent traversal.'
}
$RemoteDirectory = '/' + ($PathParts -join '/')
if ($PublicUrl.Scheme -notin @('http', 'https') -or $PublicUrl.Query -or $PublicUrl.Fragment -or $PublicUrl.UserInfo) {
    throw 'PublicUrl must be an HTTP or HTTPS base URL without credentials, a query, or a fragment.'
}
$PublicBase = [uri]($PublicUrl.AbsoluteUri.TrimEnd('/') + '/')
$SourceDir = (Resolve-Path -LiteralPath $SourceDir).Path
$AssetDirectories = @('css', 'src', 'img', 'fonts')
foreach ($Entry in (@('index.html') + $AssetDirectories)) {
    if (-not (Test-Path -LiteralPath (Join-Path $SourceDir $Entry))) {
        throw "Missing publish entry: $Entry"
    }
}

if (-not $PSCmdlet.ShouldProcess("${RemoteTarget}:$RemoteDirectory", 'Upload and verify an isolated release, then atomically switch the homepage')) {
    return
}

Get-Command ssh, scp -ErrorAction Stop | Out-Null
$ReleaseId = [guid]::NewGuid().ToString('N')
$StageDir = Join-Path ([System.IO.Path]::GetTempPath()) "portfolio-deploy-$ReleaseId"
$AssetPrefix = "assets/$ReleaseId"
$ReleaseDir = Join-Path $StageDir $AssetPrefix
$RemoteRelease = "$RemoteDirectory/$AssetPrefix"
$PendingName = "index-$ReleaseId.pending.html"
$PendingFile = Join-Path $StageDir $PendingName
New-Item -ItemType Directory -Path $ReleaseDir -Force | Out-Null

function Assert-PublishedFile {
    param([System.IO.FileInfo]$LocalFile, [string]$RelativePath)
    $CheckUrl = [uri]::new($PublicBase, $RelativePath)
    $Response = Invoke-WebRequest -Uri $CheckUrl -UseBasicParsing -TimeoutSec 30
    if ($Response.StatusCode -ne 200) { throw "HTTP verification failed: $CheckUrl" }
    $ContentType = [string]$Response.Headers['Content-Type']
    if ($LocalFile.Extension -ne '.html' -and $ContentType -match 'text/html') {
        throw "Expected an asset but received HTML at $CheckUrl"
    }
    if (($LocalFile.Extension -eq '.css' -and $ContentType -notmatch 'text/css') -or
        ($LocalFile.Extension -eq '.js' -and $ContentType -notmatch '(java|ecma)script') -or
        ($LocalFile.Extension -eq '.html' -and $ContentType -notmatch 'text/html')) {
        throw "Invalid content type at $CheckUrl : $ContentType"
    }
    if ($Response.RawContentLength -ne $LocalFile.Length) {
        throw "Published content does not match the local file size at $CheckUrl"
    }
    $Digest = [System.Security.Cryptography.SHA256]::Create()
    try {
        $Response.RawContentStream.Position = 0
        $ActualHash = [System.BitConverter]::ToString($Digest.ComputeHash($Response.RawContentStream)).Replace('-', '')
        if ($ActualHash -ne (Get-FileHash -LiteralPath $LocalFile.FullName -Algorithm SHA256).Hash) {
            throw "Published content does not match the local SHA-256 hash at $CheckUrl"
        }
    }
    finally {
        $Digest.Dispose()
        $Response.RawContentStream.Dispose()
    }
}

try {
    # Publish only public asset directories. Each invocation uses new paths so
    # partial transfers cannot overwrite assets used by the current homepage.
    foreach ($Entry in $AssetDirectories) {
        Copy-Item -LiteralPath (Join-Path $SourceDir $Entry) -Destination $ReleaseDir -Recurse -Force
    }
    $Html = [System.IO.File]::ReadAllText((Join-Path $SourceDir 'index.html'))
    foreach ($Entry in $AssetDirectories) {
        foreach ($Attribute in @('src', 'href')) {
            $Html = $Html.Replace("$Attribute=`"$Entry/", "$Attribute=`"$AssetPrefix/$Entry/")
        }
    }
    $ImageUrl = [uri]::new($PublicBase, "$AssetPrefix/img/dimensional-double-shift.webp").AbsoluteUri
    $Html = [regex]::Replace($Html, '(<meta property="og:image" content=")[^"]*(">)', ('${1}' + $ImageUrl + '${2}'))
    [System.IO.File]::WriteAllText($PendingFile, $Html, [System.Text.UTF8Encoding]::new($false))

    Write-Host 'Preparing an isolated release...' -ForegroundColor Cyan
    & ssh $RemoteTarget "mkdir -p '$RemoteRelease' && chmod 755 '$RemoteDirectory' '$RemoteDirectory/assets' '$RemoteRelease'"
    if ($LASTEXITCODE -ne 0) { throw 'SSH preparation failed. Check your host login and directory access.' }

    Write-Host 'Uploading versioned assets...' -ForegroundColor Cyan
    $LocalAssetPaths = $AssetDirectories | ForEach-Object { Join-Path $ReleaseDir $_ }
    & scp -r @LocalAssetPaths "${RemoteTarget}:${RemoteRelease}/"
    if ($LASTEXITCODE -ne 0) { throw 'Asset upload failed; the current release was not changed.' }

    # Fix traversal permissions before descending into folders copied from Windows.
    & ssh $RemoteTarget "find '$RemoteRelease' -type d -exec chmod 755 {} \; && find '$RemoteRelease' -type f -exec chmod 644 {} +"
    if ($LASTEXITCODE -ne 0) { throw 'Could not set release asset permissions; the current release was not changed.' }

    Write-Host 'Verifying every versioned asset...' -ForegroundColor Cyan
    foreach ($AssetFile in (Get-ChildItem -LiteralPath $ReleaseDir -File -Recurse)) {
        $RelativePath = $AssetFile.FullName.Substring($StageDir.Length + 1).Replace('\', '/')
        Assert-PublishedFile -LocalFile $AssetFile -RelativePath $RelativePath
    }

    Write-Host 'Uploading and verifying the pending homepage...' -ForegroundColor Cyan
    & scp $PendingFile "${RemoteTarget}:${RemoteDirectory}/$PendingName"
    if ($LASTEXITCODE -ne 0) { throw 'Pending homepage upload failed; the current release was not changed.' }
    & ssh $RemoteTarget "chmod 644 '$RemoteDirectory/$PendingName'"
    if ($LASTEXITCODE -ne 0) { throw 'Could not set pending homepage permissions; the current release was not changed.' }
    Assert-PublishedFile -LocalFile (Get-Item -LiteralPath $PendingFile) -RelativePath $PendingName

    # Both paths share a directory/filesystem. Rename replaces the HTML atomically;
    # readers get either the complete old release or the complete new release.
    Write-Host 'Activating the verified release...' -ForegroundColor Cyan
    & ssh $RemoteTarget "mv -fT -- '$RemoteDirectory/$PendingName' '$RemoteDirectory/index.html'"
    if ($LASTEXITCODE -ne 0) { throw 'Homepage activation failed. The host may serve the previous or the complete new release; verify before retrying.' }
    Assert-PublishedFile -LocalFile (Get-Item -LiteralPath $PendingFile) -RelativePath 'index.html'
    Write-Host "Deployment verified: $PublicBase" -ForegroundColor Green
}
finally {
    # Delete only this invocation's local staging directory. Retain old remote
    # assets so visitors with a cached homepage can still load their release.
    $ResolvedStage = [System.IO.Path]::GetFullPath($StageDir)
    $ResolvedTemp = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath()).TrimEnd('\', '/')
    if ($ResolvedStage.StartsWith($ResolvedTemp + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase) -and
        [System.IO.Path]::GetFileName($ResolvedStage) -match '^portfolio-deploy-[a-f0-9]{32}$') {
        Remove-Item -LiteralPath $ResolvedStage -Recurse -Force
    }
}

# SSH, SCP, and HTTP use an in-memory remote filesystem. No production access.
$ErrorActionPreference = 'Stop'
$Repository = Split-Path $PSScriptRoot -Parent
$DeployScript = Join-Path $Repository 'deploy.ps1'

function Assert-True($Condition, $Message) {
    if (-not $Condition) { throw $Message }
}

function New-TestState([string]$Scenario, [string]$Baseline = 'legacy') {
    $Files = [System.Collections.Generic.Dictionary[string, byte[]]]::new()
    $Root = '/home/jbluepolarbear/jeremyrobertanderson.com'
    $Prefix = if ($Baseline -eq 'versioned') { 'assets/previous-release/' } else { '' }
    $Files["$Root/index.html"] = [System.Text.Encoding]::UTF8.GetBytes("<html><head><link rel=`"stylesheet`" href=`"${Prefix}css/app.css`"><script src=`"${Prefix}src/app.js`"></script></head><body><img src=`"${Prefix}img/old.jpg`"></body></html>")
    $Files["$Root/${Prefix}css/app.css"] = [System.Text.Encoding]::UTF8.GetBytes('body { color: blue; }')
    $Files["$Root/${Prefix}src/app.js"] = [System.Text.Encoding]::UTF8.GetBytes('/* previous working script */')
    $Files["$Root/${Prefix}img/old.jpg"] = [byte[]]@(1, 2, 3)
    [pscustomobject]@{
        Scenario = $Scenario
        Root = $Root
        PublicPath = '/'
        Files = $Files
        Calls = [System.Collections.Generic.List[object]]::new()
        Stages = [System.Collections.Generic.HashSet[string]]::new()
    }
}

function ssh {
    $State = $global:PortfolioDeployTestState
    $CommandText = [string]$args[-1]
    $State.Calls.Add([pscustomobject]@{ Command = 'ssh'; Arguments = @($args) })
    $global:LASTEXITCODE = 0
    if (($State.Scenario -eq 'ssh-failure' -and $CommandText.StartsWith('mkdir ')) -or
        ($State.Scenario -eq 'permissions-failure' -and $CommandText.StartsWith('find ')) -or
        ($State.Scenario -eq 'pending-permissions-failure' -and $CommandText.StartsWith('chmod ')) -or
        ($State.Scenario -eq 'activation-failure' -and $CommandText.StartsWith('mv '))) {
        $global:LASTEXITCODE = 1
        return
    }
    if ($CommandText -match "^mv -fT -- '([^']+)' '([^']+)'$") {
        $FromPath, $ToPath = $Matches[1], $Matches[2]
        Assert-True ($State.Files.ContainsKey($FromPath)) 'Activation source does not exist.'
        $State.Files[$ToPath] = $State.Files[$FromPath]
        $State.Files.Remove($FromPath) | Out-Null
        if ($State.Scenario -eq 'activation-unknown') { $global:LASTEXITCODE = 1 }
    }
}

function scp {
    $State = $global:PortfolioDeployTestState
    $State.Calls.Add([pscustomobject]@{ Command = 'scp'; Arguments = @($args) })
    $global:LASTEXITCODE = 0
    Assert-True ([string]$args[-1] -match '^[^:]+:(/.*)$') 'Invalid SCP destination.'
    $Destination = $Matches[1]
    $Sources = @($args[0..($args.Count - 2)] | Where-Object { $_ -ne '-r' })
    $CopiedCount = 0
    foreach ($Source in $Sources) {
        if ($Source -match '(.*portfolio-deploy-[a-f0-9]{32})') { $State.Stages.Add($Matches[1]) | Out-Null }
        if (Test-Path -LiteralPath $Source -PathType Container) {
            foreach ($File in (Get-ChildItem -LiteralPath $Source -File -Recurse)) {
                $Suffix = $File.FullName.Substring($Source.Length).Replace('\', '/')
                $RemotePath = $Destination.TrimEnd('/') + '/' + (Split-Path $Source -Leaf) + $Suffix
                $State.Files[$RemotePath] = [System.IO.File]::ReadAllBytes($File.FullName)
                $CopiedCount++
                if ($State.Scenario -eq 'asset-failure' -and $CopiedCount -eq 1) {
                    $global:LASTEXITCODE = 1
                    return
                }
            }
        } else {
            $Bytes = [System.IO.File]::ReadAllBytes($Source)
            if ($State.Scenario -eq 'homepage-failure') {
                $State.Files[$Destination] = [byte[]]$Bytes[0..([int]($Bytes.Length / 2))]
                $global:LASTEXITCODE = 1
                return
            }
            $State.Files[$Destination] = $Bytes
        }
    }
}

function Invoke-WebRequest {
    param([uri]$Uri, [switch]$UseBasicParsing, [int]$TimeoutSec)
    $State = $global:PortfolioDeployTestState
    $State.Calls.Add([pscustomobject]@{ Command = 'http'; Arguments = @($Uri) })
    $RelativePath = $Uri.AbsolutePath.Substring($State.PublicPath.Length)
    $RemotePath = $State.Root + '/' + $RelativePath
    Assert-True ($State.Files.ContainsKey($RemotePath)) "HTTP requested an absent remote file: $RemotePath"
    if (($State.Scenario -eq 'http-forbidden' -and $RelativePath.StartsWith('assets/')) -or
        ($State.Scenario -eq 'pending-http-failure' -and $RelativePath.EndsWith('.pending.html')) -or
        ($State.Scenario -eq 'final-http-failure' -and $RelativePath -eq 'index.html')) { throw '403 Forbidden' }

    $Bytes = [byte[]]$State.Files[$RemotePath].Clone()
    $Mime = switch ([System.IO.Path]::GetExtension($RemotePath)) {
        '.html' { 'text/html' }
        '.css' { 'text/css' }
        '.js' { 'text/javascript' }
        default { 'application/octet-stream' }
    }
    if ($RelativePath.EndsWith('.css')) {
        if ($State.Scenario -eq 'html-instead-of-css') { $Mime = 'text/html' }
        if ($State.Scenario -eq 'truncated-asset') { $Bytes = [byte[]]$Bytes[0..($Bytes.Length - 2)] }
        if ($State.Scenario -eq 'same-size-corruption') { $Bytes[0] = $Bytes[0] -bxor 1 }
    }
    if ($State.Scenario -eq 'pending-corruption' -and $RelativePath.EndsWith('.pending.html')) { $Bytes[0] = $Bytes[0] -bxor 1 }
    [pscustomobject]@{
        StatusCode = 200
        Headers = @{ 'Content-Type' = $Mime }
        RawContentLength = $Bytes.Length
        RawContentStream = [System.IO.MemoryStream]::new($Bytes, $false)
    }
}

function Assert-CurrentReleaseUsable {
    $State = $global:PortfolioDeployTestState
    $Html = [System.Text.Encoding]::UTF8.GetString($State.Files[$State.Root + '/index.html'])
    foreach ($Match in [regex]::Matches($Html, '(?:src|href)="((?:assets/|css/|src/|img/|fonts/)[^"]+)"')) {
        $RelativePath = $Match.Groups[1].Value.Split('?')[0]
        Assert-True ($State.Files.ContainsKey($State.Root + '/' + $RelativePath)) "Current homepage references missing asset: $RelativePath"
        if ($RelativePath.EndsWith('.css')) {
            $Css = [System.Text.Encoding]::UTF8.GetString($State.Files[$State.Root + '/' + $RelativePath])
            foreach ($Font in [regex]::Matches($Css, "url\('([^']+)'\)")) {
                $FontUri = [uri]::new([uri]("https://example.test/$RelativePath"), $Font.Groups[1].Value)
                Assert-True ($State.Files.ContainsKey($State.Root + $FontUri.AbsolutePath)) 'A CSS-relative font path is broken.'
            }
        }
    }
}

try {
    $global:PortfolioDeployTestState = New-TestState 'success'
    & $DeployScript -WhatIf
    Assert-True ($global:PortfolioDeployTestState.Calls.Count -eq 0) 'WhatIf performed an external action.'
    Write-Host 'PASS: WhatIf has no external side effects' -ForegroundColor Green

    $Scenarios = @('success', 'ssh-failure', 'asset-failure', 'permissions-failure', 'http-forbidden', 'html-instead-of-css', 'truncated-asset', 'same-size-corruption', 'homepage-failure', 'pending-permissions-failure', 'pending-http-failure', 'pending-corruption', 'activation-failure', 'activation-unknown', 'final-http-failure')
    foreach ($Baseline in @('legacy', 'versioned')) {
        foreach ($Scenario in $Scenarios) {
            $global:PortfolioDeployTestState = New-TestState $Scenario $Baseline
            $State = $global:PortfolioDeployTestState
            $Before = @{}
            foreach ($Key in $State.Files.Keys) { $Before[$Key] = [Convert]::ToBase64String($State.Files[$Key]) }
            $Failure = $null
            try { & $DeployScript *> $null } catch { $Failure = $_ }
            if ($Scenario -eq 'success') { if ($Failure) { throw $Failure } }
            else { Assert-True ($null -ne $Failure) "$Scenario incorrectly reported success." }

            # Check the resulting remote bytes, not just the sequence of commands.
            foreach ($Key in $Before.Keys) {
                if ($Key.EndsWith('/index.html') -and $Scenario -in @('success', 'activation-unknown', 'final-http-failure')) { continue }
                Assert-True ($State.Files.ContainsKey($Key) -and [Convert]::ToBase64String($State.Files[$Key]) -eq $Before[$Key]) "$Scenario modified the previous release at $Key"
            }
            Assert-CurrentReleaseUsable
            foreach ($Stage in $State.Stages) { Assert-True (-not (Test-Path -LiteralPath $Stage)) 'Local staging was not cleaned up.' }

            $AssetUpload = @($State.Calls | Where-Object { $_.Command -eq 'scp' -and $_.Arguments[0] -eq '-r' })
            if ($AssetUpload.Count) {
                Assert-True (@($AssetUpload[0].Arguments -match 'index\.html').Count -eq 0) 'Homepage was included in the asset upload.'
                Assert-True ($AssetUpload[0].Arguments[-1] -match '/assets/[a-f0-9]{32}/$') 'Assets were uploaded to mutable paths.'
                $Folders = @($AssetUpload[0].Arguments | Where-Object { $_ -like '*portfolio-deploy-*' } | ForEach-Object { Split-Path $_ -Leaf } | Sort-Object)
                Assert-True (($Folders -join ',') -eq 'css,fonts,img,src') 'Non-public paths entered the upload list.'
            }
            if ($Scenario -eq 'success') {
                $Activation = @($State.Calls | Where-Object { $_.Command -eq 'ssh' -and $_.Arguments[-1] -like 'mv *' })
                Assert-True ($Activation.Count -eq 1) 'Expected one atomic homepage activation.'
                $ChecksBeforeActivation = @($State.Calls | Select-Object -First $State.Calls.IndexOf($Activation[0]) | Where-Object Command -eq 'http')
                $ExpectedAssetCount = @(@('css', 'src', 'img', 'fonts') | ForEach-Object { Get-ChildItem -LiteralPath (Join-Path $Repository $_) -File -Recurse }).Count
                Assert-True ($ChecksBeforeActivation.Count -eq ($ExpectedAssetCount + 1)) 'Assets and pending HTML were not all verified before activation.'
                $NewHtml = [System.Text.Encoding]::UTF8.GetString($State.Files[$State.Root + '/index.html'])
                Assert-True ($NewHtml -match '<meta property="og:image" content="https://jeremyrobertanderson.com/assets/[a-f0-9]{32}/img/') 'Social preview image was not versioned.'
            }
            Write-Host "PASS: $Baseline / $Scenario preserves a complete current release" -ForegroundColor Green
        }
    }

    foreach ($BadPath in @('/', '//', '/.', '/./', '///./', '/home/../site')) {
        $global:PortfolioDeployTestState = New-TestState 'success'
        $Rejected = $false
        try { & $DeployScript -RemoteDirectory $BadPath *> $null } catch { $Rejected = $true }
        Assert-True $Rejected "Unsafe destination accepted: $BadPath"
        Assert-True ($global:PortfolioDeployTestState.Calls.Count -eq 0) 'Unsafe destination reached the host.'
    }
    Write-Host 'PASS: root aliases and parent traversal rejected before any external action' -ForegroundColor Green
}
finally {
    Remove-Variable -Scope Global -Name PortfolioDeployTestState -ErrorAction SilentlyContinue
}

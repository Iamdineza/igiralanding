param([Parameter(Mandatory=$true)][string]$HostAddress)
$ErrorActionPreference = 'Stop'
$principal = [Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run this script from PowerShell opened as Administrator. No firewall changes made.'
}
$address = @(Get-NetIPAddress -InterfaceAlias 'Wi-Fi' -AddressFamily IPv4 | Where-Object IPAddress -eq $HostAddress)
if ($address.Count -ne 1 -or $address[0].PrefixLength -ne 24 -or $HostAddress -notmatch '^192\.168\.\d{1,3}\.\d{1,3}$') {
    throw 'Expected this computer''s Wi-Fi IPv4 address on a private 192.168.x.0/24 subnet. Stopped without changes.'
}
$ruleName = 'IgiraLandingPreview3015'
if (Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue) {
    throw 'A preview rule already exists. Review it rather than overwriting it.'
}
$octets = $HostAddress.Split('.')
$remoteSubnet = ($octets[0..2] -join '.') + '.0/24'
$nodePath = (Get-Command node -CommandType Application).Source
New-NetFirewallRule -Name $ruleName -DisplayName 'Igira landing preview (local Wi-Fi only)' `
    -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3015 `
    -LocalAddress $HostAddress -RemoteAddress $remoteSubnet -InterfaceAlias 'Wi-Fi' `
    -Program $nodePath -Profile Any | Out-Null
Write-Output "Allowed only $remoteSubnet on Wi-Fi to $HostAddress port 3015. No network profile changed."
Write-Output 'After testing, remove this specific rule: Remove-NetFirewallRule -Name IgiraLandingPreview3015'

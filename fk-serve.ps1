Write-Host "Setting up Development Environment"
if (-not ((docker network ls) | Where { $_.Contains("fk-default") } )) {
    Write-Host "Setting up network"
    $networkId = docker network create fk-default
}

Write-Host "Starting Containers"
$jekyll_serveInfo = (docker container ls -a) | Where { $_.EndsWith("jekyll_serve") }
if ($jekyll_serveInfo)
{
    $jekyll_serveInfo = $jekyll_serveInfo.split(" ")[0]
    Write-Host " Stopping Container jekyll_serve ID=$jekyll_serveInfo" -ForeGroundColor Red
    $rm = docker container stop $jekyll_serveInfo
}

Write-Host " Starting Container jekyll_serve" -ForeGroundColor Magenta
$jekyll_serveId = docker run --rm -itd --name jekyll_serve --volume=${PWD}:/srv/jekyll -p 4000:4000 jekyll/jekyll:builder jekyll serve --force_polling

Write-Host " Connecting network fk-default to jekyll_serve" -ForeGroundColor Magenta
$nw = docker network connect fk-default jekyll_serve

Write-Host " Donating ports to jekyll_serve"
$ip = docker port jekyll_serve 4000

$ngrokInfo = (docker container ls -a) | Where { $_.EndsWith("www_ngrok") }
if ($ngrokInfo)
{
    $ngrokInfo = $ngrokInfo.split(" ")[0]
    Write-Host " Stopping Container ngrok ID=$ngrokInfo" -ForeGroundColor Red
    $rm = docker container stop $ngrokInfo
}

Write-Host " Starting container www_ngrok, linking to jekyll_serve" -ForeGroundColor Magenta 
$ngrokId = docker run --rm -d --name www_ngrok -p 4040:4040 -it --net fk-default wernight/ngrok ngrok http jekyll_serve:4000
$ip = docker port www_ngrok 4040

Write-Host ""
Write-Host "Inspect your application"
Write-Host " http://localhost:4040/inspect/http"
Write-Host "Invoking public urls" -ForeGroundColor Cyan -NoNewLine
$content = Invoke-RestMethod http://localhost:4040/api/tunnels
while ((-not $content.tunnels) -or $content.tunnels.Count -lt 2) { 
    Write-Host "." -ForeGroundColor Cyan -NoNewLine
    Start-Sleep -Milliseconds 250
    $content = Invoke-RestMethod http://localhost:4040/api/tunnels
}
Write-Host "." -ForeGroundColor Cyan

foreach ($tunnel in $content.tunnels) {
    Write-Host " Checkout" $tunnel.public_url -ForeGroundColor Cyan
}

# USE-SPWEB
# Finally use SharePoint Powershell like C-Sharp
#
# Example 1: Get Some Values
# $return = Use-SPWeb "https://my.sharepoint.com" {
#     param($myWeb)
#     $myWeb.Title = "I love"
#     return $myWeb.Title
# }
# Write-Host "$return clouds"
# 
# Example 2: Do Something with your web
# Use-SPWeb "https://my.sharepoint.com" {
#     param($myWeb)
#     $myWeb.Title = "Felix Krause!"
#     Write-Host "This is" $myWeb.Title
# }

function Use-SPWeb {
    param(
        [String] $Url, 
        $func
    )
    $retval = $null
    $web = Get-SPWeb $web.Url
    try {
        $retval = $func.Invoke($web, $args)
    } catch {
        Write-Error "An error occurred while invoking anonymous function."
        Write-Host $_
    } finally {
        $web.Dispose()
    }
    return $retval
}
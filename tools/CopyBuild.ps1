Set-Location .\taa-pwa\
Get-Item * -Exclude .git | Remove-Item -Recurse
Copy-Item -Recurse ..\dist\* . 
Copy-Item -Recurse ..\dist\.nojekyll . 

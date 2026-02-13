try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    Write-Host "Word is available."
    $word.Quit()
} catch {
    Write-Host "Word is NOT available."
    exit 1
}

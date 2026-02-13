
# Script to convert Markdown to DOCX using Word COM
# Pure relative paths

$SourceDir = ".\MENSAGENS ACAMP 2026\ARQUIVOS .MD"
$DestDir = ".\MENSAGENS ACAMP 2026\WORD"

# We check existence
if (-not (Test-Path $SourceDir)) { Write-Error "Source missing"; exit 1 }

# For Word, we need absolute paths.
# But Resolve-Path returns an object with 'Path' property that might be formatted with "Microsoft.PowerShell.Core\FileSystem::..."
# Which Word hates. We convert it to a System.IO string.

$SourceDirAbs = [System.IO.Path]::GetFullPath($SourceDir)
$DestDirAbs = [System.IO.Path]::GetFullPath($DestDir)

Write-Host "Source: $SourceDirAbs"
Write-Host "Dest: $DestDirAbs"

function Convert-MarkdownToHtml {
    param ([string]$Markdown)
    $html = "<html><body style='font-family:Calibri;font-size:11pt'>"
    $lines = $Markdown -split "`r`n"
    foreach ($line in $lines) {
        if ($line -match "^#\s+(.+)") { $html += "<h1>$($matches[1])</h1>" }
        elseif ($line -match "^##\s+(.+)") { $html += "<h2>$($matches[1])</h2>" }
        elseif ($line -match "^###\s+(.+)") { $html += "<h3>$($matches[1])</h3>" }
        elseif ($line -match "^---") { $html += "<hr>" }
        elseif ($line -match "^-\s+\[ \]\s+(.+)") { $html += "☐ $($matches[1])<br>" } 
        elseif ($line -match "^-\s+(.+)") { $html += "• $($matches[1])<br>" } 
        elseif ($line -match "^>\s+(.+)") { $html += "<div style='border-left:4px solid gray;padding-left:10px;color:gray'><i>$($matches[1])</i></div><br>" }
        else {
            if ($line -eq "") { $html += "<p></p>" }
            else {
                $line = $line -replace "\*\*(.+?)\*\*", "<b>`$1</b>"
                $line = $line -replace "\*(.+?)\*", "<i>`$1</i>"
                $html += "$line<br>"
            }
        }
    }
    $html += "</body></html>"
    return $html
}

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
} catch {
    Write-Error "Could not create Word.Application object."
    exit 1
}

$files = @(
    "Treinamento-02-Metanoia",
    "Treinamento-03-Identidade-e-Paternidade",
    "Treinamento-04-O-Poder-da-Associacao",
    "Treinamento-05-Cultura-de-Honra",
    "Treinamento-06-Maos-a-Obra",
    "Treinamento-07-A-Grande-Comissao"
)

foreach ($name in $files) {
    $mdPath = Join-Path $SourceDirAbs "$name.md"
    $docPath = Join-Path $DestDirAbs "$name.docx"
    
    if (Test-Path $mdPath) {
        Write-Host "Converting $name..."
        try {
            $content = Get-Content $mdPath -Raw -Encoding UTF8
            $html = Convert-MarkdownToHtml $content
            
            $tempHtmlPath = Join-Path $SourceDirAbs "temp_$name.html"
            $html | Out-File $tempHtmlPath -Encoding UTF8
            
            $doc = $word.Documents.Open($tempHtmlPath)
            $doc.SaveAs($docPath, 16)
            $doc.Close()
            
            Remove-Item $tempHtmlPath
            Write-Host "Saved to $docPath"
        } catch {
            Write-Error "Failed to process $name: $_"
        }
    } else {
        Write-Warning "File not found: $mdPath"
    }
}

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null

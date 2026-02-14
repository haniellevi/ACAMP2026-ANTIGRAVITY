
Option Explicit

Dim fso, wordApp, doc
Dim folderPath, sourceDir, destDir
Dim fileList, fileName, mdPath, docxPath
Dim streamIn, streamOut, content, htmlContent
Dim i

' Hardcoded paths to match usage
folderPath = "c:\Users\hanie\Searches\OneDrive\Documentos\ANTIGRAVITY\ACAMP2026-ANTIGRAVITY"
sourceDir = folderPath & "\MENSAGENS ACAMP 2026\ARQUIVOS .MD"
destDir = folderPath & "\MENSAGENS ACAMP 2026\WORD"

fileList = Array("Treinamento-02-Metanoia", "Treinamento-03-Identidade-e-Paternidade", "Treinamento-04-O-Poder-da-Associacao", "Treinamento-05-Cultura-de-Honra", "Treinamento-06-Maos-a-Obra", "Treinamento-07-A-Grande-Comissao")

Set fso = CreateObject("Scripting.FileSystemObject")

' Check directories
If Not fso.FolderExists(sourceDir) Then
    WScript.Echo "Source not found: " & sourceDir
    WScript.Quit
End If

TryWord
Sub TryWord
    On Error Resume Next
    Set wordApp = CreateObject("Word.Application")
    If Err.Number <> 0 Then
        WScript.Echo "Word not found."
        WScript.Quit
    End If
    On Error GoTo 0
    wordApp.Visible = False
End Sub

Function ConvertMdToHtml(mdText)
    Dim re, s
    Set re = New RegExp
    re.Global = True
    re.IgnoreCase = True
    re.MultiLine = True
    s = mdText
    
    ' Headers
    re.Pattern = "^#\s+(.+)$"
    s = re.Replace(s, "<h1>$1</h1>")
    re.Pattern = "^##\s+(.+)$"
    s = re.Replace(s, "<h2>$1</h2>")
    re.Pattern = "^###\s+(.+)$"
    s = re.Replace(s, "<h3>$1</h3>")
    
    ' HR
    re.Pattern = "^---$"
    s = re.Replace(s, "<hr>")
    
    ' Bold
    re.Pattern = "\*\*(.+?)\*\*"
    s = re.Replace(s, "<b>$1</b>")
    
    ' Italic
    re.Pattern = "\*(.+?)\*"
    s = re.Replace(s, "<i>$1</i>")
    
    ' Lists
    re.Pattern = "^-\s+\[ \]\s+(.+)$"
    s = re.Replace(s, "☐ $1<br>")
    re.Pattern = "^-\s+(.+)$"
    s = re.Replace(s, "• $1<br>")
    
    ' Line breaks
    s = Replace(s, vbCr, "")
    s = Replace(s, vbLf, "<br>")
    
    ConvertMdToHtml = "<html><body style='font-family:Calibri;font-size:11pt'>" & s & "</body></html>"
End Function

For i = 0 To UBound(fileList)
    fileName = fileList(i)
    mdPath = sourceDir & "\" & fileName & ".md"
    docxPath = destDir & "\" & fileName & ".docx"
    
    If fso.FileExists(mdPath) Then
        WScript.Echo "Converting " & fileName
        
        ' Read MD (UTF-8)
        Set streamIn = CreateObject("ADODB.Stream")
        streamIn.Open
        streamIn.Type = 2 ' Text
        streamIn.Charset = "utf-8"
        streamIn.LoadFromFile mdPath
        content = streamIn.ReadText
        streamIn.Close
        
        htmlContent = ConvertMdToHtml(content)
        
        ' Write Temp HTML
        Dim tempHtmlPath
        tempHtmlPath = sourceDir & "\temp_" & fileName & ".html"
        Set streamOut = CreateObject("ADODB.Stream")
        streamOut.Open
        streamOut.Type = 2 ' Text
        streamOut.Charset = "utf-8"
        streamOut.WriteText htmlContent
        streamOut.SaveToFile tempHtmlPath, 2 ' Overwrite
        streamOut.Close
        
        ' Open in Word
        On Error Resume Next
        Set doc = wordApp.Documents.Open(tempHtmlPath)
        If Err.Number = 0 Then
            ' Save as DOCX (Format 16)
            doc.SaveAs2 docxPath, 16
            doc.Close
            WScript.Echo "Saved to " & docxPath
        Else
            WScript.Echo "Error opening " & tempHtmlPath & ": " & Err.Description
        End If
        On Error GoTo 0
        
        If fso.FileExists(tempHtmlPath) Then fso.DeleteFile tempHtmlPath
    Else
        WScript.Echo "Missing: " & mdPath
    End If
Next

wordApp.Quit
Set wordApp = Nothing

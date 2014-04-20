@echo off
if exist .\bin\ (rd /s /q .\bin)
mkdir .\bin
.\7zip\7za.exe a -tzip .\bin\app.pak .\package.json .\www
robocopy .\nw\win\ .\bin\ *.dll nw.pak
copy /b .\nw\win\nw_custom.exe + .\bin\app.pak .\bin\inspectionManager.exe
del .\bin\app.pak /f /q
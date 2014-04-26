@echo off
if exist .\bin\ (rd /s /q .\bin)
mkdir .\bin
mkdir .\bin\win
mkdir .\bin\linux_ia32
mkdir .\bin\linux_x64
.\7zip\7za.exe a -tzip .\bin\app.pak .\package.json .\www
robocopy .\nw\win\ .\bin\win\ *.dll nw.pak
robocopy .\nw\linux_ia32\ .\bin\linux_ia32\ * /XF credits.html nw
robocopy .\nw\linux_x64\ .\bin\linux_x64\ * /XF credits.html nw
copy /b .\nw\win\nw_custom.exe + .\bin\app.pak .\bin\win\inspectionManager.exe
copy /b .\nw\linux_ia32\nw + .\bin\app.pak .\bin\linux_ia32\inspectionManager
copy /b .\nw\linux_x64\nw + .\bin\app.pak .\bin\linux_x64\inspectionManager
del .\bin\app.pak /f /q
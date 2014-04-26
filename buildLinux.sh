#!/bin/bash


if [ -d ./tmp ]; then
  rm -rf ./tmp
fi

if [ -d ./bin ]; then
  rm -rf ./bin
fi

mkdir ./tmp
mkdir ./bin
mkdir ./bin/win
mkdir ./bin/linux_ia32
mkdir ./bin/linux_x64

cp -r ./www ./tmp/
cp ./package.json ./tmp/
cd tmp
zip -r ../bin/app.pak *
cd ..

cp ./nw/win/*.dll ./bin/win/
cp ./nw/win/nw.pak ./bin/win/
cp ./nw/linux_ia32/* ./bin/linux_ia32/
cp ./nw/linux_x64/* ./bin/linux_x64/

cat ./nw/win/nw_custom.exe ./bin/app.pak > ./bin/win/inspectionManager.exe
cat ./nw/linux_ia32/nw ./bin/app.pak > ./bin/linux_ia32/inspectionManager && chmod +x ./bin/linux_ia32/inspectionManager
cat ./nw/linux_x64/nw ./bin/app.pak > ./bin/linux_x64/inspectionManager && chmod +x ./bin/linux_x64/inspectionManager

rm -rf ./tmp
rm ./bin/app.pak



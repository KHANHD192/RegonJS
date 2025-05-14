#!/bin/bash

set -e  # Thoát nếu có lỗi

echo "[*] Cài đặt npm dependencies..."
npm install

if [ ! -d "LinkFinder" ]; then
    echo "[*] Cloning LinkFinder..."
    git clone https://github.com/GerbenJavado/LinkFinder.git 
else
    echo "[*] Bỏ qua: LinkFinder đã tồn tại."
fi

cd LinkFinder
echo "[*] Cài đặt LinkFinder..."
sudo python3 setup.py install
cd ..

if [ ! -d "trufflehog" ]; then
    echo "[*] Cloning TruffleHog..."
    git clone https://github.com/trufflesecurity/trufflehog.git
else
    echo "[*] Bỏ qua: trufflehog đã tồn tại."
fi

echo "[*] Cài đặt TruffleHog..."
cd trufflehog
go install
cd ..

echo "[*] Cài đặt Semgrep..."
python3 -m pip install semgrep --break-system-packages

echo "[+] Hoàn tất cài đặt!"

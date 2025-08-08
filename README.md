# WISH Kiosk Server

> Server for **[WI:SH Kiosk](https://github.com/Team-ToyoTech/WISH-Kiosk)**
> 
> 토스페이먼츠 결제 연동 + 주문 큐 관리(API)

- Using [Toss Payments (Express 예제 기반)](https://github.com/tosspayments/tosspayments-sample/tree/main/express-javascript)
- `npm install express` 와 `npm install body-parser` 가 필요합니다.  

## Features
- 결제 세션 생성 및 승인 콜백 처리
- 주문 큐(대기) / 완료 큐 관리
- DID(Display)/수신(Receive) 앱에서 폴링하는 간단 REST API

## Requirements
- Node.js 18+

## Quick Start
```bash
git clone https://github.com/Team-ToyoTech/WISH-Server.git
cd WISH-Server
npm install
node Server.js

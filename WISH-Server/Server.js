const express = require("express");
//const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

app.use(express.static("public"));
app.use(express.json());

// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
// @docs https://docs.tosspayments.com/reference/using-api/api-keys
const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedWidgetSecretKey =
    "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");
const encryptedApiSecretKey =
    "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");

// 결제위젯 승인
app.post("/confirm/widget", function (req, res) {
    const { paymentKey, orderId, amount } = req.body;

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
            Authorization: encryptedWidgetSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            amount: amount,
            paymentKey: paymentKey,
        }),
    }).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 결제 완료 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

// 결제창 승인
app.post("/confirm/payment", function (req, res) {
    const { paymentKey, orderId, amount } = req.body;

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
            Authorization: encryptedApiSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            amount: amount,
            paymentKey: paymentKey,
        }),
    }).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 결제 완료 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

// 브랜드페이 승인
app.post("/confirm/brandpay", function (req, res) {
    const { paymentKey, orderId, amount, customerKey } = req.body;

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    fetch("https://api.tosspayments.com/v1/brandpay/payments/confirm", {
        method: "POST",
        headers: {
            Authorization: encryptedApiSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            amount: amount,
            paymentKey: paymentKey,
            customerKey: customerKey,
        }),
    }).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 결제 완료 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

// 브랜드페이 Access Token 발급
app.get("/callback-auth", function (req, res) {
    const { customerKey, code } = req.query;

    // 요청으로 받은 customerKey 와 요청한 주체가 동일인인지 검증 후 Access Token 발급 API 를 호출하세요.
    // @docs https://docs.tosspayments.com/reference/brandpay#access-token-발급
    fetch(
        "https://api.tosspayments.com/v1/brandpay/authorizations/access-token",
        {
            method: "POST",
            headers: {
                Authorization: encryptedApiSecretKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grantType: "AuthorizationCode",
                customerKey,
                code,
            }),
        }
    ).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 발급 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 발급 성공 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

const billingKeyMap = new Map();

// 빌링키 발급
app.post("/issue-billing-key", function (req, res) {
    const { customerKey, authKey } = req.body;

    // AuthKey 로 카드 빌링키 발급 API 를 호출하세요
    // @docs https://docs.tosspayments.com/reference#authkey로-카드-빌링키-발급
    fetch(`https://api.tosspayments.com/v1/billing/authorizations/issue`, {
        method: "POST",
        headers: {
            Authorization: encryptedApiSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            customerKey,
            authKey,
        }),
    }).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 빌링키 발급 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 빌링키 발급 성공 비즈니스 로직을 구현하세요.
        // TODO: 발급된 빌링키를 구매자 정보로 찾을 수 있도록 저장해두고, 결제가 필요한 시점에 조회하여 카드 자동결제 승인 API 를 호출합니다.
        billingKeyMap.set(customerKey, result.billingKey);
        res.status(response.status).json(result);
    });
});

// 카드 자동결제 승인
app.post("/confirm-billing", function (req, res) {
    const {
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail,
        customerName,
    } = req.body;

    // 저장해두었던 빌링키로 카드 자동결제 승인 API 를 호출하세요.
    fetch(
        `https://api.tosspayments.com/v1/billing/${billingKeyMap.get(
            customerKey
        )}`,
        {
            method: "POST",
            headers: {
                Authorization: encryptedApiSecretKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerKey,
                amount,
                orderId,
                orderName,
                customerEmail,
                customerName,
            }),
        }
    ).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 자동결제 승인 실패 비즈니스 로직을 구현하세요.
            res.status(response.status).json(result);

            return;
        }

        // TODO: 자동결제 승인 성공 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

function generateRandomString() {
    return Buffer.from(Math.random().toString())
        .toString("base64")
        .slice(0, 20);
}

// 결제 정보 저장소 (테스트용 메모리 저장)
const payments = {};

// 1. 결제 요청 처리
app.post("/pay", (req, res) => {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
        return res
            .status(400)
            .json({ error: "결제 금액이 올바르지 않습니다." });
    }

    const paymentId = generateRandomString(); // 고유 ID 생성
    payments[paymentId] = { amount, status: "pending" };

    // 결제창 페이지로 리다이렉트 URL 반환
    res.json({ redirectId: `${paymentId}` });
});

// 2. 결제창 페이지 제공
app.get("/checkout/:id", (req, res) => {
    const paymentId = req.params.id;
    const payment = payments[paymentId];

    if (!payment) {
        return res.status(404).send("결제 정보가 없습니다.");
    }

    // 결제 페이지 HTML로 전달
    res.send(`
        <html>
        <head onload="requestPayment()">
            <title>결제</title>
        <script src="https://js.tosspayments.com/v2/standard"></script>
        <script>
        const amount = {
            currency: "KRW",
            value: ${payment.amount},
          };

          let selectedPaymentMethod = null;

          function selectPaymentMethod(method) {
            if (selectedPaymentMethod != null) {
              document.getElementById(selectedPaymentMethod).style.backgroundColor = "#ffffff";
            }

            selectedPaymentMethod = method;

            document.getElementById(selectedPaymentMethod).style.backgroundColor = "rgb(229 239 255)";
          }
          function generateRandomString() {
            return window.btoa(Math.random()).slice(0, 20);
          }

          // ------  SDK 초기화 ------
          // TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
          // TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
          // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
          // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
          const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
          const customerKey = generateRandomString();
          const tossPayments = TossPayments(clientKey);
          // 회원 결제
          // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
          const payment = tossPayments.payment({
            customerKey,
          });
          // 비회원 결제
          // const payment = tossPayments.payment({customerKey: TossPayments.ANONYMOUS});

          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
          window.onload = async function requestPayment() {
            // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
            // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                await payment.requestPayment({
                  method: "CARD", // 카드 및 간편결제
                  amount,
                  orderId: "${paymentId}",
                  orderName: "WISH Kiosk 결제",
                  successUrl: window.location.origin + "/success",
                  failUrl: window.location.origin + "/fail",
                  customerEmail: "customer123@gmail.com",
                  customerName: "ToyoTech",
                  // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
                  // customerMobilePhone: "01012341234",
                  card: {
                    useEscrow: false,
                    flowMode: "DEFAULT",
                    useCardPoint: false,
                    useAppCardOnly: false,
                  },
                });
            }
          </script>
          </head>
        </html>
    `);
});

app.get("/ispaying/:id", (req, res) => {
    const ID = req.params.id;
    res.send({ status: payments[ID].status });
});

// 3. 결제 성공/실패 처리
// 3. 결제 성공 처리 → status 변경
app.get("/success", async (req, res) => {
    const { paymentKey, orderId, amount } = req.query; //req.query

    if (!orderId || !paymentKey || !amount) {
        return res.status(400).send("필요한 결제 정보가 없습니다.");
    }

    const payment = payments[orderId];
    if (!payment) {
        return res.status(404).send("결제 정보가 없습니다.");
    }

    // 결제 승인 API를 호출하세요.
    // 결제를 승인하면 결제수단에서 금액이 차감돼요.
    // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
    fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
            Authorization: encryptedApiSecretKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            orderId: orderId,
            amount: amount,
            paymentKey: paymentKey,
        }),
    }).then(async function (response) {
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
            payment.status = "failed";
            res.send("결제가 실패했습니다.");
            return;
        }
        //TODO: 결제 완료시 뜨는 화면 구축하기
        //res.send("결제가 성공했습니다.");
        payment.status = "paid";
        // TODO: 결제 완료 비즈니스 로직을 구현하세요.
        res.status(response.status).json(result);
    });
});

// 4. 결제 실패 처리
app.get("/fail", (req, res) => {
    const { paymentKey, orderId, amount } = req.query; //req.query
    payment[orderId].status = "failed";
    res.send("결제가 실패했습니다.");
});
const orders = {};
var orderNumber = 101;
var nowquary = [];
var completequary = [];
const NumtoId = {};
const ordersamount = {};

function normalizeKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(normalizeKeys);
    } else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, key) => {
            let newKey = key;
            if (key === "name") newKey = "Name";
            if (key === "count") newKey = "Count";
            acc[newKey] = normalizeKeys(obj[key]);
            return acc;
        }, {});
    }
    return obj;
}

function removeAmountKey(data) {
  if (Array.isArray(data)) {
    // 배열일 경우 각 요소를 재귀적으로 처리
    return data.map(removeAmountKey);
  } else if (data !== null && typeof data === 'object') {
    // 객체일 경우 amount 키를 제외한 나머지 복사
    return Object.keys(data).reduce((acc, key) => {
      if (key !== 'amount') {
        acc[key] = removeAmountKey(data[key]);
      }
      return acc;
    }, {});
  }
  // 기본형(숫자, 문자열 등)은 그대로 반환
  return data;
}


app.post("/pay/counter", (req, res) => {
    const orderId = generateRandomString();
    const order = normalizeKeys(req.body);
    orders[orderId] = { order: removeAmountKey(order), orderNumber: orderNumber, paid: "NO" };
    nowquary.push(orderNumber);
    NumtoId[orderNumber] = orderId;
    ordersamount[orderId] = { amount: Number(order.amount) };
    res.json({ orderNumber: orderNumber });
    orderNumber++;
});

app.get("/pay/complete/:id", (req, res) => {
    const orderId = req.params.id;
    orders[orderId].paid = "OK";
    res.json({ status: "success" });
});

app.post("/order/add/:id", (req, res) => {
    const orderId = req.params.id;
    const order = normalizeKeys(req.body);
    orders[orderId] = { order: order, orderNumber: orderNumber, paid: "OK" };
    nowquary.push(orderNumber);
    NumtoId[orderNumber] = orderId;
    res.json({ orderNumber: orderNumber });
    orderNumber++;
});

app.get("/order/get", (req, res) => {
    let ordering = [];
    nowquary.forEach((x) => {
        ordering.push(orders[NumtoId[x]]);
    });

    res.json(ordering);
});

app.get("/order/get/:id", (req, res) => {
    const now = req.params.id;
    res.json(orders[now]);
});
/*
[
  { "Name": "김치찌개", "Count": 2 },
  { "Name": "된장찌개", "Count": 3 }
]
*/

app.get("/order/complete/set/:orderN", (req, res) => {
    let num = Number(req.params.orderN);
    if (nowquary.includes(num)) {
        completequary.push(num);
        nowquary = nowquary.filter((x) => x !== num);
        res.json({ status: "success" });
    } else {
        res.json({ status: "fail" });
    }
});

app.get("/order/complete/get", (req, res) => {
    let ordering = [];
    completequary.forEach((x) => {
        ordering.push(orders[NumtoId[x]]);
    });

    res.json(ordering);
});

app.get("/order/complete/getid", (req, res) => {
    res.json(completequary);
});

app.get("/order/getid", (req, res) => {
    res.json(nowquary);
});

app.get("/order/complete/cancel/:orderN", (req, res) => {
    let num = req.params.orderN;
    if (completequary.includes(num)) {
        nowquary.push(num);
        completequary.delete(num);
        res.json({ status: "success" });
    } else {
        res.json({ status: "fail" });
    }
});

app.delete("/order/del/:orderN", (req, res) => {
    let num = req.params.orderN;
    if (completequary.includes(num)) {
        completequary.delete(num);
        res.json({ status: "success" });
    } else {
        res.json({ status: "fail" });
    }
});

app.listen(port, () =>
    console.log(`http://localhost:${port} 으로 서버가 실행되었습니다.`)
);

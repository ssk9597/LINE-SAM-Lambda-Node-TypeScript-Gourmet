## LINE-SAM-Lambda-Node-TypeScript-Gourmet

### Frontend

・LINE

### Backend

・LINE(LINE Messaging API)

・Node.js

・TypeScript

### Infra

・AWS(Lambda, API Gateway, DynamoDB, S3)

・Serverless Framework

## アプリ概要

### お店探し

| クライアント            | LINE Messaging API（バックエンド）                                              |
| ----------------------- | ------------------------------------------------------------------------------- |
| ①「お店を探す」をタップ |                                                                                 |
|                         | ②「現在地を送る」ためのボタンメッセージを送信、例外時にはエラーメッセージを送信 |
| ③ 現在地を送る          |                                                                                 |
|                         | ④「車か徒歩どちらですか？」というメッセージを送る                               |
| ⑤ 車か徒歩を選択        |                                                                                 |
|                         | ⑥ お店の配列を作成する（車の場合現在地から 14km 以内、徒歩の場合 0.8km 以内）   |
|                         | ⑦ 必要なデータのみにする                                                        |
|                         | ⑧ 評価順に並び替えて上位 10 店舗にする                                          |
|                         | ⑨ Flex Message を作成する                                                       |
|                         | ⑩ お店の情報を Flex Message で送る                                              |

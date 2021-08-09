## LINE-SAM-Lambda-Node-TypeScript-Gourmet

### App

![image](https://user-images.githubusercontent.com/70458379/128669548-9c812dd0-bf7d-4484-a381-3352cc26d4ce.png)

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

#### DynamoDB

| PK          | K        | K         | K          |
| ----------- | -------- | --------- | ---------- |
| user_id     | latitude | longitude | is_car     |
| ユーザー ID | 緯度     | 経度      | 車か徒歩か |

### お気に入り登録

| クライアント          | LINE Messaging API（バックエンド）                 |
| --------------------- | -------------------------------------------------- |
| ①「行きつけ」をタップ |                                                    |
|                       | ② ポストバックのデータを元に DynamoDB に登録を行う |

#### DynamoDB

| PK          | SK             | K          | K          | K          | K                 | K                 |
| ----------- | -------------- | ---------- | ---------- | ---------- | ----------------- | ----------------- |
| user_id     | timestamp      | photo_url  | name       | rating     | store_details_url | store_routing_url |
| ユーザー ID | タイムスタンプ | 店舗の写真 | 店舗の名前 | 店舗の評価 | 店舗詳細          | 店舗案内          |

### お気に入り店を探す

| クライアント          | LINE Messaging API（バックエンド）       |
| --------------------- | ---------------------------------------- |
| ①「行きつけ」をタップ |                                          |
|                       | ② user_id を元に DynamoDB から検索を行う |
|                       | ③ Flex Message を作成する                |
|                       | ④ お店の情報を Flex Message で送る       |

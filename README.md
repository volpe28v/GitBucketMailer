GitBucket の push をメールで通知する

### Install

```
$ cd GitBucketMailer
$ npm install
```
* node のバージョンが 0.11.13 だと email-templates のインストールに失敗するので 0.10.28 で動作確認済み(Macの場合)

### Setting

* mail_setting.json.temp を mail_setting.json にリネーム
* mail_setting.json を埋める
* node app.js
* GitBucket の Hook に http://localhost:3000/gitbucket を設定(URLは任意)

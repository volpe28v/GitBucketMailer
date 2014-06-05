GitBucket の push をメールで通知する

### 設定方法

* mail_setting.json.temp を mail_setting.json にリネーム
* mail_setting.json を埋める
* node app.js
* GitBucket の Hook に http://localhost:3000/gitbucket を設定(URLは任意)

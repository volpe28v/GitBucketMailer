GitBucket の push をメールで通知する

## Installation
事前に必要なもの
* node.js環境
* mongodb

```
$ cd GitBucketMailer
$ npm install
```
* node のバージョンが 0.11.13 だと email-templates のインストールに失敗するので 0.10.28 で動作確認済み(Macの場合)

## Setting

* mail_setting.json.temp を mail_setting.json にリネーム
* mail_setting.json を埋める
* node app.js
* GitBucket の Hook に http://localhost:3000/gitbucket を設定(URLは任意)

```
$ node app.js
```

### ex: Gmail
mail_setting.json
```
{
  "service": "Gmail",
  "smpt_host": "",
  "user": "yyyy@gmail.com",
  "pass": "xxxx", 
  "port": 578, 
  "ssl" : false,
  "from": "yyyy@gmail.com", 
  "addr": "zzzz@gmail.com, yzyz@aaaa.com"
}
```

## License
(The MIT License)

Copyright (c) 2014 Naoki KODAMA <naoki.koda@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


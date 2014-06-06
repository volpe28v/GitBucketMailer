var express = require('express');
var http = require('http');
var path = require('path');
var moment = require('moment');
var mailer = require('nodemailer');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mail_setting = require("./mail_setting.json");

//SMTPの設定
var setting = {};
if (mail_setting.service != ""){
  //Webサービスを使う場合
  setting = {
    service: mail_setting.service, //'Gmail'、'Hotmail'、'Yahoo Mail'など
    auth: {
      user: mail_setting.user,
      pass: mail_setting.pass,
      port: mail_setting.port
    }
  }
}else{
  //SMTPサーバーを使う場合
  setting = {
    host: mail_setting.smpt_host,
    secureConnection: mail_setting.ssl,
    port: mail_setting.port,
    auth: {
      user: mail_setting.user,
      pass: mail_setting.pass
    }
  }
}

//SMTPの接続
var smtp = mailer.createTransport('SMTP', setting);

app.post('/gitbucket', function(req, res){
  var data = req.body;
  var payload = JSON.parse(data.payload);
  var pusher = payload["pusher"]["name"];
  var repo = payload["repository"]["name"];

  var html_msg = makeHtmlBody(payload);
  var text_msg = makeTextBody(payload);
  var subject = "[GitBucket] " + pusher + "さんが " + repo + " に push しました!";

  //メールの内容
  var mailOptions = {
    from: mail_setting.from,
    to: mail_setting.addr,
    subject: subject,
    html: html_msg,
    text: text_msg
  };

  //メールの送信
  smtp.sendMail(mailOptions, function(err, res){
    //送信に失敗したとき
    if(err){
      console.log(err);
      //送信に成功したとき
    }else{
      console.log('Message sent: ' + res.message);
    }
    //SMTPの切断
    smtp.close();
  });

  res.json({});
});

function makeHtmlBody(payload){
  var pusher = payload["pusher"]["name"];
  var commits = payload["commits"];
  var repo = payload["repository"]["name"];
  var url = payload["repository"]["url"];

  var commit_comments = [];
  commit_comments.push("お疲れ様です、GitBucketです！");
  commit_comments.push("<b>" + pusher + "</b> さんがPushしましたよ。");
  commit_comments.push("");
  commit_comments.push('<a href="' + url + '">' + repo + '</a>');
  commit_comments.push("");
  commits.forEach(function(value){
    var date_str = value["timestamp"].split(" ");
    commit_comments.push("[" + moment(date_str[5] + " " + date_str[1] + " " + date_str[2] + " " + date_str[3], "YYYY MMM DD HH:mm:ss").format("YYYY/MM/DD HH:mm") + "]");
    commit_comments.push("<blockquote>");
    value["message"].split("\n").forEach(function(msg){
      commit_comments.push(msg);
    });
    commit_comments.push('<a href="' + value["url"] + '">[差分]</a>');
    commit_comments.push("</blockquote>");
    commit_comments.push("");
  });

  return commit_comments.join("<br>\n");
}

function makeTextBody(payload){
  var pusher = payload["pusher"]["name"];
  var commits = payload["commits"];
  var repo = payload["repository"]["name"];
  var url = payload["repository"]["url"];

  var commit_comments = [];
  commit_comments.push(pusher + "さんが " + repo + " に push しました!");
  commit_comments.push("");
  commit_comments.push("リポジトリ: " + url);
  commit_comments.push("");
  commits.forEach(function(value){
    commit_comments.push(value["message"]);
    commit_comments.push(value["url"]);
    commit_comments.push("");
  });

  return commit_comments.join("\n");
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

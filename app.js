var express = require('express');
var http = require('http');
var path = require('path');
var moment = require('moment');
var mailer = require('nodemailer');
var templatesDir = path.resolve(__dirname, 'templates');
var emailTemplates = require('email-templates');

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

  emailTemplates(templatesDir, function(err, template){
    var pusher = payload["pusher"]["name"];
    var commits = payload["commits"];
    var repo = payload["repository"]["name"];
    var owner = payload["repository"]["owner"]["name"];
    var url = payload["repository"]["url"];

    commits_array = [];
    commits.forEach(function(value){
      var id = value["id"];
      var date_str = value["timestamp"].split(" ");
      var timestamp = "[" + moment(date_str[5] + " " + date_str[1] + " " + date_str[2] + " " + date_str[3], "YYYY MMM DD HH:mm:ss").format("YYYY/MM/DD HH:mm") + "]";
      var message = value["message"].replace(/(\r\n)+$/,'').replace(/\n+$/,'');
      var title = message.split("\n")[0];
      var desc = message.split("\n");
      desc.shift();
      if (desc){ desc = desc.join("\n"); };
      var url = value["url"];

      commits_array.push({
        id: id,
        timestamp: timestamp,
        title: title,
        desc: desc,
        url: url
      });
    });

    var locals = {
      pusher: pusher,
      commits: commits_array,
      repo: repo,
      owner: owner,
      url: url,
      moment: moment
    };

    template('push', locals, function(err, html, text){
      var title_length = commits_array[0].title.length;
      var cut_length = 20;
      var subject = "[GitBucket] " + pusher + " - " + repo + " : " + commits_array[0].title.substr(0,cut_length) + (title_length > cut_length ? "..." : "");

      //メールの内容
      var mailOptions = {
        from: mail_setting.from,
        to: mail_setting.addr,
        subject: subject,
        html: html,
        text: text
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
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// ボットの準備
//=========================================================

// Restifyサーバの設定
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function ()
{
  console.log('%s listening to %s', server.name, server.url);
});

// ボットの接続先設定
var connector = new builder.ChatConnector(
{
  // MicrosoftBotFramework公式サイトで取得した、IDとパスワードを入力します
  appId: 'a2d367fc-d359-427a-b592-c7c20321c9d4',
  appPassword: 'KYAxweHwuSUp3nLftUgK2D3'
});

// ボットの仕組みを提供してくれるUniversalBotオブジェクトを作成
var bot = new builder.UniversalBot(connector, 
{
  // エラーメッセージの初期設定を変更
  dialogErrorMessage: "すみません。予報を所得できない場所か、学習不足で認識できません。(T_T)"
});

// ***/api/messagesをエンドポイントとして、ボットをサーバで提供する
server.post('/api/messages', connector.listen());



//=========================================================
// IntentDialogオブジェクトの用意
//=========================================================

// 認識に指定するLUIS APIのアドレスを指定
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/54a899fd-f1be-4710-9f11-6cfb069d1e18?subscription-key=88fe6a6813d3413c9137ad1df9f96da7&timezoneOffset=0&verbose=true&q=');

// IntentDialogオブジェクトを作成
var intents = new builder.IntentDialog({recognizers: [recognizer]});

//=========================================================
// 会話の処理
//=========================================================

// 初期ダイアログを、intentDialogとして使用する
bot.dialog('/', intents);

// インテントと処理の結びつけ
intents.matches('挨拶したい', function (session, args)
{
	//=======================================================
	// インテントが「AskWeather」と認識された時の処理
	//=======================================================
	
	// EntityRecognizerを使用して、エンティティの内容を抽出する。
	var name     = builder.EntityRecognizer.findEntity(args.entities, '名前');
	var greeting = builder.EntityRecognizer.findEntity(args.entities, '挨拶');
	
	// 回答テキストを保管する変数用意
	resultText = ""
	
	// 挨拶の内容を保管
	greetingWord = greeting ? greeting.entity : "こんにちは";
	if(name)
	{
		// 石井の場合はちゃんと馬鹿にする。ほかの人の場合は普通に挨拶する
		if(name.entity == "石井")
		{
			resultText += "石井ちゃんは挨拶もちゃんと出来ないのかい？"
		}
		else
		{
			resultText += name.entity + "さん、" + greetingWord;
		}
		// 結果テキストを発言 + 会話の終了
		session.send(resultText);
	}
	else
	{
		session.send("よーわからん挨拶すんじゃねえ！！！！");
	}
}).onDefault(function()
{

    // =======================================================
    // 当てはまるインテントがなかったのとき(None) の処理
    // =======================================================

    session.send("わからん！おまえが言っていることはわからん！");

});

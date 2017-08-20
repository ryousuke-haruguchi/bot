var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// �{�b�g�̏���
//=========================================================

// Restify�T�[�o�̐ݒ�
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function ()
{
  console.log('%s listening to %s', server.name, server.url);
});

// �{�b�g�̐ڑ���ݒ�
var connector = new builder.ChatConnector(
{
  // MicrosoftBotFramework�����T�C�g�Ŏ擾�����AID�ƃp�X���[�h����͂��܂�
  appId: 'a2d367fc-d359-427a-b592-c7c20321c9d4',
  appPassword: 'KYAxweHwuSUp3nLftUgK2D3'
});

// �{�b�g�̎d�g�݂�񋟂��Ă����UniversalBot�I�u�W�F�N�g���쐬
var bot = new builder.UniversalBot(connector, 
{
  // �G���[���b�Z�[�W�̏����ݒ��ύX
  dialogErrorMessage: "���݂܂���B�\��������ł��Ȃ��ꏊ���A�w�K�s���ŔF���ł��܂���B(T_T)"
});

// ***/api/messages���G���h�|�C���g�Ƃ��āA�{�b�g���T�[�o�Œ񋟂���
server.post('/api/messages', connector.listen());



//=========================================================
// IntentDialog�I�u�W�F�N�g�̗p��
//=========================================================

// �F���Ɏw�肷��LUIS API�̃A�h���X���w��
var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/54a899fd-f1be-4710-9f11-6cfb069d1e18?subscription-key=88fe6a6813d3413c9137ad1df9f96da7&timezoneOffset=0&verbose=true&q=');

// IntentDialog�I�u�W�F�N�g���쐬
var intents = new builder.IntentDialog({recognizers: [recognizer]});

//=========================================================
// ��b�̏���
//=========================================================

// �����_�C�A���O���AintentDialog�Ƃ��Ďg�p����
bot.dialog('/', intents);

// �C���e���g�Ə����̌��т�
intents.matches('���A������', function (session, args)
{
	//=======================================================
	// �C���e���g���uAskWeather�v�ƔF�����ꂽ���̏���
	//=======================================================
	
	// EntityRecognizer���g�p���āA�G���e�B�e�B�̓��e�𒊏o����B
	var name     = builder.EntityRecognizer.findEntity(args.entities, '���O');
	var greeting = builder.EntityRecognizer.findEntity(args.entities, '���A');
	
	// �񓚃e�L�X�g��ۊǂ���ϐ��p��
	resultText = ""
	
	// ���A�̓��e��ۊ�
	greetingWord = greeting ? greeting.entity : "����ɂ���";
	if(name)
	{
		// �Έ�̏ꍇ�͂����Ɣn���ɂ���B�ق��̐l�̏ꍇ�͕��ʂɈ��A����
		if(name.entity == "�Έ�")
		{
			resultText += "�Έ䂿���͈��A�������Əo���Ȃ��̂����H"
		}
		else
		{
			resultText += name.entity + "����A" + greetingWord;
		}
		// ���ʃe�L�X�g�𔭌� + ��b�̏I��
		session.send(resultText);
	}
	else
	{
		session.send("��[�킩��񈥎A���񂶂�˂��I�I�I�I");
	}
}).onDefault(function()
{

    // =======================================================
    // ���Ă͂܂�C���e���g���Ȃ������̂Ƃ�(None) �̏���
    // =======================================================

    session.send("�킩���I���܂��������Ă��邱�Ƃ͂킩���I");

});

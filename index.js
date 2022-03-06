const http = require('http');//httpリクエスト
http.createServer(function(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('ping:'+`${client.ws.ping}ms`);
}).listen(3000);

const { Client, Intents } = require('discord.js');
const options = {
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGES],
};
const client = new Client(options);

var MojangAPI = require('mojang-api');
const fs = require('fs');
var prefix = ">";

//ready
client.once('ready', () => {
  //時間
  var now = new Date();
  var h = now.getHours()
  var m = now.getMinutes()
  var s = now.getSeconds() 
  
  var stats = 0; 
　setInterval(() => {
    if (stats == 0){
      client.user.setActivity('Created by Taka005#1203', {
        type: 'PLAYING'
      });      
      stats = 1;
    } else if (stats == 1){
      client.user.setActivity(`>help || ping:${client.ws.ping}`, {
        type: 'PLAYING'
      });
      stats = 2;
    } else if (stats == 2){
      client.user.setActivity(`ver:2.0.0`, {
        type: 'PLAYING'
      });
      stats = 0; 
    }
  }, 8000)
//console.log
  console.log(`[${h}:${m}:${s}]CLIENT:READY! USER:${client.user.tag}`); 
  console.log(`[${h}:${m}:${s}]CLIENT:<${client.guilds.cache.size}>SERVER`)
//fs.log
  fs.appendFileSync('./log.txt', `\n[${h}:${m}:${s}]CLIENT:READY! USER:${client.user.tag}`, (err) => {
    if(err) {
      console.log(err);
    }
  }); 
  
});

client.on('messageCreate', async (message) => { 
    //時間
    var now = new Date();
    var h = now.getHours()
    var m = now.getMinutes()
    var s = now.getSeconds() 
    //変数
    var reply = `<@!${message.author.id}>`
//console.log
    console.log(`[${h}:${m}:${s}]MESSAGE:(`+message.author.tag+`)`+message.content+` [PING:${client.ws.ping}ms`);
//fs.log
    fs.appendFileSync('./log.txt', `\n[${h}:${m}:${s}]MESSAGE:(`+message.author.tag+`)`+message.content+` [PING:${client.ws.ping}ms`, (err) => {
      if(err) {
        console.log(err);
      }
    }); 
  
    //textのみ
    if(!message.channel.type === 'GUILD_TEXT' || message.author.bot) return;
    if(!message.content.startsWith(prefix)) return  
    //ping   
    if(message.content === `${prefix}ping`){
      message.channel.send(`現在のPING:${client.ws.ping}ms`)
    }
    //say  
    else if(message.content.startsWith(">say")){
      const args = message.content.split(" ").slice(1);
        message.delete()     
      if(!args[0]) return message.channel.send(`${reply}>sayの後にテキストが必要です`);
        message.channel.send(`${args}`)
    }
    //join
    else if(message.content === `${prefix}join`){
      const period = Math.round((Date.now() - message.member.joinedAt) / 86400000) 
      message.reply(message.author.tag+`は${message.guild.name}に約${period}日間サーバーに参加しています`)
    }
    //timer
    else if(message.content.startsWith(`>timer`)){
      const args = message.content.split(" ").slice(1);
      if (!args[0]) return message.reply("`>timer`の後に数字が必要です");
        if(isNaN(args)) return message.reply("数字を入力してください");
        if (args < 1 ) return message.reply("設定値は1以上にしてください")   
        if (args > 300) return message.reply("設定値は300以下にしてください")
          message.channel.send(`タイマーを${args}秒に設定しました。`)
          setTimeout(() => {
            message.reply(`${args}秒経ちました`)
          }, args * 1000) 
    }
    //del
    else if(message.content.startsWith(">del")){//delコマンド
      const args = message.content.split(" ").slice(1);
        message.delete()
      if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`${reply}>delを使う権限がありません`);
        if (!args[0]) return message.channel.send(`${reply}削除する数を指定してください`);
        if(isNaN(args)) return message.channel.send(`${reply}数字を入力してください`)
        if (args < 2 ) return message.channel.send(`${reply}削除する数は2以上にしてください`)   
        if (args > 80 ) return message.channel.send(`${reply}削除する数は80以下にしてください`)
          var messages = await message.channel.messages.fetch({ limit: args })         
            message.channel.bulkDelete(messages)
              .then(() => message.channel.send(`${reply}${args}個のメッセージを削除しました。`))
              .catch(e => message.channel.send(`${reply}削除できないメッセージが含まれています`)) 
    }
    //draw
    else if(message.content === `${prefix}draw`){
      var arr = ["大吉", "中吉", "小吉","小吉", "吉","吉","吉","凶", "大凶"];
      var random = Math.floor(Math.random() * arr.length);
      var result = arr[random];
        message.reply({
          embeds:[{
            color: "RANDOM",
            description: `${result}`
          }]
        });
    }
    //clock
    else if(message.content === `${prefix}clock`){
      require('date-utils'); 
      var now = new Date();     
        message.channel.send(now.toFormat('YYYY年MM月DD日')+`${h}時${m}分${s}秒`)
    }
    //bans
    else if(message.content === `${prefix}bans`){
      const bans = await message.guild.bans.fetch()
        message.reply(bans.map(ban => ban.user.tag).join('\n') || 'このサーバーではBANされた人がいません')
    }
    //url
    else if (message.content.startsWith(`>url`)) {//urlコマンド
      const args = message.content.split(" ").slice(1);
      message.delete()
      if (!args[0]) return message.channel.send(`${reply}ファイルのURLが必要です`);
      　message.channel.send({ files: args })
          .catch(e=>message.channel.send(`${reply}無効なURLまたはファイルではありません`))
    }
    //>
    else if(message.content === ">" ){
      message.channel.send({
        embeds:[{
          title: "ようこそ！",
          description: "製作者:Taka005#1203\n" + "プレフィックスは`>`です",
          color: "WHITE",
          footer: {
            text: "サポートサーバー\n  https://discord.gg/xQ75JGuFBu"
          },
          fields: [
            {
            name: "**このBOTは？**",
            value: "雑用BOTでさまざまな機能があります\n大手BOTにはない機能などが備わっています"
            },
            {
            name: "**使うには？**",
            value: "`>help`で機能一覧を表示しましょう"
            },
            {
            name: "**わからない時には?**",
            value: "サポートサーバーへ行って聞いてきましょう\n入ってくれると製作者が喜びます"
            }
          ]
        }]
      })
    }
    //poll
    else if (!message.content.startsWith(prefix)) return//pollコマンド
      var usertag = message.author.tag;
      const [command, ...args] = message.content.slice(prefix.length).split(' ')
      if (command === 'poll') {
        const [title, ...choices] = args
          if (!title) return message.channel.send(`${reply}タイトルと選択肢を指定してください`)
            message.delete()
          const emojis = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮','🇯','🇰','🇱','🇲','🇳','🇴','🇵','🇶','🇷','🇸','🇹']
          if (choices.length < 2 || choices.length > emojis.length)
            return message.channel.send(`${reply}選択肢は2から${emojis.length}個を指定してください`)
          const poll = await message.channel.send({
                      embeds:[{
                        title: title,
                        color: "RANDOM",
                        description: choices.map((c, i) => `${emojis[i]} ${c}`).join('\n'),
                        footer: {
                          text: `${usertag}によって送信`
                        }
                      }]
          });
        emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji))
    } 
    //mendel
    else if (message.content.startsWith('>mdel') && message.guild) {
      const args = message.content.split(' ')[1];     
      if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`${reply}>delを使う権限がありません`);
      if (!args) return message.channel.send(`${reply}削除する数を指定してください`);
      if (args < 2 ) return message.channel.send(`${reply}削除する数は2以上にしてください`)   
      if (args > 80 ) return message.channel.send(`${reply}削除する数は80以下にしてください`)     
      if (!args || message.mentions.members.size == 0) return message.channel.send(`${reply}メンションで指定してください`);
        const messages = await message.channel.messages.fetch({ limit: args })
        const mentionMembers = await message.mentions.members.map(m => m.user.id)
        const mentionFilter =  await messages.filter(msg => mentionMembers.some(userID => userID == msg.author.id))
          message.channel.bulkDelete(mentionFilter)
            .then(() => message.channel.send(`${reply}${args}個の${mentionFilter}のメッセージを削除しました。`))
            .catch(e => message.channel.send(`${reply}削除できないメッセージが含まれています`)) 
    }
    //info
    else if(message.content === `${prefix}info`){//infoコマンド
       message.channel.send(
        {embeds:[{
          title: "INFOMATION",
          color: 7506394,
          fields: [
            {
              name: "**ユーザー名**",
              value: `${message.author.tag}`
            },
            {
              name: "**ユーザーID**",
              value: `${message.author.id}`
            },
            {
              name: "**ニックネーム**",
              value: `${message.member.nickname}`
            },
            {
              name: "**メッセージID**",
              value: `${message.nonce}`
            },
            {
              name: "**送信したチャンネル名**",
              value: `${message.channel.name}`
            },
            {
              name: "**送信したチャンネルID**",
              value: `${message.channel.id}`
            },
            {
              name: "**サーバー名**",
              value: `${message.guild.name}`
            },
            {
              name: "サーバーID",
              value: `${message.guild.id}`
            },
            {
              name: "**サーバーの人数**",
              value: `${message.guild.memberCount}人`
            }
          ]
        }]
      });
    } 
    //help
    else if (message.content === `${prefix}help`) {//helpコマンド
          message.channel.send( {embeds:[ {//埋め込み
            title: "BOTのHELP",
            description: "製作者:Taka005#1203\n" +
                        "プレフィックスは`>`です",
            color: "RED",
            footer: {
              text: "サポートサーバー\n  https://discord.gg/xQ75JGuFBu"
            },
            fields: [
            {
            name: "**>ping**",
            value: "BOTのPINGを表示します"
            },
            {
            name: "**>clock**",
            value: "現在時刻を表示します"
            },
            {
            name: "**>say**",
            value: ">say [text]でBOTにメッセージを表示させます\n※稀に自分の送信したメッセージが消えないことがありますが他の人には見えていないので大丈夫です"
            },
            {
            name: "**>timer**",
            value: ">timer [second]で時間を秒単位で測れます\n※あまりに長い時間は設定しないでください"
            },
            {
            name: "**>poll**",
            value: ">poll [title] [A] [B] ...と入力してアンケートが作れます"
            },
            {
            name: "**>draw**",
            value: "おみくじを引くことができます。運勢を確かめよう！"
            },
            {
            name: "**><help**",
            value: "メモ機能のHELPを表示する"
            },
            {
            name: "**>bans**",
            value: "サーバーからBANされた人を表示します"
            },
            {
            name: "**>join**",
            value: "自分がサーバーに参加している日数を表示します"
            },
            {
            name: "**>info**",
            value: "様々な情報を表示します"
            },
            {
            name: "**>url**",
            value: ">url [ファイルURL]でBOTにファイルを送信させます"
            },
            {
            name: "**ここからは管理者専用です**",
            value:"※使用には注意してください"
            },
            {
            name: "**>del**",
            value: ">dell [number]でメッセージを削除できます\n**※二週間以上前のメッセージは削除できません。**"
            }
          ]
          }]});
    }      
    //mcid
    else if (message.content.startsWith(">mc")){
      const args = message.content.split(" ").slice(1);
      if (!args[0]) return message.reply("名前を指定してください");
      var txt = args[1]
      if (!txt.match(/^[^\x01-\x7E\xA1-\xDF]+$/)) return message.reply("半角で入力してください")  
        MojangAPI.nameToUuid(args, function(err, res) {
          if (err)
           message.reply("処理中にエラーが発生しました")
          else {
            try{
              message.channel.send(res[0].name + "で確認しました！" + "UUID:"+ res[0].id);
            }catch(error){
              message.reply("そのプレイヤーが存在しないか、間違っています")
            }
            
        }
      });
    }
    //note
    else if (message.content.startsWith("><")) {
        const text = message.content.split(" ").slice(1);
        var filename = message.author.id;
        var usename = message.author.tag;
        message.delete()
        if (message.content === `${prefix}<help`){//help
              message.channel.send({
                embeds:[{
                  title: "メモ機能のHELP",
                  description: "製作者:Taka005#1203\n" + "プレフィックスは`><`です",
                  color: "BLUE",
                  footer: {
                    text: "サポートサーバー\n  https://discord.gg/xQ75JGuFBu"
                  },
                  fields: [
                    {
                    name: "**><r**",
                    value: "メモに書いた内容を出力します"
                    },
                    {
                    name: "**><n**",
                    value: "メモを作成、またはリセットします"
                    },
                    {
                    name: "**><d**",
                    value: "メモを削除します"
                    },
                    {
                    name: "**><w**",
                    value: "><w [text] でメモを書き込みます"
                    },
                    {
                    name: "**注意点**",
                    value: "**1人一つまでしかメモは作成できません**"
                    }
                  ]
                }]
            })
        }else if(message.content === `${prefix}<r`){//read
          fs.readFile(`./note/${filename}.txt`, (err, data) => {
            if(err){
              message.channel.send(`${reply}メモを作成してください`)
            } else {
              try{
                message.channel.send(`${data}`);
              }catch(error){
                message.channel.send("技術的な問題が発生しました")
              }
            }
          });
        }else if(message.content === `${prefix}<n`){//new
          fs.writeFile(`./note/${filename}.txt`, `----${usename}----`, (err) => {
            if(err) {
              message.channel.send(`${reply}操作を正常に完了できませんでした`)
            } else {
              message.channel.send(`${reply}メモを作成、またはリセットしました`);
            }
          });
        }else if(message.content === `${prefix}<d`){//del
          fs.unlink(`./note/${filename}.txt`, (err) => {
            if (err) {
              message.channel.send(`${reply}メモを作成してください`)
            } else {
              message.channel.send(`${reply}メモを削除しました`);
            }
          });
        }else if (message.content.startsWith("><w")){//write
          if (!text[0]) return message.reply("メモの内容が必要です");
            fs.appendFile(`./note/${filename}.txt`, `\n${text}`, (err) => {
              if(err) {
                message.channel.send(`${reply}操作を正常に完了できませんでした`)
              } else{
                message.channel.send(`${reply}記入しました`)
              }
            }); 
        }
      }
  });

client.on("guildMemberAdd", member => {

  console.log(`[${h}:${m}:${s}]JOIN:${member.user.tag} PING:${client.ws.ping}ms`)

  fs.appendFileSync('./log.txt', `\n[${h}:${m}:${s}]JOIN:${member.user.tag} PING:${client.ws.ping}ms`, (err) => {
    if(err) {
      console.log(err);
    }
  });
  
  if (member.guild.id !== "942268307795492864") return; //サーバーを指定
    member.guild.channels.cache.get("942268307795492867").send(`${member.user}鷹のすみかへようこそ！この鯖では認証を行う必要があります。<#942272675584307260>でロールを付与してください`);
    
                
  member.guild.channels.cache.get("942271322690555904").send(`<@&944548589777080330>`+`${member.user.tag}がサーバーに参加しました`);
});
//memmberleave
client.on('guildMemberRemove', member => {
  console.log(`[${h}:${m}:${s}]LEAVE:${member.user.tag} PING:${client.ws.ping}ms`)  

  fs.appendFileSync('./log.txt', `\n[${h}:${m}:${s}]LEAVE:${member.user.tag} PING:${client.ws.ping}ms`, (err) => {
    if(err) {
      console.log(err);
    }
  }); 
});

client.login(process.env.DISCORD_BOT_TOKEN)
const Discord = require("discord.js");
const client = new Discord.Client();
const snekfetch = require("snekfetch");
const afkCheckTime = 70000;
const step = 5000;

client.on('ready', function() {
    console.log("Connected");
    console.log("Logged in as: ");
    console.log(client.user.username);0
    client.user.setActivity(`in a Lost Halls!`);
  });

  // Sleep function, for delaying actions
  function sleep(ms) {
      return new Promise(function(resolve, reject) {
          setTimeout(resolve, ms);
      });
  }
   
  function percent(lil, full) {
      return (lil / full) * 100;
  }
   
  function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
  }
   
  var queueChannel = '407250816592904192';
  var raidLeaderChat = '417168779802443786';
  var raidChannel = '407251403178901505';
  // Wrap the entire source code in an asynchronous function
  (async function run() {
      console.log("Welcome to CultistBot!");
      console.log("Starting event definitions");
   
      function buildContent(remainingTime) {
          return `**__An AFK Check is starting. You will have ${afkCheckTime / 1000} seconds to react and get in the queue!__**
  **React with the Spooky boi to be able to move to Raid.**
  **React with Vial if you have Vial to open on the run.**
  **React with the Cultist if you want to do cultist.**
  **And with the LH key if you have a key**
   
  Always get in voice channel to get the groups.
  <@&407245309232807936>
   
  Time remaining: ${remainingTime / 1000} seconds.`;
          //**<@&407245309232807936>**
      }
      // afk-check command
      client.on('message', async (msg) => {
          if (msg.content.startsWith(":afk-check")) {
  //            if (msg.channel.name == 'raid-info' || msg.channel.name == 'bot-testing' || msg.channel.name == 'bot-test') {
                  if (msg.member.highestRole.position >= msg.guild.roles.get('407240648622604288').position) {
                      var mesg = msg;
                      var remaining = afkCheckTime;
                      var msg = await msg.guild.channels.get('407249005173538816').send("<@&407245309232807936> An AFK check is starting shortly...");
                      var botReactions = [];
                      botReactions.push(await msg.react('407324790202957825'));
                      botReactions.push(await msg.react('407325019031732244'));
                      botReactions.push(await msg.react('407324867638198273'));
                      botReactions.push(await msg.react('412677262845018112'));
   
                      // Countdown
                      await msg.edit(buildContent(remaining));
                      var steps = afkCheckTime / step;
                      for (var i=0;i<steps;i++) {
                          await sleep(step);
                          remaining = remaining - step;
                          await msg.edit(buildContent(remaining));
                      }
   
                      // Notify about AFK check ending
                      await msg.edit('AFK check has ended. You will be moved to appropriate voice channels. If you haven\'t won this one, stay tuned for a next one!');
                      for (var i=0;i<botReactions.length;i++) {
                          await botReactions[i].remove();
                      }
                      // Do magic with reactions
                      // Get all users
                      var gusers = {};
                      var reactions = msg.reactions.array();
                      for (var i=0;i<reactions.length;i++) {
                          var users = reactions[i].users.array();
                          for (var j=0;j<users.length;j++) {
                              if (queueChannel.members.get(users[j].id) || raidChannel.members.get(users[j].id)) {
                                  if (gusers[users[j].id]) {
                                      gusers[users[j].id].push(reactions[i].emoji.id);
                                  } else {
                                      gusers[users[j].id] = [reactions[i].emoji.id];
                                  }
                              }
                          }
                      }
                      botReactions.push(await msg.react('407324790202957825'));
                      botReactions.push(await msg.react('407325019031732244'));
                      botReactions.push(await msg.react('407324867638198273'));
                      botReactions.push(await msg.react('412677262845018112'));
                      console.log(gusers);
                      var cultist = [];
                      var groupA = [];
                      var groupB = [];
                      var cgroup = 0;
                      for (var i in gusers) {
                          if (cgroup === 0) {
                              if (gusers[i].includes('407324790202957825') || gusers[i].includes('407324867638198273')) {
                                  groupA.push(i);
                                  cgroup = 1;
                              }
                          } else {
                              if (gusers[i].includes('407324790202957825') || gusers[i].includes('407324867638198273')) {
                                  groupB.push(i);
                                  cgroup = 0;
                              }
                          }
                      }
                      for (var i in gusers) {
                          if (gusers[i].includes('407324867638198273')) {
                              cultist.push(i);
                          }
                      }
                      // Get percentage
                      if (percent(cultist, gusers) < 20) {
                          for (var i in gusers) {
                              if (!cultist.includes(i)) {
                                  cultist.push(i);
                                  if (!percent(cultist, gusers) < 20) {
                                      break;
                                  }
                              }
                          }
                      }
                      var promises = [];
                      for (var i=0;i<groupA.length;i++) {
                          promises.push(client.users.get(groupA[i]).send(cultist.includes(groupA[i]) ? "You are on group A. You will do Cultist Hideout." : "You are on group A and will do void."));
                      }
                      for (var i=0;i<groupB.length;i++) {
                          promises.push(client.users.get(groupB[i]).send(cultist.includes(groupB[i]) ? "You are on group B. You will do Cultist Hideout." : "You are on group B and will do void."));
                      }
                      await Promise.all(promises);
                      var ch = mesg.guild.channels.get(raidLeaderChat);
                      var text = `**Afk check results:**\n\n**Group A**\n`;
                      for (var i=0;i<groupA.length;i++) {
                          text = `${text}<@${groupA[i]}>\n`;
                      }
                      text = `${text}\n**Group B**\n`;
                      for (var i=0;i<groupB.length;i++) {
                          text = `${text}<@${groupB[i]}>\n`;
                      }
                      text = `${text}\n**Cultist**\n`;
                      for (var i=0;i<cultist.length;i++) {
                          text = `${text}<@${cultist[i]}>\n`;
                      }
                      text = `${text}\n**Vial**\n`;
                      for (var i in gusers) {
                          if (gusers[i].includes('407325019031732244')) {
                              text = `${text}<@${i}>\n`;
                          }
                      }
                      text = `${text}\n**Key**\n`;
                      for (var i in gusers) {
                          if (gusers[i].includes('412677262845018112')) {
                              text = `${text}<@${i}>\n`;
                          }
                      }
                      await ch.send(text, {split: true});
                      var promises = [];
                      queueChannel.members.array().forEach(user => {
                          if (!gusers[user.user.id]) {
                              promises.push(user.setVoiceChannel('407265287130316800'));
                          }
                      });
                      await Promise.all(promises);
                  } else {
                      msg.reply("You do not have appropriate permissions to run this command!");
                  }
    //          } else {
      //            msg.reply("You cannot use this command here!");
        //      }
          }
          if (msg.content.startsWith(':move')) {
              if (msg.member.permissions.has('MANAGE_ROLES')) {
                  var msg = await msg.channel.send("Moving people from Queue to Raid");
                  var people = msg.guild.channels.get('407250816592904192').members.array();
                  var promises = [];
                  people.forEach(person => {
                      promises.push(person.setVoiceChannel('407251403178901505'));
                  });
                  await Promise.all(promises);
                  await msg.edit("Done!");
              }
          }
          if (msg.content.startsWith(':eval')) {
              if (msg.author.id === '102038103463567360') {
                  var code = msg.content.substr(6);
                  var resp = eval(code);
                  msg.reply('Returned value is now in console.');
                  console.log(resp);
              } else {
                  msg.reply("You cannot do this ;-;");
              }
          }
          if (msg.content.startsWith(':help')) {
              msg.channel.send(`**Cultist Bot commands:**
   
  \`:afk-check\` - Begin an afk check
  \`:move\` - Move people from Queue to Doing LH | Raid
  \`:eval\` - Bot coder (Rph) only | Execute Javascript code
  \`:help\` - View this document`);
          }
      });

client.on('message', function(message) {
    var args = message.content.split(" ");
    var cmd = args[0];
  
    args = args.splice(1);
  
         switch(cmd) {

case "!ping":
message.reply("Pong!")
break;

case "!finduser":
let foundusr = args.splice(0).join(" ");

if(!foundusr)
return message.channel.send("Please include someone to search!")

let founderusr = client.users.get("name", foundusr).id;

message.channel.send(`<@${founderusr}>`)
break;

case "!find":
let users = client.users;
let searchTerm = args[0];

if(!searchTerm) 
return message.channel.send("Please provide a name to search for!")

let matches = users.filter(u => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
let foundppl = matches.map(users => users.nickname)

if(!foundppl)
return message.channel.send("There is nobody that matches that username!")

message.channel.send(foundppl);
break;

case "!unvial":
let vialpopped = message.mentions.users.first();

if(!vialpopped)
return message.reply("Please mention a user to remove the vial role from.")

message.guild.member(vialpopped).removeRole("407241165293879317");

message.channel.send("Vial removed from " + vialpopped);
break;

case "!vial":
let vialtaker = message.mentions.users.first();

if(!vialtaker)
return message.reply("Please mention a user to give the vial role to.")

message.guild.member(vialtaker).addRole("407241165293879317");

message.channel.send("Vial added to " + vialtaker);
break;

case "!verification":
if(!message.member.roles.some(r=>["Coder"].includes(r.name)) )
return;

message.channel.send({embed: {
  color: 0xff040b,
  author: {
    name: `Verification Tutorial`,
    icon_url: client.user.avatarURL
  },
  fields: [{
      name: "**How to verify**",
      value: `When verifying, you must follow these steps perfectly in order to be verified. It is recommended you login to your RealmEye page before verifying.`,
    },
    {
      name: "**Step 1**",
      value: "Send ``!verify`` followed by your username into this channel (!verify Superninna). __**Misspelling your name will nullify your verification attempt.**__",
    },
    {
      name: `**Step 2**`,
      value: `After receiving the code, replace __**everything in the first line of your RealmEye description**__ with the code. Wait 90 seconds, and if you did everything right you will be verified!`,
    },
  ],
  footer: {
    text: "The bot will send you back your original RealmEye description",
  }
}
});

break;

case "!verify":
if(message.member.roles.some(r=>["Member"].includes(r.name)) )
return;

let ruser = args.slice(0).join("");
let rcode = ("CH" + Math.floor(Math.random(11111) * 99999));
let rapi = "http://www.tiffit.net/RealmInfo/api/user?u=" + ruser + "&f=c;"

snekfetch.get(rapi).then(h => {
  let brdesc = h.body.description;

if(!ruser)
return message.author.send("Please include a username after !verify! Any typos will cause your verification process to fail.")

message.delete();

message.author.send({embed: {
  color: 0xff040b,
  author: {
    name: `Verification | ${message.author.tag}`,
    icon_url: message.author.avatarURL
  },
  fields: [{
      name: "**Your Code:**",
      value: `__**${rcode}**__`,
      inline: true,
    },
    {
      name: "**Realmeye Link:**",
      value: `https://www.realmeye.com/player/${ruser}`,
      inline: true,
    },
    {
      name: `Place your code in the __**first line**__ of your Realmeye description, replacing everything else.`,
      value: `Your original Realmeye description will be sent back shortly.`,
    },
  ],
  footer: {
    text: "*The bot will check in 90 seconds to see if you followed directions.*",
  }
}
})

setTimeout(function(){ 

snekfetch.get(rapi).then(r => {
  let rdesc = r.body.description;
  let rname = r.body.name

  if(!rdesc.includes(rcode))
  return message.author.send("Your code was not found in the first line of your Realmeye description. Your previous Realmeye description was:\n```" + brdesc + "```")

  if(rdesc.includes(rcode))
  message.guild.member(message.author).setNickname(`${rname}`)
  message.guild.member(message.author).addRole("407245309232807936")
  message.author.send("You have successfully been verified!\nYour previous Realmeye description was:\n```" + brdesc + "```");
})
}, 90000);
})
         }
break;
         })
        })    
client.login(process.env.BOT_TOKEN);

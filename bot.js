const Discord = require("discord.js");
const client = new Discord.Client();
const snekfetch = require("snekfetch");

client.on('ready', function() {
    console.log("Connected");
    console.log("Logged in as: ");
    console.log(client.user.username);0
    client.user.setActivity(`in a Lost Halls!`);
  });

client.on('message', function(message) {
    var args = message.content.split(" ");
    var cmd = args[0];
  
    args = args.splice(1);
  
         switch(cmd) {

case "!ping":
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;
                 
message.reply("Pong!")
break;

case "!finduser":
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;
                 
let foundusr = args.splice(0).join(" ");

if(!foundusr)
return message.channel.send("Please include someone to search!")

let founderusr = client.users.get("name", foundusr).id;

message.channel.send(`<@${founderusr}>`)
break;

case "!movequeue":
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;

var msg = message.channel.send("Moving!")
var people = client.channels.get('433161500467789834').members.array();
var promises = [];
people.forEach(person => {
    promises.push(person.setVoiceChannel('433165707765874689'));
});
Promise.all(promises);

break;
                 
case "!find":
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;
                 
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
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;
                 
let vialpopped = message.mentions.users.first();

if(!vialpopped)
return message.reply("Please mention a user to remove the vial role from.")

message.guild.member(vialpopped).removeRole("407241165293879317");

message.channel.send("Vial removed from " + vialpopped);
break;

case "!vial":
if(!message.member.roles.some(r=>["Raid Leader", "Trial Raid Leader", "Officer", "Admin", "Head Raid leader"].includes(r.name)) )
return;
                 
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
message.delete();
                 
if(message.member.roles.some(r=>["Member"].includes(r.name)) )
return;

let ruser = args.slice(0).join("");
let rcode = ("CH" + Math.floor(Math.random(11111) * 99999));
let rapi = "http://www.tiffit.net/RealmInfo/api/user?u=" + ruser + "&f=c;"

snekfetch.get(rapi).then(h => {
  let brdesc = h.body.description;
  let rstars = r.body.rank
  let rcount = r.body.characterCount
  let rlocation = r.body.last_seen
  let rfame = r.body.fame
  
if(!ruser)
return message.author.send("Please include a username after !verify! Any typos will cause your verification process to fail.")
message.delete();
    
if(rstars < (30))
return message.author.send("You do not have enough stars to be verified! You have " + rstars + ". You need __**30**__.\nYour previous Realmeye description was:\n```" + brdesc + "```")
message.delete();
    
if(rcount < (2))
return message.author.send("You do not have enough characters to be verified!\nYour previous Realmeye description was:\n```" + brdesc + "```")
message.delete();
    
if(!rlocation.includes("hidden"))
return message.author.send("Your location is not hidden so you cannot be verified!\nYour previous Realmeye description was:\n```" + brdesc + "```")
message.delete();
    
if(rfame < (1500))
return message.author.send("Your do not have enough fame to be verified! You have " + rfame + ". You need __**1500**__.\nYour previous Realmeye description was:\n```" + brdesc + "```")
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

    client.channels.get('433164306503434240').send({embed: {
  color: 0xff040b,
  author: {
    name: `Verification | ${message.author.tag}`,
    icon_url: message.author.avatarURL
  },
  fields: [{
      name: message.author.tag + "'s Code:",
      value: `__**${rcode}**__`,
      inline: true,
    },
    {
      name: "**Realmeye Link:**",
      value: `https://www.realmeye.com/player/${ruser}`,
      inline: true,
    },
  ],
  footer: {
    text: "*Please notify the user if he/she has failed to follow the directions for verifying.*",
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
break;
         }
         })  
client.login(process.env.BOT_TOKEN);

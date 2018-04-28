// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`RaidBot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Defending Shroud`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving Shroud`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving Shroud`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user, Don't be dumb.");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === "beta") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send('Author: Temper, \nTesters: Roogen, Prometheus, Blink, RenegadeSound & Newg. \nMuch love, Temp');
  }

  if(command === "fe") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{});
    // And we get the bot to say the thing:
    message.channel.send('Element buff: Water, Wind, Ice. \n Offence: Bukijutsu. \n Decreases Stamina for Bukijutsu. \n Weakness: Fire, Earth & Lava ');
  }

  if(command === "prome") {
    message.channel.send("Sorry, did you mean Prom Queen? te he");
  }
if(command === "velocityforce") {
  message.channel.send({
      "embed": {
          title: 'VELOCITY FORCE | EJ | BUKI | SPECIAL | 5 USES | WIND',
          "image": {
            "url": "https://cdn.discordapp.com/attachments/240174505190752256/439533225673752576/unknown.png",
          }
      }
  })
}
if(command === "needletwister") {
  message.channel.send({
      "embed": {
          title: 'NEEDLE TWISTER | EJ | BUKI | NORMAL | 8 USES | WIND',
          "image": {
            "url": "https://i.gyazo.com/01a1079397bb7b2e632c8c6e48bb1ac3.png",
          }
      }
  })
}
if(command === "vacuumblade") {
  message.channel.send({
      "embed": {
          title: 'VACUUM BLADE | BUKI | EJ | NORMAL | 8 USES | WIND',
          "image": {
            "url": "https://i.gyazo.com/70f5d03bfdf0faf5021966f910b173b3.png",
          }
      }
  })
}
if(command === "bladewindtornado") {
  message.channel.send({
      "embed": {
          title: 'BLADEWIND TORNADO | BUKI | EJ | NORMAL| 5 USES | WIND',
          "image": {
            "url": "https://i.gyazo.com/aedc4a9b27e21ce961849299a68aa88f.png",
          }
      }
  })
}
if(command === "azureocean") {
  message.channel.send({
      "embed": {
          title: 'AZURE OCEAN | BUKI | EJ | SPECIAL | 5 USES | WATER',
          "image": {
            "url": "https://i.gyazo.com/702a4280c7953552cd99ffa3529962bd.png",
          }
      }
  })
}
if(command === "hydrolinedance") {
  message.channel.send({
      "embed": {
          title: 'HYDROLINE DANCE | BUKI | EJ | NORMAL | 8 USES | WATER ',
          "image": {
            "url": "https://i.gyazo.com/d185ad0e0bfdaea3a6be93f0fe189e19.png",
          }
      }
  })
}
if(command === "lastharvest") {
  message.channel.send({
      "embed": {
          title: 'LAST HARVEST | BUKI | EJ | NORMAL | 8 USES | WATER ',
          "image": {
            "url": "https://i.gyazo.com/536e35ca30bdc34dbc54b1cb8d927538.png",
          }
      }
  })
}
if(command === "hydroweb") {
  message.channel.send({
      "embed": {
          title: 'HYDRO WEB | BUKI | EJ | NORMAL | 5 USES | WATER ',
          "image": {
            "url": "https://i.gyazo.com/ca5d4ffc229fae0dadef8982a1ea1ad5.png",
          }
      }
  })
}
if(command === "dragonkingsimpact") {
  message.channel.send({
      "embed": {
          title: 'DRAGON KINGS IMPACT | BUKI | EJ | FORBIDDEN | 4 USES | NO ELE ',
          "image": {
            "url": "https://puu.sh/AbCak/e31777a460.png",
          }
      }
  })
}
if(command === "hypnoticassault") {
  message.channel.send({
      "embed": {
          title: 'HYPNOTIC ASSAULT | BUKI | EJ | SPECIAL | 5 USES | DAMAGE | DEFMOD | GENMOD',
          "image": {
            "url": "https://i.gyazo.com/69c0145d799ae679426db0828db46019.png",
          }
      }
  })
}
if(command === "shurikenprison") {
  message.channel.send({
      "embed": {
          title: 'SHURIKEN PRISON | BUKI | EJ | NORMAL | NO ELE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/cbc21b7bc11fd54e74661b6e3e535186.png",
          }
      }
  })
}
if(command === "dragonstyledeadfall") {
  message.channel.send({
      "embed": {
          title: 'DRAGON STYLE: DEADFALL | BUKI | EJ | NORMAL | NO ELE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2fc7d32f064106948c10547a7134f5cf.png",
          }
      }
  })
}
if(command === "electromagneticacceleration") {
  message.channel.send({
      "embed": {
          title: 'ELECTROMAGNETIC ACCELERATION | BUKI | SPECIAL | LIGHTNING | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/71ea27dadaf6c92c62efa256e170ca56.png",
          }
      }
  })
}
if(command === "gattlingimpact") {
  message.channel.send({
      "embed": {
          title: 'GATTLING IMPACT | BUKI | EJ | NORMAL | LIGHTNING | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/231fe4593994645a1a741c3369e97105.png",
          }
      }
  })
}
if(command === "boltjump") {
  message.channel.send({
      "embed": {
          title: 'BOLT JUMP | BUKI | EJ | NORMAL | LIGHTNING | 8 USES',
          "image": {
            "url": "https://puu.sh/AbCtZ/4c8544c041.png",
          }
      }
  })
}
if(command === "cracklingdance") {
  message.channel.send({
      "embed": {
          title: 'CRACKLING DANCE | BUKI | EJ | NORMAL | LIGHTNING | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/398273d9a05e1491c269bd60c09143f7.png",
          }
      }
  })
}
if(command === "lightninglord") {
  message.channel.send({
      "embed": {
          title: 'FUSION TECHNIQUE: LIGHTNING LORD | TAI | EJ | SPECIAL | LIGHTNING | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/3990c5e89b4d15f73cbff6444f4b1e96.png",
          }
      }
  })
}
if(command === "flashfang") {
  message.channel.send({
      "embed": {
          title: 'FLASH FANG | TAI | EJ | LIGHTNING | NORMAL | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f56de0e3b94a6717352842c07f022766.png",
          }
      }
  })
}
if(command === "defibrillatorassault") {
  message.channel.send({
      "embed": {
          title: 'DEFIBRILLATOR ASSAULT | TAI | EJ | LIGHTNING | NORMAL | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/44219756139ee0b1fd39d7c853961101.png",
          }
      }
  })
}
if(command === "gatestrikedynamo") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: DYNAMO | TAI | EJ | NORMAL | LIGHTNING | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/6ad9fb2fa85234c42667be465d1c7208.png",
          }
      }
  })
}
if(command === "windlord") {
  message.channel.send({
      "embed": {
          title: 'FUSION TECHNIQUE: WIND LORD | TAI | EJ | SPECIAL | WIND | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/6e989b3869bd2f3d6231627cedb5cf2f.png",
          }
      }
  })
}
if(command === "vortexclaws") {
  message.channel.send({
      "embed": {
          title: 'VORTEX CLAWS | TAI | EJ | NORMAL | WIND | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/8ba78cb1ccc7c7921ca87da74052eb50.png",
          }
      }
  })
}
if(command === "doubletime") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: DOUBLE TIME | TAI | EJ | WIND | NORMAL | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/760c69d02732d0d286d869fb5c9681d2.png",
          }
      }
  })
}
if(command === "piercingwindimpact") {
  message.channel.send({
      "embed": {
          title: 'PIERCING WIND IMPACT | TAI | EJ | NORMAL | WIND | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/8a72183ac4bd862039a54e97bb696e96.png",
          }
      }
  })
}
if(command === "furyofthewhitetiger") {
  message.channel.send({
      "embed": {
          title: 'FURY OF THE WHITE TIGER | TAI | EJ | FORBIDDEN | NO ELE | 4 USES',
          "image": {
            "url": "https://i.gyazo.com/dd46bc3f5491c2e60edcd837623a27b2.png",
          }
      }
  })
}
if(command === "goliath") {
  message.channel.send({
      "embed": {
          title: 'BODY MANIPULATION: GOLIATH | TAI | EJ | SPECIAL | NO ELE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/16cf32c79c9d04bc0efdc9a3ef7b01f8.png",
          }
      }
  })
}
if(command === "abominationsrampage") {
  message.channel.send({
      "embed": {
          title: 'ABOMINATIONS RAMPAGE | TAI | NORMAL | EJ | NO ELE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/0c55041a2637406bef69bfbed83ef0ad.png",
          }
      }
  })
}
if(command === "giantstrike") {
  message.channel.send({
      "embed": {
          title: 'MONKS ART: GIANT STRIKE | TAI | NORMAL | NO ELE | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/4803e71b1ace8194f464773dd7b062a5.png",
          }
      }
  })
}
if(command === "infernalgatestrike") {
  message.channel.send({
      "embed": {
          title: 'INFERNAL GATE STRIKE | SPECIAL | TAI | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2f238174de41ac550e63cb69e5414e1d.png",
          }
      }
  })
}
if(command === "fallingcomet") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: FALLING COMET | TAI | NORMAL | EJ | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f420ec4478d3bc7a7e53b7c862ca582b.png",
          }
      }
  })
}
if(command === "searingintimidation") {
  message.channel.send({
      "embed": {
          title: 'SEARING INTIMIDATION | TAI | NORMAL | EJ | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/c1a7450d8db17f89eca4a20bb5cd63b0.png",
          }
      }
  })
}
if(command === "onethousandflames") {
  message.channel.send({
      "embed": {
          title: 'ONE THOUSAND FLAMES | TAI | NORMAL | EJ | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2ca4277a4b74ea960ca9ddfe25920963.png",
          }
      }
  })
}
if(command === "flamewakedesecration") {
  message.channel.send({
      "embed": {
          title: 'FLAMEWAKE DESECRATION | BUKI | SPECIAL | EJ | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/1168a139e761e615fdcdc5b5d548daef.png",
          }
      }
  })
}
if(command === "flamebullet") {
  message.channel.send({
      "embed": {
          title: 'FLAME BULLET | BUKI | EJ | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/9de1ff0d27a22b536235906c37ff2a4f.png",
          }
      }
  })
}
if(command === "sunstorment") {
  message.channel.send({
      "embed": {
          title: 'SUNS TORMENT | BUKI | EJ | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/db46547a2bd53ade27c861f0ff36befe.png",
          }
      }
  })
}
if(command === "bombingrun") {
  message.channel.send({
      "embed": {
          title: 'BOMBING RUN | BUKI | NORMAL | FIRE | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/b7e96e6b96f93ee0ccfb35c14022656a.png",
          }
      }
  })
}
if(command === "impactavalanche") {
  message.channel.send({
      "embed": {
          title: 'IMPACT AVALANCHE | BUKI | SPECIAL | EARTH | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/6eeea21015e12305a239f1aa6c754ea7.png",
          }
      }
  })
}
if(command === "gaiasimpact") {
  message.channel.send({
      "embed": {
          title: 'GAIAS IMPACT | BUKI | NORMAL | EARTH | EJ | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/bc8b7d13a4364f00f25de89ab3cba342.png",
          }
      }
  })
}
if(command === "chainedrocks") {
  message.channel.send({
      "embed": {
          title: 'CHAINED ROCKS | BUKI | NORMAL | EARTH | EJ | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/75c2ceca84503df85b11d15a360cc74d.png",
          }
      }
  })
}
if(command === "rubblerumble") {
  message.channel.send({
      "embed": {
          title: 'RUBBLE RUMBLE | BUKI | EJ | NORMAL | EARTH | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/8c7e16b0e0fd8dd46091566e2f31f62f.png",
          }
      }
  })
}
if(command === "skydebris") {
  message.channel.send({
      "embed": {
          title: 'SKY DEBRIS | GENJUTSU | SPECIAL | EARTH | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/0dc81112528c572e86d90c1b2bb384d7.png",
          }
      }
  })
}
if(command === "tomboftheearthlord") {
  message.channel.send({
      "embed": {
          title: 'TOMB OF THE EARTH LORD | GENJUTSU | NORMAL | EARTH | EJ | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/8fd3e11da4cd7a455df9a120bca81176.png",
          }
      }
  })
}
if(command === "whisperingprison") {
  message.channel.send({
      "embed": {
          title: 'WHISPERING PRISON | GENJUTSU | NORMAL | EARTH | EJ | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/3e19d68168c574ef6801acb0d4f6d461.png",
          }
      }
  })
}
if(command === "sandsurprise") {
  message.channel.send({
      "embed": {
          title: 'SAND SURPRISE | GENJUTSU | NORMAL | EARTH | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/dc43742d916c49f175980e9469f27007.png",
          }
      }
  })
}
if(command === "forcebubble") {
  message.channel.send({
      "embed": {
          title: 'FORCE BUBBLE | NINJUTSU | SPECIAL | NO ELE | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/67032cd3fac19f0aa0dafae116e97b52.png",
          }
      }
  })
}
if(command === "voltaicfield") {
  message.channel.send({
      "embed": {
          title: 'AOE | SPEED | INTEL | LIGHTNING | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/312186898509d7627b6910b631517a3b.png",
          }
      }
  })
}
if(command === "lightningdragon") {
  message.channel.send({
      "embed": {
          title: 'LIGHTNING DRAGON | LIGHTNING | SPECIAL | DOT | INT + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/bd4e278af732a0274a91bc9eb6745835.png",
          }
      }
  })
}
if(command === "blindingstreak") {
  message.channel.send({
      "embed": {
          title: 'BLINDING STREAK | LIGHTNING | WILL + INT | NORMAL | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/e4bf46c21adbec89fa1409722cb2bbe7.png",
          }
      }
  })
}
if(command === "skyline") {
  message.channel.send({
      "embed": {
          title: 'SKYLINE | NORMAL | LIGHTNING | STR + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/9670d5bd77cfb18191528d77dda2f27e.png",
          }
      }
  })
}
if(command === "fieldsofpurgatory") {
  message.channel.send({
      "embed": {
          title: 'FIELDS OF PURGATORY | FIRE | SPEED + INT | AOE | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/f93e881c12944513d4b9b6cfb95f5ba2.png",
          }
      }
  })
}
if(command === "hellsfireball") {
  message.channel.send({
      "embed": {
          title: 'HELLS FIREBALL | FIRE |SPECIAL | INT + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/d6a0a62549f22d33b81bf310e46d99d5.png",
          }
      }
  })
}
if(command === "devilsplay") {
  message.channel.send({
      "embed": {
          title: 'DEVILS PLAY | FIRE | NORMAL | STR + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/db2c682dd507d1062b1586b293cc6f57.png",
          }
      }
  })
}
if(command === "helltube") {
  message.channel.send({
      "embed": {
          title: 'HELL TUBE | FIRE | NORMAL | WILL + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/9c04debdb7ccd3af0368a5924a81d5d3.png",
          }
      }
  })
}
if(command === "darkworld") {
  message.channel.send({
      "embed": {
          title: 'DARK WORLD | NO ELE | FORBIDDEN | INT + INT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/e7d94c863f19a8216c6236c41130afc5.png",
          }
      }
  })
}
if(command === "divinelightblast") {
  message.channel.send({
      "embed": {
          title: 'DIVINE LIGHTBLAST | BLOODLINE | LIGHT | IF YOU HAVE MORE DATA @MHYR#5240',
          "image": {
            "url": "https://i.gyazo.com/0255ffdaf464e3194d5b9fead044de47.png",
          }
      }
  })
}
if(command === "chakraburstdome") {
  message.channel.send({
      "embed": {
          title: 'CHAKRA BURST DOME | NIN | NORMAL | NO ELE | EJ | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/c6112a98744a6c671dd2411866edc9b1.png",
          }
      }
  })
}
if(command === "shadowofsin") {
  message.channel.send({
      "embed": {
          title: 'SHADOW OF SIN | NIN | NORMAL | NO ELE | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/698488b9c6a7918d92ea16042025b20a.png",
          }
      }
  })
}
if(command === "snareoftempest") {
  message.channel.send({
      "embed": {
          title: 'SNARE OF TEMPEST | BUKI | BLOODLINE | TEMPEST | EJ | 7 USES',
          "image": {
            "url": "https://puu.sh/AbCeC/ae54c74a14.png",
          }
      }
  })
}
if(command === "map") {
  message.channel.send({
      "embed": {
          title: 'map',
          "image": {
            "url": "https://i.gyazo.com/f96f49a1846947062c19b19b6f342d5e.png",
          }
      }
  })
}
if(command === "ramen") {
  message.channel.send({
      "embed": {
          title: 'ramen shops',
          "image": {
            "url": "https://i.gyazo.com/f7872ddc0f434a0b3faafd769641af7e.png",
          }
      }
  })
}
if(command === "em") {
  message.channel.send({
      "embed": {
          title: 'Elemental Locations',
          "image": {
            "url": "https://i.gyazo.com/dd5b23f3cd46068ef0174c513b3789eb.png",
          }
      }
  })
}
if(command === "occupations") {
  message.channel.send({
      "embed": {
          title: 'List of occupations',
          "image": {
            "url": "https://i.gyazo.com/8d8305f952f70b6b995a7114d2ff0fee.png",
          }
      }
  })
}
if(command === "penalty") {
  message.channel.send({
      "embed": {
          title: 'List of known penalties',
          "image": {
            "url": "https://i.gyazo.com/df5fa5e1656b0897fa68c8304eaf1deb.png",
          }
      }
  })
}
if(command === "daily") {
  message.channel.send({
      "embed": {
          title: 'Daily globals',
          "image": {
            "url": "https://i.gyazo.com/fe179fc5944a59103d70fc8e48b9ad0a.png",
          }
      }
  })
}
if(command === "greatwhite") {
  message.channel.send({
      "embed": {
          title: 'DEEPSEARELEASE: GREATWHITE | TAI | JOUNIN | BLOODLINE | WATER | 7 USES',
          "image": {
            "url": "https://puu.sh/AbDck/3670eac6a6.png",
          }
      }
  })
}
if(command === "eruptinglightning") {
  message.channel.send({
      "embed": {
          title: 'ERUPTING LIGHTNING | GENJ | SPECIAL | LIGHTNING | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2d3dcfcaf179ffe095a6c7291c21643d.png",
          }
      }
  })
}
if(command === "statichalt") {
  message.channel.send({
      "embed": {
          title: 'STATIC HALT | GENJ | NORMAL | LIGHTNING | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/579c8710efd757b8da07c866c067d75a.png",
          }
      }
  })
}
if(command === "ringoftorment") {
  message.channel.send({
      "embed": {
          title: 'RING OF TORMENT | GENJ | NORMAL | LIGHTNING | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/db636cfcfa08ca5057128d00e5b489c0.png",
          }
      }
  })
}
if(command === "innerspark") {
  message.channel.send({
      "embed": {
          title: 'INNER SPARK | GENJ | NORMAL | LIGHTNING | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2e8b77fc0f531d4edd08a88a371c2e18.png",
          }
      }
  })
}
if(command === "demontorment") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: DEMON TORRENT | TAI | JOUNIN | NORMAL | WATER | 8 USES',
          "image": {
            "url": "https://puu.sh/AbDhr/889e9cf505.png",
          }
      }
  })
}
if(command === "mistdance") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: MIST DANCE | TAI | JOUNIN | NORMAL | WATER | 8 USES',
          "image": {
            "url": "https://puu.sh/AbDjc/e092ac4554.png",
          }
      }
  })
}
if(command === "abyssalcoils") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: ABYSSAL COILS | TAI | JOUNIN | SPECIAL | WATER | 5 USES',
          "image": {
            "url": "https://puu.sh/AbDl6/7cb6a8079a.png",
          }
      }
  })
}
if(command === "hydroclone") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: HYDRO CLONE | TAI | JOUNIN | NORMAL | WATER | 5 USES',
          "image": {
            "url": "https://puu.sh/AbDn0/4c0bf539d3.png",
          }
      }
  })
}
if(command === "highriseyoyo") {
  message.channel.send({
      "embed": {
          title: 'HIGHRISE YO-YO | GENJ | SPECIAL | WIND | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/0bdea5520e32619463c65357cec69b30.png",
          }
      }
  })
}
if(command === "shatterblade") {
  message.channel.send({
      "embed": {
          title: 'SHATTERBLADE | GENJ | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f8e6ed64d79be3698c13e046dae6d421.png",
          }
      }
  })
}
if(command === "crimsonwindlord") {
  message.channel.send({
      "embed": {
          title: 'CRIMSON WINDLORD | GENJUTSU | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/606478724e851c708580611b2e43d4d8.png",
          }
      }
  })
}
if(command === "whistlingdistortion") {
  message.channel.send({
      "embed": {
          title: 'WHISTLING DISTORTION | GENJ | NORMAL | WIND | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/bf649369b462799eccc2aeb8420d1550.png",
          }
      }
  })
}
if(command === "roogen") {
  message.channel.send({
      "embed": {
          title: 'uh',
          "image": {
            "url": "https://i.gyazo.com/fd04c3328bb2c6187229b826e2c4e699.png",
          }
      }
  })
}
if(command === "vortexblade") {
  message.channel.send({
      "embed": {
          title: 'VORTEX BLADE | BUKI | SPECIAL | WIND | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2e2f69caec34255881ea06155a96f6a0.png",
          }
      }
  })
}
if(command === "arcwind") {
  message.channel.send({
      "embed": {
          title: 'ARC WIND | BUKI | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/dea3b22d976bd8d77bfe877a45e7e772.png",
          }
      }
  })
}
if(command === "windstep") {
  message.channel.send({
      "embed": {
          title: 'WIND STEP | BUKI | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/7cbc09d48111ef76b50073287c055be4.png",
          }
      }
  })
}
if(command === "starwindwall") {
  message.channel.send({
      "embed": {
          title: 'STAR WIND WALL | BUKI | NORMAL | WIND | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/8b389235001234ae25270d848b7cb83e.png",
          }
      }
  })
}
if(command === "rollingthunder") {
  message.channel.send({
      "embed": {
          title: 'ROLLING THUNDER | BUKI | SPECIAL | LIGHTNING | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/2ffe03271526166d6e8d50c97b5cb589.png",
          }
      }
  })
}
if(command === "electroblade") {
  message.channel.send({
      "embed": {
          title: 'ELECTROBLADE | WEAPON | NORMAL | LIGHTNING | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/c7ae83909f67c67433d0d967571a799a.png",
          }
      }
  })
}
if(command === "circlecrash") {
  message.channel.send({
      "embed": {
          title: 'CIRCLE CRASH | BUKI | NORMAL | LIGHTNING | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/a41719b2d9dfdd30c1e2549ae89f3eab.png",
          }
      }
  })
}
if(command === "staticrain") {
  message.channel.send({
      "embed": {
          title: 'STATIC RAIN | BUKI | NORMAL | LIGHTNING | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/a70d8e4426da39e7e14a3eea2e9954b7.png",
          }
      }
  })
}
if(command === "reboundbolt") {
  message.channel.send({
      "embed": {
          title: 'REBOUND BOLT | TAI | LIGHTNING | NORMAL | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/dd9d27d67f2f4214c368300d24364077.png",
          }
      }
  })
}
if(command === "lightningbelt") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: LIGHTNING BELT | TAI | NORMAL | LIGHTNING | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/98813a32a79201af0190f9a7d8164a1a.png",
          }
      }
  })
}
if(command === "thunderclap") {
  message.channel.send({
      "embed": {
          title: 'THUNDER CLAP | TAI | JOUNIN | NORMAL | LIGHTNING | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f8561e98af22ab5576f0138a290f31ac.png",
          }
      }
  })
}
if(command === "electricruin") {
  message.channel.send({
      "embed": {
          title: 'ELECTRIC RUIN | TAI | JOUNIN | SPECIAL | LIGHTNING 5 USES',
          "image": {
            "url": "https://i.gyazo.com/fa1f5f1ee80984dafbef1e98e7af55a6.png",
          }
      }
  })
}
if(command === "rapidfisttechnique") {
  message.channel.send({
      "embed": {
          title: 'RAPID FIST TECHNIQUE | TAI | JOUNIN | SPECIAL | NON ELE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/3035fb3d9b50a680a105f9274965ec5c.png",
          }
      }
  })
}
if(command === "unbalancingblow") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: UNBALANCING BLOW | TAI | JOUNIN | NORMAL | WIND | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/6597c178e4372d6c53a6f74ebb0d2c37.png",
          }
      }
  })
}
if(command === "shockwavebombardment") {
  message.channel.send({
      "embed": {
          title: 'SHOCKWAVE BOMBARDMENT | TAI | JOUNIN | NORMAL | WIND | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/63596e5b008e211f7deadf685a5e3f24.png",
          }
      }
  })
}
if(command === "slipstreamtristep") {
  message.channel.send({
      "embed": {
          title: 'SLIPSTREAM TRISTEP | TAI | JOUNIN | NORMAL | WIND | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/fd6595a7586fa472fc165c3acd594bd5.png",
          }
      }
  })
}
if(command === "typhoondisk") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: TYPHOON DISK | TAI | JOUNIN | SPECIAL | WIND | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/17e52ef0da1247bcd084927a14f7faca.png",
          }
      }
  })
}
if(command === "stormsurgevortex") {
  message.channel.send({
      "embed": {
          title: 'STORM SURGE VORTEX | TAI | JOUNIN | BLOODLINE | WIND | 7 USES',
          "image": {
            "url": "https://i.gyazo.com/0ba4aebae08da8005458618f440387ce.png",
          }
      }
  })
}
if(command === "sereneassault") {
  message.channel.send({
      "embed": {
          title: 'MONKS ART: SERENE ASSAULT | TAI | JOUNIN | NORMAL | NON ELE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/d15edd28db6209d4f6373010cc1d5d04.png",
          }
      }
  })
}
if(command === "ragingbear") {
  message.channel.send({
      "embed": {
          title: 'GATE STRIKE: RAGING BEAR | TAI | JOUNIN | NORMAL | NON ELE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/6e44cd4044459b2dffe7e16384413be6.png",
          }
      }
  })
}
if(command === "smokebombcombo") {
  message.channel.send({
      "embed": {
          title: 'SMOKE BOMB COMBO | TAI | JOUNIN | NORMAL | NON ELE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/64301fefd2475d5beed9320f2c8cec3d.png",
          }
      }
  })
}
if(command === "doubledragon") {
  message.channel.send({
      "embed": {
          title: 'DOUBLE DRAGON | TAI | JOUNIN | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/0968701aa1c4d0994a1f88be1e537374.png",
          }
      }
  })
}
if(command === "shootingstar") {
  message.channel.send({
      "embed": {
          title: 'SHOOTING STAR | TAI | JOUNIN | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/56ff0ec76c7083fc1bfc424a58193d8d.png",
          }
      }
  })
}
if(command === "explosivebarrage") {
  message.channel.send({
      "embed": {
          title: 'EXPLOSIVE BARRAGE | TAI | JOUNIN | NORMAL | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/69767e28b4a534b3a9e6d60e7f20bba2.png",
          }
      }
  })
}
if(command === "sunarc") {
  message.channel.send({
      "embed": {
          title: 'SUN ARC | TAI | JOUNIN | SPECIAL | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/40f97bab7119f145acb179178ed1371c.png",
          }
      }
  })
}
if(command === "quintessentialflow") {
  message.channel.send({
      "embed": {
          title: 'QUINTESSENTIAL FLOW | BUKI | BLOODLINE | ICE | EJ | 7 USES',
          "image": {
            "url": "https://i.gyazo.com/e8a7c48f9875b9cb2b36fa677b52b8d4.png",
          }
      }
  })
}
if(command === "singularitysquall") {
  message.channel.send({
      "embed": {
          title: 'SINGULARITYSQUALL | BUKI | BLOODLINE | TEMPEST | JOUNIN | 7 USES',
          "image": {
            "url": "https://i.gyazo.com/8b39537caf7fa3676f027df713116d07.png",
          }
      }
  })
}
if(command === "shurikenrain") {
  message.channel.send({
      "embed": {
          title: 'SHURIKEN RAIN | BUKI | JOUNIN | NORMAL | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/542491c34fab987bf8fe8f47e831c0cc.png",
          }
      }
  })
}
if(command === "firestar") {
  message.channel.send({
      "embed": {
          title: 'FIRE STAR | BUKI | JOUNIN | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/a5072c62d1896f0e785b1e59005952bd.png",
          }
      }
  })
}
if(command === "blazingdeathstar") {
  message.channel.send({
      "embed": {
          title: 'BLAZING DEATH STAR | BUKI | JOUNIN | NORMAL | FIRE | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/bd88ff5f93832f5648386df9baa75770.png",
          }
      }
  })
}
if(command === "sunfirearc") {
  message.channel.send({
      "embed": {
          title: 'SUNFIRE ARC | BUKI | JOUNIN | SPECIAL | FIRE | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/d3751bc8cd75e832409066f44fc19960.png",
          }
      }
  })
}
if(command === "infernalmayhem") {
  message.channel.send({
      "embed": {
          title: 'INFERNAL MAYHEM | BUKI | JOUNIN | BLOODLINE | FIRE | 7 USES',
          "image": {
            "url": "https://i.gyazo.com/61471a9811ae5c66709f1db972d5dbcc.png",
          }
      }
  })
}
if(command === "bladesclarity") {
  message.channel.send({
      "embed": {
          title: 'BLADES CLARITY | BUKI | JOUNIN | NORMAL | WATER 8 USES',
          "image": {
            "url": "https://i.gyazo.com/c3adc4a35c1ad69bacc17f0248971d25.png",
          }
      }
  })
}
if(command === "lanceofthebluedragon") {
  message.channel.send({
      "embed": {
          title: 'LANCE OF THE BLUE DRAGON | BUKI | JOUNIN | SPECIAL | WATER | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/c1d68410ca9bfedbf8c1529abced8fc7.png",
          }
      }
  })
}
if(command === "hydrostep") {
  message.channel.send({
      "embed": {
          title: 'HYDRO STEP | BUKI | JOUNIN | NORMAL | WATER | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/ee35a21d6fa27a0d2baa186b7c8fcf6f.png",
          }
      }
  })
}
if(command === "torrent") {
  message.channel.send({
      "embed": {
          title: 'TORRENT | BUKI | JOUNIN | NORMAL | WATER | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/cbd8053cf70781737995e6da1ec90077.png",
          }
      }
  })
}
if(command === "hydroclone") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: HYDRO CLONE | TAI | NORMAL | WATER | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/e174e7d01eb80ac1c3182ca1a853ea0f.png",
          }
      }
  })
}
if(command === "demon") {
  message.channel.send({
      "embed": {
          title: 'PALM STYLE: DEMON | TAI | NORMAL | WATER | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f80c73b317df92efe55f7eba6c6fe6fb.png",
          }
      }
  })
}
if(command === "oceansform") {
  message.channel.send({
      "embed": {
          title: 'OCEANS FORM | GENJ | SPECIAL | WATER | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/cda734cc9f4cd322db837bd48deaa074.png",
          }
      }
  })
}
if(command === "aggressivearmor") {
  message.channel.send({
      "embed": {
          title: 'AGGRESSIVE ARMOR | GENJ | NORMAL | WATER | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/4d6b380ea784594863607e2ba49049fb.png",
          }
      }
  })
}
if(command === "aquablood") {
  message.channel.send({
      "embed": {
          title: 'AQUA BLOOD | GENJ | NORMAL | WATER | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/e33428e7019fa5f21ceb47d8d8cb86e3.png",
          }
      }
  })
}
if(command === "sanguinecocoon") {
  message.channel.send({
      "embed": {
          title: 'SANGUINE COCOON | GENJ | NORMAL | WATER | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/d72550ca173cf9bedcf2ee61356e6dcf.png",
          }
      }
  })
}
if(command === "darkstormcrush") {
  message.channel.send({
      "embed": {
          title: 'DARK STORM CRUSH | GENJ | BLOODLINE (SD) | STORM | JOUNIN | 7 USES',
          "image": {
            "url": "https://i.gyazo.com/babf5ac02dd5903e5aad113045433896.png",
          }
      }
  })
}
if(command === "greatlightningdragon") {
  message.channel.send({
      "embed": {
          title: 'GREAT LIGHTNING DRAGON | NINJ | SPECIAL | LIGHTNING | EJ | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/296724f20ea15d1eac049f26eb0383e5.png",
          }
      }
  })
}
if(command === "aquajelly") {
  message.channel.send({
      "embed": {
          title: 'AQUA JELLY | NINJ | NORMAL | WATER | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/39585a5fd3a439b8d4331c13da10699f.png",
          }
      }
  })
}
if(command === "graspinghaze") {
  message.channel.send({
      "embed": {
          title: 'GRASPING HAZE | NINJ | NORMAL | WATER | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/f8ff80c5cc3c15608cea724ed4626cbb.png",
          }
      }
  })
}
if(command === "hydroring") {
  message.channel.send({
      "embed": {
          title: 'HYDRO RING | NINJ | NORMAL | WATER | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/6be4ace6b944832744569b34ba4ee25c.png",
          }
      }
  })
}
if(command === "eruptinggeyser") {
  message.channel.send({
      "embed": {
          title: 'ERUPTING GEYSER | NINJ | SPECIAL | WATER | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/91b3a2433c524b444d4586a467b2ad2c.png",
          }
      }
  })
}
if(command === "acidiccloud") {
  message.channel.send({
      "embed": {
          title: 'ACIDIC CLOUD | NINJ | NORMAL | WIND | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/77674784d6ccff1af035108cf443a7a3.png",
          }
      }
  })
}
if(command === "dazingwinds") {
  message.channel.send({
      "embed": {
          title: 'DAZING WINDS | NINJ | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/1e84b5382fd385df6d80a94b0377b4b7.png",
          }
      }
  })
}
if(command === "eyeofthestorm") {
  message.channel.send({
      "embed": {
          title: 'EYE OF THE STORM | NINJ | NORMAL | WIND | JOUNIN | 8 USES',
          "image": {
            "url": "https://i.gyazo.com/2930925805b09a87248373fcd4bffb95.png",
          }
      }
  })
}
if(command === "vacuumwave") {
  message.channel.send({
      "embed": {
          title: 'VACUUM WAVE | NINJ | SPECIAL | WIND | JOUNIN | 5 USES',
          "image": {
            "url": "https://i.gyazo.com/eb24596e0b0a1cc3725537ffd7938f00.png",
          }
      }
  })
}
if(command === "obsidianpath") {
  message.channel.send({
      "embed": {
          title: 'OBSIDIAN PATH | HIGHEST | LOYALTY | NO ELE | JOUNIN | 3 USES',
          "image": {
            "url": "https://i.gyazo.com/0d8b3b7d9b2c04f89766a3276f9976dd.png",
          }
      }
  })
}
if(command === "innerlight") {
  message.channel.send({
      "embed": {
          title: 'INNER LIGHT | HIGHEST | LOYALTY | NO ELE | CHU | 1 USE',
          "image": {
            "url": "https://i.gyazo.com/6221e6117a5cc5c0b106d9cc052f3f17.png",
          }
      }
  })
}
if(command === "kingsnatchergambit") {
  message.channel.send({
      "embed": {
          title: 'KINGSNATCHER GAMBIT | HIGHEST | LOYALTY | NO ELE | JOUNIN | 3 USES',
          "image": {
            "url": "https://i.gyazo.com/27ded26233ebd241f8d33ebf9588554b.png",
          }
      }
  })
}
if(command === "swiftstepstance") {
  message.channel.send({
      "embed": {
          title: 'SWIFTSTEP STANCE | HIGHEST | LOYALTY-SILENCE | NO ELE | 3 USES',
          "image": {
            "url": "https://i.gyazo.com/1bbbd275430b66022e37d21a06343dc7.png",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}
if(command === "") {
  message.channel.send({
      "embed": {
          title: '',
          "image": {
            "url": "",
          }
      }
  })
}


if(command === "febl") {
  message.channel.send("FROSTBLADE EXECUTIONER BLOODLINE JUTSUS \nEJ: QUINTESSENTIAL FLOW: !quintessentialflow");
}
if(command === "shbl") {
  message.channel.send("SAVAGE HURRICANE BLOODLINE JUTSUS \nEJ: SNARE OF TEMPEST: !snareoftempest \nJOUNIN: SINGULARITY SQUALL: !singularitysquall");
}
 if(command === "donate") {
  message.channel.send("hit up Temper in game with dat ryo");
}
  if(command === "help") {
  message.channel.send("type bloodline names as they are without spaces. e.g. !needletwister \nJutsu that have symbols in their name type them without. \nJutsu names that include a prefix e.g. Gate Strike: Raging Bear will have the Gate Strike: prefix removed. Try !ragingbear instead. \nSome misc commands include: !itemname !map !ramen !em !beta !bloodlinename !raidername");
}
  if(command === "ir") {
  message.channel.send("INFERNAL REAPER \nAFFINITY: FIRE \nOFFENSE: HIGHEST \nINCREASED OFFENSE DAMAGE DEALT \nPARTLY ABSORBS FIRE DAMAGE TAKEN \nINCREASED FIRE DAMAGE DEALT \nINCREASED WATER DAMAGE TAKEN");
}
  if(command === "gameon") {
  message.channel.send("16.9 | 12.8 | 13.11");
}
if(command === "vaakum") {
message.channel.send("PATTERN OF AKUM VS VAPORIA \nROUND 1: DESERT ART ENTOMBMENT \nROUND 2: HAILSTONE \nROUND 3: WIND STEP \nROUND 4: ARC WIND \nROUND 5: HAILSTONE \nROUND 6: DESERT ART ENTOMBMENT \nROUND 7: WIND STEP \nROUND 8: HAILSTONE \n ROUND 9: ARC WIND \nROUND 10: DESERT ART ENTOMBMENT \nROUND 11: WIND STEP \nROUND 12: HAILSTONE \nROUND 13: ARC WIND \nROUND 14: VORTEX BLADE \nData recorded by Renegade Sound - Taijutsu | Vaporia | Water/Fire/Steam");
}
if(command === "va") {
message.channel.send("VAPORIA | HIGHEST OFFENCE (PROBABLY TAI) \nELEMENTS: WATER/FIRE/STEAM \nINCREASED OFFENCE DAMAGE DEALT \nINCREASED WATER/FIRE/STEAM DAMAGE DEALT \nINCREASED WATER/EARTH/WOOD DAMAGE TAKEN");
}
if(command === "sh") {
message.channel.send("SAVAGE HURRICANE | BUKIJUTSU \nELEMENTS: WIND/LIGHTNING/TEMPEST \nINCREASED WEAPON DAMAGE DEALT \nINCREASED WIND/LIGHTNING/TEMPEST DAMAGE DEALT \nDECREASED STAMINA USED FOR WEAPON JUTSU \nINCREASED FIRE/WIND/SCORCHING DAMAGE TAKEN");
}
if(command === "ss") {
message.channel.send("SOLAR SOUL | NINJUTSU \nELEMENTS: FIRE/LIGHTNING/LIGHT \nINCREASED NINJUTSUS DAMAGE DEALT \nINCREASED FIRE/LIGHTNING/LIGHT DAMAGE DEALT \nINCREASED WATER/WIND/ICE DAMAGE TAKEN");
}
if(command === "vip") {
message.channel.send("CURRENT LIST OF HIGHEST DONATORS LOVE YA \nBLINK: 20000000 \nKHIONE: 10000000 \nYOU'RE THE BEST | LOTS OF LOVE | TEMPER");
}
if(command === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}
if(command === "devhost") {
message.channel.send("heroku");
}
if (message.content.startsWith('!8ball')) {
    if ( message.content.endsWith('?')) {
      var answers = [
      '8ball: Maybe.', '8ball: Lol no.', '8ball: I really hope so.', '8ball: Not in your wildest dreams.',
      '8ball: There is a good chance.', '8ball: Quite likely.', '8ball: I think so.', '8ball: I hope not.',
      '8ball: I hope so.', '8ball: Never!', '8ball: NOOPE!', '8ball: Ahaha! Really?!?', '8ball: Pfft.',
      '8ball: Sorry, no.', '8ball: yeaaa.', '8ball: Hell to the no.', '8ball: ehhhhhh, i dont know.',
      '8ball: The future is uncertain.', '8ball: I would rather not say.', '8ball: Who cares?',
      '8ball: Possibly.', '8ball: Never, ever, ever.', '8ball: There is a small chance.', '8ball: Yes!'];
      var answer = answers[Math.floor(Math.random() * answers.length)];
    } else {
      message.channel.sendMessage('That is not a valid question. Please add at your question "?"')
    }
  message.channel.sendMessage(answer);
}

   if (command === "flip") {
    	var result = Math.floor((Math.random() * 2) + 1);
    	if (result == 1) {
    		message.channel.send("The coin landed on heads");
    	} else if (result == 2) {
    		message.channel.send("The coin landed on tails");
    	}
}
if (command === "roll") {
  var result = Math.floor((Math.random() * 100) + 1);
  message.channel.send("You rolled a: " + result);
}
if(command === "temper") {
message.channel.send("My mama. If you're looking for the Queen of Shroud that'd be !baelin.");
}
if(command === "baelin") {
message.channel.send("THE QUEEN OF SHROUD | GOD SAVE THE QUEEN");
}
if(command === "info") {
  const embed = new Discord.RichEmbed()
  .setTitle("RaidBot v1.3")
  .addField("Created by:", "Temper | @Mhyr#5240")
  .addField("Developed in:", "Node.js")
  .addField("Uptime:", + "ms");
  message.channel.send({embed});
}
if(command  === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}
if(command === "") {
message.channel.send("");
}


});
client.login(process.env.BOT_TOKEN);

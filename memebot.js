var Discord = require("discord.js");
var bot = new Discord.Client();
var request = require('request');

var jsonfile = require('jsonfile');
var util = require('util');
var users = "";

//All message inputs (very generic)
var message = {
	info: "Memebot69 commands are: .help, .spin <Bet Amount>, .coins, .top, and .cowpies. To spin the slot machine, type .spin ###. Replace the ### with your bet ammount",
	error: "Error encounted, please contact Pakoola.",
	activeUser: "Already an active user.",
	addedToDatabase: "You have been added to the database.",
	spam: "FUCKING NORMIES, GET OFF OF MY FUCKING BOARD!!!!!@@!@!@",
	cowpies1: "http://i.imgur.com/tY1Ij8w.jpg",
	cowpies2: "",
	shrug: "¯\_(ツ)_/¯"
};

/*
//UPDATE THESE FIELDS WHEN CHANGING SERVERS
//Windows file paths
var timeFile = 'root/JUSTIN/memebot/timestamp.json';
var userInformation = 'C:/Users/Justin/Dropbox/memebot/memebotUser.json';
//Linux File paths
var file = '/home/justin/discordBot/users.json';
*/

var username = "";
var password = "";
jsonfile.readFile(userInformation, function(err, userData) {
	username = userData.email;
	password = userData.password;
});

bot.login(username, password);

//when the bot is ready
bot.on("ready", function() {
	console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

//when the bot disconnects
bot.on("disconnected", () => {
	console.log("Disconnected, exiting!");
	process.exit();
});

//*******************************************
//	Main process handling 
//	Bot will take the message and check ifs
//*******************************************
bot.on("message", function(msg) {
	var sender = msg.author.username;
	var server = getServerByNameWithMessage(msg, "thef00fRaidcallRIP");
	var channel = getChannelByUserMessageAuthorString(msg, msg.content.substr(6));
	var timestamp = new Date();

	if (msg.content.indexOf(".help") === 0) {
		bot.sendMessage(msg, message.info);
	}

	if (msg.content.indexOf(".cowpies") === 0) {
		bot.sendMessage(msg, message.cowpies1);
	}
	if (msg.content.indexOf(".addme") === 0) {
		jsonfile.readFile(file, function(err, obj) {
			var userObj = obj;
			var allUsers = new Array();
			for (var i = 0; i < obj.length; i++) {
				allUsers.push(userObj[i].name);
			}

			if (allUsers.indexOf(sender) == -1) {
				userObj.push({
					"name": sender,
					"coins": 10,
					"time": d
				});
				jsonfile.writeFile(file, userObj, function(err) {
					if(err){
						console.error(err);
					}
				})
				bot.reply(msg, message.addedToDatabase);
				console.log("Added " + sender + " to the user.json file. " + timestamp);
			} else if (allUsers.indexOf(sender) != -1) {
				bot.reply(msg, message.activeUser);
			}
			bot.deleteMessage(msg);
		})
	}

	if (msg.content.indexOf(".top") === 0) {
		jsonfile.readFile(file, function(err, obj) {
			var curCoins = 0;
			var leaderCoins = 0;
			var leaderName = "";
			var max1 = 0;
			var max2 = 0;
			var max3 = 0;
			var max1Name = "";
			var max2Name = "";
			var max3Name = "";

			if (err) {
				console.log(err);
			} else {
				for (var i = 0; i < obj.length; i++) {
					if (obj[i].coins > max1) {
						max3 = max2;
						max2 = max1;
						max1 = obj[i].coins;
						max3Name = max2Name;
						max2Name = max1Name;
						max1Name = obj[i].name;
					} else if (obj[i].coins > max2) {
						max3 = max2;
						max2 = obj[i].coins;
						max3Name = max2Name;
						max2Name = obj[i].name;
					} else if (obj[i].coins > max3) {
						max3 = obj[i].coins;
						max3Name = obj[i].name;
					}
				}
				bot.deleteMessage(msg);
				bot.sendMessage(msg, "Top 3: 1st:" + max1Name + " - " + max1 + "  2nd: " + max2Name + " - " + max2 + "  3nd: " + max3Name + " - " + max3);
			}
		})
	}

	if (msg.content.indexOf(".coins") === 0) {
		var usersCoins = getCurrentUserCoins(sender);
		bot.deleteMessage(msg);
		bot.reply(msg, usersCoins);
	}

	if (msg.content.indexOf(".spin") === 0) {
		var msgSplit = msg.split(" ");
		var bet = parseInt(msgSplit[1]);
		var betValidNum = !isNaN(bet);
		var num1 = Math.floor((Math.random() * 10) + 1);
		var num2 = Math.floor((Math.random() * 10) + 1);
		var num3 = Math.floor((Math.random() * 10) + 1);
		var machine_stuck = Math.floor((Math.random() * 1000) + 1);

		jsonfile.readFile(file, function(err, obj) {
			if (err) {
				console.log(err);
			} else {
				if ((bet > 0) && (betValidNum)) {
					var users = obj;
					var inDataBase = false;
					var arrayLength = users.length;
					var msgString = "";

					for (var i = 0; i < arrayLength; i++) {
						if (users[i].name == sender) {
							inDataBase = true;
							bot.sendMessage(msg, "| " + num1 + " | " + " | " + num2 + " | " + " | " + num3 + " |");

							//Logic for all 3 similar numbers
							if (num1 == num2 && num1 == num3 && num2 == num3) {
								if (num1 == 6 && num2 == 6 && num3 == 6) {
									users[i].coins = 0;
									msgString += "FUCKA YOU!! Lose all coins. ";
									console.log(users[i].name + " has lost all of their coins. ");
								} else if (num1 == 7 && num2 == 7 && num3 == 7) {
									msgString += "JACKPOT! You have gained 15 coins! ";
									console.log(sender + " hit jackpot! " + timestamp);
								} else {
									users[i].coins += 7;
									msgString += "3 of a kind! You have gained 7 coins! ";
								}
							} else if (num1 == num2 || num1 == num3 || num2 == num3) {
								users[i].coins += 5;
								msgString += "Two of a kind! You have gained 5 coins. ";
							} else {
								if (machine_stuck == 1) {
									msgString += "Slot machine has malfunctioned in your favor..Gain 50 coins!!! ";
									users[i].coins += 50;
									console.log(users[i].name + ' broke the slot machine and has gained 50 coins. ' + timestamp);
								} else {
									users[i].coins -= 1;
									msgString += "You lose 1 coin. ";
								}
							}
							msgString += 'Coins left: ' + users[i].coins;

							if (users[i].coins == 0) {
								msgString += users[i].coins + ' coins left. Slut, stop using all of your coins... ';
								users[i].coins += 10;
							}
						}
					}
					if (!inDataBase) {
						bot.reply(msg, "Please type .addme to add youself to the database.");
					}
					if ((msgString != "" || msgString != null) && inDataBase) {
						bot.deleteMessage(msg);
						bot.reply(msg, msgString);
					}
				} else {
					bot.reply(msg, "Please enter a valid number with this format: .spin <bet ammount>. For additional help, please type .help");
					console.log(sender + " entered an incorrect entry of " + bet.toString() +" " + timestamp);
				}
			}
			var record = users;
			jsonfile.writeFile(file, record, function(err) {
				console.error(err)
			})
		})
	}
});


//**Kyle's Bot Logic for finding users**
//--------------------------------------

var getChannelByUserMessageAuthorString = function(message, name) {
	var channel = null;
	channel = findUserByName(message, name);
	if (channel) {
		channel = channel.voiceChannel;
	} else {
		channel = getServerChannelByName(getServerByNameWithMessage(message, "thef00fRaidcallRIP"), name);
		if (!channel) {
			channel = message.author.voiceChannel;
		}
	}
	return channel;
}

var getServerByNameWithMessage = function(message, name) {
	var server = null;
	var servers = message.client.servers;
	for (var i = 0; i < servers.length; i++) {
		if (servers[i].name === name) {
			server = servers[i];
		}
	}
	return server;
}

var getServerByNameWithBot = function(bot, name) {
	var server = null;
	var servers = bot.servers;
	for (var i = 0; i < servers.length; i++) {
		if (servers[i].name === name) {
			server = servers[i];
		}
	}
	return server;
}

var findUserByName = function(message, name) {
	var server = getServerByNameWithMessage(message, "thef00fRaidcallRIP");
	var members = server.members;
	var user = null;

	for (var i = 0; i < members.length; i++) {
		if (members[i].username.toUpperCase() === name.toUpperCase()) {
			user = members[i];
		}
	}
	return user;
}

var getServerChannelByName = function(server, name) {
	var channels = server.channels;
	var channel = null;

	for (var i = 0; i < channels.length; i++) {
		if (channels[i].name === name) {
			channel = channels[i];
		}
	}
	return channel;
}

//Gets the current users coins
function getCurrentUserCoins(sender) {
	var msg = "";
	jsonfile.readFile(file, function(err, obj) {
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].name === sender) {
				if (obj[i].coins === 0) {
					msg = "You have no coins!";
				} else {
					msg = 'You have: ' + obj[i].coins + " coins left.";
				}
			}
		}
	})
	return msg;
}

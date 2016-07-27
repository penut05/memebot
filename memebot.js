//tail -2222f /var/log/node.log
//7:53 PMcowpiesstart memebot
//7:53 PMcowpiesstop memebot
//ssh -p 56789 root@98.193.17.63

var Discord = require("discord.js");
var bot = new Discord.Client();
var request = require('request');

var jsonfile = require('jsonfile')
var util = require('util')
var users = "";

var file = 'root/JUSTIN/memebot/users.json';
var timeFile = 'root/JUSTIN/memebot/timestamp.json';

//when the bot is ready
bot.on("ready", function () {
	//console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

//when the bot disconnects
bot.on("disconnected", () => {
	console.log("Disconnected, exiting!");
	process.exit();
});

//*******************************************
//when the bot receives a message
bot.on("message", function (msg) {
	var sender = msg.author.username;
	var server = getServerByNameWithMessage(msg, "thef00fRaidcallRIP");
	var channel = getChannelByUserMessageAuthorString(msg,msg.content.substr(6));
	
	/*
	if (msg.content.indexOf("") === 0) {
		request.post({
			url: "http://98.193.17.63:3000/discordbotinterface/voice", 
			json:{
				channel_id: channel.id,
				server_id: server.id, 
				file_name: "Blahh.mp3"
			}
		});
	}
		//File Names: allahuakbar.mp3
		//anotherone.mp3
	*/
	
	if (msg.content.indexOf(".info") === 0) {
		bot.sendMessage(msg, 'Memebot69 commands are: .help, .spin, .coins, .top, and .cowpies');
	}
	
	if(msg.content.indexOf(".cowpies") === 0){
		bot.sendMessage(msg, 'http://i.imgur.com/tY1Ij8w.jpg');
	}
	if (msg.content.indexOf(".addme") === 0) {
		jsonfile.readFile(file, function(err, obj) {
			var userObj = obj;
			var allUsers = new Array();
			for(var i=0;i<obj.length;i++){
				allUsers.push(userObj[i].name);
			}

			if(allUsers.indexOf(sender) == -1){
				userObj.push({"name": sender,"coins":10,"time":d});
				jsonfile.writeFile(file, userObj, function (err) {
					//console.error(err)
				})
				bot.reply(msg, "You have been added to the database.");
			}
			else if(allUsers.indexOf(sender) != -1){
				bot.reply(msg, "You are already an active user.");
			}
			bot.deleteMessage(msg);
		})
	}
	
	if(msg.content.indexOf(".top") === 0){
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
			
			if(err){
				console.log(err);	
			}
			else{
				for(var i=0;i<obj.length;i++){
					if (obj[i].coins > max1){
						max3 = max2;
						max2 = max1;
						max1 = obj[i].coins;
						max3Name = max2Name;
						max2Name = max1Name;
						max1Name = obj[i].name;
					}
					else if(obj[i].coins > max2){
						max3 = max2; 
						max2 = obj[i].coins;
						max3Name = max2Name; 
						max2Name = obj[i].name;
					}
					else if(obj[i].coins > max3){
						max3 = obj[i].coins;
						max3Name = obj[i].name;
					}
				}
				bot.deleteMessage(msg);
				bot.sendMessage(msg, "Top 3: 1st:" + max1Name +  " - " + max1 + "  2nd: " + max2Name +  " - " + max2 + "  3nd: " + max3Name +  " - " + max3);
			}
		})
	}

	if (msg.content.indexOf(".coins") === 0) {
		var currentUser = msg.author.username;
		jsonfile.readFile(file, function(err, obj) {
			for(var i=0;i<obj.length;i++){
				if(obj[i].name === currentUser){
					bot.deleteMessage(msg);
					bot.reply(msg, 'You have: ' + obj[i].coins + " coins left.");
				}
			}
		})
	}
	if(msg.content.indexOf(".spin") === 0){
		var d = new Date();
		var t = new Date();
		var currentUser = msg.author.username;
		var num1 = Math.floor((Math.random() * 10) + 1);
		var num2 = Math.floor((Math.random() * 10) + 1);
		var num3 = Math.floor((Math.random() * 10) + 1);
		var machine_stuck = Math.floor((Math.random() * 1000) + 1);
		
		jsonfile.readFile(file, function(err, obj) {
			if(err){
				console.log(err);
			}
			else{
				var users = obj;
				var inDataBase = false;
				var valid = false;
				var arrayLength = users.length;
				var msgString = "";
				
				for(var i=0;i<arrayLength;i++){
					if(users[i].name == currentUser){
						inDataBase = true;
						valid = true;
						bot.sendMessage(msg, "| " + num1 + " | " +  " | " + num2 + " | " + " | " + num3 + " |");
						
						if(num1==num2 && num1==num3 && num2==num3 ){
							if(num1 == 6 && num2 == 6 && num3 == 6){
								users[i].coins = 0;
								msgString += "FUCKA YOU!! Lose all coins. ";
								console.log(users[i].name + " has lost all of their coins. ");
							}
							else if(num1 == 7 && num2 == 7 && num3 == 7){
								msgString += "JACKPOT! You have gained 15 coins! ";
							}
							else{
								users[i].coins += 7;
								msgString += "3 of a kind! You have gained 7 coins! ";
							}
						}
						else if(num1==num2 || num1==num3 || num2==num3){
							users[i].coins += 5;
							msgString += "Two of a kind! You have gained 5 coins. ";
						}
						else{
							if(machine_stuck == 1){
								msgString += "Slot machine has malfunctioned in your favor..Gain 50 coins!!! ";
								users[i].coins += 50;
								console.log(users[i].name + ' broke the slot machine');
							}
							else{
								users[i].coins -= 1;
								msgString += "You lose 1 coin. ";
							}
						}
						msgString += 'Coins left: ' + users[i].coins;
						
						if(users[i].coins == 0){
							msgString += users[i].coins + ' coins left. Damn jew stop using all of your coins... ';
							users[i].coins += 10;
						}
					}
				}
					if(!inDataBase){
						bot.reply(msg, "Please type .addme to add youself to the database.");
					}
					if((msgString != "" || msgString != null) && inDataBase){
						bot.deleteMessage(msg);
						bot.reply(msg, msgString);
					}
				//if(valid == false && inDataBase == true){
					//bot.sendMessage(msg, 'Fucking autism stop spamming.');
				//}
			}
			
			var record = users; 
			jsonfile.writeFile(file, record, function (err) {
			  //console.error(err)
			})
		})
		
	}
	
});

//**Kyle's Bot Logic for finding users**
//--------------------------------------

	/*function deleteThatNigga(msg){
		function actuallyDeleteItLOL(msg){
			//console.log(msg);
			bot.deleteMessage(msg);
		}
		setTimeout(actuallyDeleteItLOL,10000);
	}*/
	
	var getChannelByUserMessageAuthorString = function(message, name){
		var channel = null;
		channel = findUserByName(message,name);
		if(channel)
		{
			channel = channel.voiceChannel;
		}
		else
		{
			channel = getServerChannelByName(getServerByNameWithMessage(message, "thef00fRaidcallRIP"), name);
			if(!channel)
			{
				channel = message.author.voiceChannel;
			}
		}
		return channel;
	}

	var getServerByNameWithMessage = function(message, name){
		var server = null;
		var servers = message.client.servers;
		for(var i=0;i<servers.length;i++)
		{
			if(servers[i].name === name)
			{
				server = servers[i];
			}
		}
		return server;
	}

	var getServerByNameWithBot = function(bot, name){
		var server = null;
		var servers = bot.servers;
		for(var i=0;i<servers.length;i++)
		{
			if(servers[i].name === name)
			{
				server = servers[i];
			}
		}
		return server;
	}

	var findUserByName = function(message, name){
		var server = getServerByNameWithMessage(message, "thef00fRaidcallRIP");
		var members = server.members;
		var user = null;
		
		for(var i=0;i<members.length;i++)
		{
			if(members[i].username.toUpperCase() === name.toUpperCase())
			{
				user = members[i];
			}
		}
		return user;
	}

	var getServerChannelByName = function(server, name){
		var channels = server.channels;
		var channel = null;
		
		for(var i=0;i<channels.length;i++)
		{
			if(channels[i].name === name)
			{
				channel = channels[i];
			}
		}
		return channel;
	}
//----------------------------------------------------

bot.login("jjp0610@aol.com", "bot123");
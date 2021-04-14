	var GameController = function(){
		this.map;				//Map
		this.playernum = 2;		//Number of Players
		this.playerid = 0;		//Playerid counter
		this.players = {};		//List of Players
		this.playerspecs = {
			0: {
				'name' : 'Astrolites',
				'groundcolor': 'ground-C5E0B4',
				'dicecolor' : 'dice-FFF'
			},
			1: {
				'name' : 'Blacktodongs',
				'groundcolor': 'ground-385723',
				'dicecolor' : 'dice-000'
			}
		};
		this.turnplayer;		//The Player who plays the current turn
		this.turnnumber = 0;	//Turn Number Counter
		this.selectedhex;		//Hex currently selected
		this.movecounter = 0;
		this.maxmove = 3;
		this.turnhexlock;
		this.playedthisturn = 0;
		//this.movetracker;
		this.movetracker = {};
		this.forceupdate = false;
	};
	
	/** Creates everything for starting the game **/
	GameController.prototype.start = function(){
		this.map = new Map();
		this.map.create();
		
		this.createplayers();
				
		this.initialize();
		
		this.displayturninfo();
		this.displayturnsleft(this.movecounter);
	};
	
	/** Intializes Parameters for beginning **/
	GameController.prototype.initialize = function(){
		this.initializepoints();
		
		/** Setting turn for player 1 **/
		this.turnplayer = this.players[0];
		
		this.initializeterritory();
		
		this.turnhexlock = new Array();
	};
	
	GameController.prototype.initializepoints = function(){
		/** Add Point to Capitals **/
		var hexmap = this.map.hexmaparray;
		for(var i = 0; i < hexmap.length; i++){
			for(var j = 0; j < hexmap[i].length; j++){
				var chex = hexmap[i][j];
				if(chex.type == 5){
					chex.updatepoints(20);
				}
			}
		}
	};
	
	GameController.prototype.initializeterritory = function(){
		/** Setting capitals for players **/
		for(var i in this.players){
			this.map.capitals[i].owner = this.players[i];
			this.players[i].capital = this.map.capitals[i];
		}
		
		/** Updating Territory for Players **/
		this.map.defineterritory();
	};
	
	/** Creates Players based on number provided **/
	GameController.prototype.createplayers = function(){
		for(var i = 0; i < this.playernum; i++){
			var player = new Player();
			player.id = this.playerid;
			player.groundcolor = this.playerspecs[i].groundcolor;
			player.dicecolor = this.playerspecs[i].dicecolor;
			player.name = this.playerspecs[i].name;
			
			this.players[this.playerid] = player;
			this.playerid++;
		}
	};
	
	/** Prepares for Move **/
	GameController.prototype.preparemove = function(i,j){	
		if(this.map.hexmaparray[i][j].points > 0 && 
			this.map.hexmaparray[i][j].owner == this.turnplayer &&
			this.turnhexlock.indexOf(this.map.hexmaparray[i][j]) == -1){
			this.selectedhex = this.map.hexmaparray[i][j];
			this.highlightrange(this.selectedhex);
		}
	};
	
	/** Highlights range of dice **/
	GameController.prototype.highlightrange = function(hex){
		for(var i in hex.range){
			if(hex.range[i] != null && hex.range[i] != 'undefined') { 
				hex.range[i].highlight(); 
			} 
		}
	};
	
	/** Removes highlight from range **/
	GameController.prototype.removehighlight = function(){
		var hexmap = this.map.hexmaparray;
		for(var i = 0; i < hexmap.length; i++){
			for(var j = 0; j < hexmap[i].length; j++){
				hexmap[i][j].removehighlight();
			}
		}
	};
	
	/** Moves of Player **/
	GameController.prototype.move = function(i,j){
		var chex = this.map.hexmaparray[i][j];
		var inrange = false;
		var notamove = false;

		if(this.selectedhex !=null && this.selectedhex != 'undefined'){
			/** Checks if target hex is in range **/
			for(var i in this.selectedhex.range){
				if(chex == this.selectedhex.range[i]){
					inrange = true;
				}
			}
			
			if(this.selectedhex != chex && inrange){
				/** Transfers points on movement **/
				if(chex.owner == this.selectedhex.owner || typeof chex.owner == 'undefined' || chex.owner == null){
					if(chex.points + this.selectedhex.points <= 100){
						chex.updatepoints(this.selectedhex.points);
						this.selectedhex.updatepoints(-this.selectedhex.points);
					}else{
						if(chex.points == 100){
							notamove = true;
						}else{
							var chexpts = chex.points;
							chex.updatepoints(100 - chexpts);
							this.selectedhex.updatepoints(chexpts - 100);
						}
					}
					
					chex.owner = this.turnplayer;
					this.map.updateterritory(this.turnplayer,chex);
				}else{
					var afterattack = chex.points - this.selectedhex.points;
					if(afterattack < 0){
						chex.updatepoints(-chex.points - afterattack);
						
						if(chex == chex.owner.capital){
							this.destroyloser(chex.owner);
							
							if(this.isgameover()){
								this.gameover();
							}
						}
						
						chex.owner = this.turnplayer;
						this.map.updateterritory(this.turnplayer,chex);
					}else{
						chex.updatepoints(-chex.points + afterattack);
					}
					this.selectedhex.updatepoints(-this.selectedhex.points);
				}
				
				
				/** Updates Territory **/
				
				if(!notamove){
					/** Tracks recently updated hex **/
					this.turnhexlock.push(chex);
					
					/** Updates Move Tracker **/			
					this.updatemovetracker(chex);
					
					/** Updates number of moves **/
					this.movecounter++;
					this.displayturnsleft(this.movecounter);
														
					/** Updates turn if player exhaust number of moves **/
					if(Object.keys(this.movetracker[this.turnnumber][this.turnplayer.id]).length == this.maxmove ||
						this.dicecount() == Object.keys(this.movetracker[this.turnnumber][this.turnplayer.id]).length){
						this.updateturn();
					}
				}
			}
			
			this.removehighlight();
			this.selectedhex = null;
		}	
	};	
	
	GameController.prototype.dicecount = function(){
		var count = 0;
		for(var i = 0; i < this.map.hexmaparray.length; i++){
			for(var j = 0; j < this.map.hexmaparray[i].length; j++){
				if(this.map.hexmaparray[i][j].owner == this.turnplayer && this.map.hexmaparray[i][j].points > 0){
					count++;
				}
			}
		}
		return count;
	};
	
	GameController.prototype.updatemovetracker = function(chex){
		if(typeof this.movetracker[this.turnnumber] == 'undefined') this.movetracker[this.turnnumber] = {};
		if(typeof this.movetracker[this.turnnumber][this.turnplayer.id] == 'undefined') this.movetracker[this.turnnumber][this.turnplayer.id] = {};
		if(typeof this.movetracker[this.turnnumber][this.turnplayer.id][this.movecounter] == 'undefined') this.movetracker[this.turnnumber][this.turnplayer.id][this.movecounter] = {};
				
		this.movetracker[this.turnnumber][this.turnplayer.id][this.movecounter][0] = this.selectedhex;
		this.movetracker[this.turnnumber][this.turnplayer.id][this.movecounter][1] = chex;
	};
	
	GameController.prototype.forceupdateturn = function(){
		this.forceupdate = true;
		this.updatemovetracker(null);
		this.updateturn();
	};
	
	/** Takes turn to next player **/
	GameController.prototype.updateturn = function(){
		this.changeturnnotify();
		
		/** Set movecounter to 0 **/
		this.movecounter = 0;
		this.displayturnsleft(this.movecounter);
		
		/** Updates number of players who have moved **/
		if(Object.keys(this.movetracker[this.turnnumber]).length == this.playernum &&
		 (Object.keys(this.movetracker[this.turnnumber][this.turnplayer.id]).length == this.maxmove || 
		 	Object.keys(this.movetracker[this.turnnumber][this.turnplayer.id]).length == this.dicecount() || 
		 	this.forceupdate)){
			this.newturn();
		}
		
		var id = this.turnplayer.id;
		
		if(id == Object.keys(this.players).length-1 ){
			this.turnplayer = this.players[0];
		}else{
			this.turnplayer = this.players[(id+1)];
		}
		
		this.forceupdate = false;
		this.turnhexlock = new Array();
		
		this.displayturninfo();
	};
	
	GameController.prototype.newturn = function(){
		this.newturnnotify();
	
		this.turnnumber++;
		
		this.spawnpoints();
	};
		
	GameController.prototype.spawnpoints = function(){
		for(var i = 0; i < this.map.hexmaparray.length; i++){
			for(var j = 0; j < this.map.hexmaparray[i].length; j++){
				if(this.map.hexmaparray[i][j].owner != null && typeof this.map.hexmaparray[i][j].owner != 'undefined' ){
					if(this.map.hexmaparray[i][j].type == 5){
						if(this.map.hexmaparray[i][j].points < 100) {
							this.map.hexmaparray[i][j].spawnpoints(10);
						}
					}
					if(this.map.hexmaparray[i][j].type == 3){
						if(this.map.hexmaparray[i][j].points < 100) {
							this.map.hexmaparray[i][j].spawnpoints(5);
						}
					}
				}
			}
		}
	};
	
	GameController.prototype.giveup = function(){
		this.destroyloser(this.turnplayer);
		if(this.isgameover){
			this.gameover();
		}else{
			this.updateturn();
		}
	};
	
	GameController.prototype.destroyloser = function(loser){
		for(var i = 0; i < this.map.hexmaparray.length; i++){
			for(var j = 0; j < this.map.hexmaparray[i].length; j++){
				if(this.map.hexmaparray[i][j].owner == loser){
					this.map.hexmaparray[i][j].updatepoints(-this.map.hexmaparray[i][j].points);
					this.map.hexmaparray[i][j].owner == this.turnplayer;
					
					this.map.defineterritory();
				}
			}
		}
		
		for(var i in this.players){
			if(this.players[i] == loser){
				delete this.players[i];
			}
		}
	};
	
	GameController.prototype.isgameover = function(){
		if(Object.keys(this.players).length == 1){
			return true;
		}
		return false;
	};
	
	GameController.prototype.gameover = function(){
		var winnername;
		for(var i in this.players){
			winnername = this.players[i].name;
		}
		$("#winnername").html(winnername);
		$("#gameover").show();
	};
	
	GameController.prototype.changeturnnotify = function(){
		$("#changeturn").show();
		var changepause = setTimeout(function(){
			$("#changeturn").hide();
		}, 1000);
	};
	
	GameController.prototype.newturnnotify = function(){
		$("#newturn").show();
		var changepause = setTimeout(function(){
			$("#newturn").hide();
		}, 2000);
	};
	
	GameController.prototype.displayturninfo = function(){
		$("#turnnumber").html(this.turnnumber + 1);
		$("#turnplayer").html(this.turnplayer.name);
		
		this.displayturnsleft(this.movecounter);
	};
	GameController.prototype.displayturnsleft = function(turnsleft){
		$("#turnsleft").html(turnsleft + "/" + this.maxmove);
	};
	
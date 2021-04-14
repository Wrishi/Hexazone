	/* 	1 - Standard Ground
		2 - Water
		3 - City
		4 - Dock
		5 - Capital
	*/
	var Map = function(){
		this.hexid = 0;					//Hex Id counter ??
		this.hexarray = {};				//List of Hex in Map
		this.hexmaparray;				//Hexmap
		this.maparea = $(".map");		//Marker for Creating map in HTML
		this.maparray = MAP[Math.floor((Math.random() * Object.keys(MAP).length))];				//Skeleton of Map
		this.capitals = {};				//List of Capitals
	};
	
	/** Creating the Map **/
	Map.prototype.create = function(){
		this.draw();
		this.associate();
		this.createrange();
		this.setcapitals();
	};
	
	/** Drawing the Map **/
	Map.prototype.draw = function(){	
		this.hexmaparray = new Array();
		for(var i = 0; i < this.maparray.length; i++){
			var row = this.makerow();
			this.hexmaparray[i] = new Array();
			for(var j = 0; j < this.maparray[i].length; j++){
				var hex = new Hex;
				hex.i = i;
				hex.j = j;
				
				/** Vestigial? ***/
				hex.id = this.hexid;
				this.hexarray[this.hexid] = hex; 
				this.hexid++;
				/** Or Not? ***/
				
				this.hexmaparray[i][j] = hex;
				hex.type = this.maparray[i][j];
				
				hex.create(i,j,row);
			}
		}
	};
	
	/** Making a new row **/
	Map.prototype.makerow = function(){
		var row = document.createElement("div");
		row.setAttribute("class","row");
		
		this.maparea.append(row);
		
		return row;
	};
	
	/** Associating Hex to their east, neast, nwest, west, swest, seast parameters **/
	Map.prototype.associate = function(){
		for(var i = 0; i < this.hexmaparray.length; i++){
			for(var j = 0; j < this.hexmaparray[i].length; j++){
				var hex = this.hexmaparray[i][j];
				
				hex.east = this.hexmaparray[i][j-1];
				hex.west = this.hexmaparray[i][j+1];
				
				if(i % 2 == 0){
					hex.neast = i > 0 && j > 0? this.hexmaparray[i-1][j-1]: null;
					hex.nwest = i > 0? this.hexmaparray[i-1][j]: null;
					
					hex.seast = i < this.hexmaparray.length-1 && j > 0? this.hexmaparray[i+1][j-1]: null;
					hex.swest = i < this.hexmaparray.length-1? this.hexmaparray[i+1][j]: null;
				}else{
					hex.neast = i > 0? this.hexmaparray[i-1][j]: null;
					hex.nwest = i > 0 && j < this.hexmaparray[i].length-1? this.hexmaparray[i-1][j+1]: null;
					
					hex.seast = i < this.hexmaparray.length-1? this.hexmaparray[i+1][j]: null;
					hex.swest = i < this.hexmaparray.length-1 && j < this.hexmaparray[i].length-1? this.hexmaparray[i+1][j+1]: null;
				}
			}
		}
	};
	
	/** Creating Range for different all Hex **/
	Map.prototype.createrange = function(){
		for(var i = 0; i < this.hexmaparray.length; i++){
			for(var j = 0; j < this.hexmaparray[i].length; j++){
				this.hexmaparray[i][j].createrange();
			}
		}
	};
	
	/** Setting Capitals **/
	Map.prototype.setcapitals = function(){
		var index = 0;
		for(var i = 0; i < this.hexmaparray.length; i++){
			for(var j = 0; j < this.hexmaparray[i].length; j++){
				if(this.hexmaparray[i][j].type == 5){
					this.capitals[index] = this.hexmaparray[i][j];
					index++;
				}
			}
		}
	};
	
	/** Defines territory for users **/
	Map.prototype.defineterritory = function(){
		var occupiedhex = new Array();

		for(var i = 0; i < this.hexmaparray.length; i++){
			for(var j = 0; j < this.hexmaparray[i].length; j++){
				if(this.hexmaparray[i][j].owner != null && this.hexmaparray[i][j].owner != 'undefined') { 
					occupiedhex.push(this.hexmaparray[i][j]); 
				}
			}
		}
		for(var i = 0; i < occupiedhex.length; i++){
			var owner = occupiedhex[i].owner;
			if(occupiedhex[i].east != null && occupiedhex[i].east != 'undefined'){
				occupiedhex[i].east.owner = owner;
			}
			if(occupiedhex[i].neast != null && occupiedhex[i].neast != 'undefined'){
				occupiedhex[i].neast.owner = owner;
			}
			if(occupiedhex[i].nwest != null && occupiedhex[i].nwest != 'undefined'){
				occupiedhex[i].nwest.owner = owner;
			}
			if(occupiedhex[i].west != null && occupiedhex[i].west != 'undefined'){
				occupiedhex[i].west.owner = owner;
			}
			if(occupiedhex[i].swest != null && occupiedhex[i].swest != 'undefined'){
				occupiedhex[i].swest.owner = owner;
			}
			if(occupiedhex[i].seast != null && occupiedhex[i].seast != 'undefined'){
				occupiedhex[i].seast.owner = owner;
			}
		}
		
		this.markterritory();
	};
	
	/** Updates territory after each move **/
	Map.prototype.updateterritory = function(player,hex){
		if(hex.east != null && hex.east != 'undefined' && hex.east.points == 0 && hex.east.type == 1){
			hex.east.owner = player;
		}
		if(hex.neast != null && hex.neast != 'undefined' && hex.neast.points == 0 && hex.neast.type == 1){
			hex.neast.owner = player;
		}
		if(hex.nwest != null && hex.nwest != 'undefined' && hex.nwest.points == 0 && hex.nwest.type == 1){
			hex.nwest.owner = player;
		}
		if(hex.west != null && hex.west != 'undefined' && hex.west.points == 0 && hex.west.type == 1){
			hex.west.owner = player;
		}
		if(hex.swest != null && hex.swest != 'undefined' && hex.swest.points == 0 && hex.swest.type == 1){
			hex.swest.owner = player;
		}
		if(hex.seast != null && hex.seast != 'undefined' && hex.seast.points == 0 && hex.seast.type == 1){
			hex.seast.owner = player;
		}
		
		this.markterritory();
	};
	
	/** Marks territory **/
	Map.prototype.markterritory = function(){
		for(var i = 0; i < this.hexmaparray.length; i++){
			for(var j = 0; j < this.hexmaparray[i].length; j++){
				if(this.hexmaparray[i][j].owner != null && typeof this.hexmaparray[i][j].owner != 'undefined'){					
					$("#hex-"+i+"-"+j).removeAttr("data-owner").attr("data-owner",this.hexmaparray[i][j].owner.id);
				}
			}
		}
	};
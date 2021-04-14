	var Hex = function(){
		this.id;					//Hex Id
		this.type;					//Type : 1 - Ground; 2 - Water; 3 - City; 4 - Dock; 5 - Capital
		this.i;						//Grid Location: Vertical
		this.j;						//Grid Location: Horizontal
		this.east;					//Hex to the East
		this.neast;					//Hex to North-East
		this.nwest;					//Hex to North-West
		this.west;					//Hex to West
		this.swest;					//Hex to South-West
		this.seast;					//Hex to South-East
		this.movementrange = 2;		//Range of movement from on hex to any direction
		this.range = {};			//List of Hex traversable
		this.points = 0;			//Points in this hex
		this.owner;					//Player who owns hex
		this.army;					//??
	};
	
	/** Creating a Hex **/
	Hex.prototype.create = function(i,j,row){
		var hexagon = document.createElement("div");
		hexagon.setAttribute("class","hexagon");
		hexagon.setAttribute("id","hex-"+i+"-"+j);
		hexagon.setAttribute("data-i",i);
		hexagon.setAttribute("data-j",j);
		switch(this.type){
			case 1: $(hexagon).addClass("ground");break;
			case 2: $(hexagon).addClass("water"); break;
			case 3: $(hexagon).addClass("city"); break;
			case 4: $(hexagon).addClass("dock");break;
			case 5: $(hexagon).addClass("capital");break;
			default: break;
		}
		
		var hexcap = document.createElement("div");
		hexcap.setAttribute("class","hexcap");
		
		var hextrunk = document.createElement("div");
		hextrunk.setAttribute("class","hextrunk");
	
		var hexbase = document.createElement("div");
		hexbase.setAttribute("class","hexbase");
		
		var circle = document.createElement("div");
		circle.setAttribute("class","numbercircle");
		
		$(hexagon).append(hexcap);
		$(hexagon).append(hextrunk);
		$(hexagon).append(hexbase);
		$(hexagon).append(circle);
		
		$(row).append(hexagon);
	};
	
	/** Checks if a particular hex is in range of another **/
	Hex.prototype.isinrange = function(hex){
		for(var i in this.range){
			if(this.range[i] == hex){
				return true;
			}
		}
		return false;
	};
	
	/** Creates range for a particular hex **/
	Hex.prototype.createrange = function(){
		this.range[0] = this;
		var index = 1;
		for(var j = 0; j < this.movementrange; j++){
			for(var i in this.range){
				//If intended hex exist
				if(this.range[i].east != null && this.range[i].east != 'undefined'){
					//If it not already in hex range list 
					if(!this.isinrange(this.range[i].east) ) {
						if(!(this.range[i].type == 1 && this.range[i].east.type == 2) && //If it is ground and not beside water
						   !(this.range[i].type == 2 && this.range[i].east.type == 1)){//If it is water and not beside ground
							//Add to range list
							this.range[index] = this.range[i].east;
							index++;
						} 
					}
				}
				if(this.range[i].neast != null && this.range[i].neast != 'undefined'){
					if(!this.isinrange(this.range[i].neast)) {
						if(!(this.range[i].type == 1 && this.range[i].neast.type == 2) && 
						   !(this.range[i].type == 2 && this.range[i].neast.type == 1)){
							this.range[index] = this.range[i].neast; 
							index++;
						}
					}
				}
				if(this.range[i].nwest != null && this.range[i].nwest != 'undefined'){
					if(!this.isinrange(this.range[i].nwest)) {
						if(!(this.range[i].type == 1 && this.range[i].nwest.type == 2) && 
						   !(this.range[i].type == 2 && this.range[i].nwest.type == 1)){
							this.range[index] = this.range[i].nwest; 
							index++; 
						}
					}
				}
				if(this.range[i].west != null && this.range[i].west != 'undefined'){
					if(!this.isinrange(this.range[i].west) ) {
						if(!(this.range[i].type == 1 && this.range[i].west.type == 2) && 
						   !(this.range[i].type == 2 && this.range[i].west.type == 1)){
							this.range[index] = this.range[i].west; 
							index++; 
						}
					}
				}
				if(this.range[i].swest != null && this.range[i].swest != 'undefined'){
					if(!this.isinrange(this.range[i].swest)) {
						if(!(this.range[i].type == 1 && this.range[i].swest.type == 2) && 
						   !(this.range[i].type == 2 && this.range[i].swest.type == 1)){
							this.range[index] = this.range[i].swest; 
							index++; 
						}
					}
				}
				if(this.range[i].seast != null && this.range[i].seast != 'undefined'){
					if(!this.isinrange(this.range[i].seast)) {
						if(!(this.range[i].type == 1 && this.range[i].seast.type == 2) && 
						   !(this.range[i].type == 2 && this.range[i].seast.type == 1)){
							this.range[index] = this.range[i].seast; 
							index++;
						} 
					}
				}
			}
		}		
	};
	
	/** Spawn points of hex **/
	Hex.prototype.spawnpoints = function(points){
		this.points = this.points + points;
		
		var adj = 0;
		
		if(this.east != null && typeof this.east != 'undefined' && this.owner == this.east.owner) { 
			adj = adj + 0.05 * this.east.points + 0.01 * this.points; 
		}
		if(this.neast != null && typeof this.neast != 'undefined' && this.owner == this.neast.owner) { 
			adj = adj + 0.05 * this.neast.points + 0.01 * this.points; 
		}
		if(this.nwest != null && typeof this.nwest != 'undefined' && this.owner == this.nwest.owner) { 
			adj = adj + 0.05 * this.nwest.points + 0.01 * this.points; 
		}
		if(this.west != null && typeof this.west != 'undefined' && this.owner == this.west.owner) { 
			adj = adj + 0.05 * this.west.points + 0.01 * this.points;
		}
		if(this.swest != null && typeof this.swest != 'undefined' && this.owner == this.swest.owner) { 
			adj = adj + 0.05 * this.swest.points + 0.01 * this.points; 
		}
		if(this.seast != null && typeof this.seast != 'undefined' && this.owner == this.seast.owner) { 
			adj = adj + 0.05 * this.seast.points + 0.01 * this.points; 
		}
		
		this.points = this.points + Math.floor(adj);
		this.points = this.points > 100 ? 100 : this.points;

		this.displaypoints();
	};


	/** Update points of hex **/
	Hex.prototype.updatepoints = function(points){
		this.points = this.points + points;
		this.points = this.points > 100 ? 100 : this.points;

		this.displaypoints();
	};
	
	/** Displays points of hex **/
	Hex.prototype.displaypoints = function(){
		var pdis = $("#hex-"+this.i+"-"+this.j).find(".numbercircle");
		pdis.html(this.points);
		if(this.points > 0){
			if(!pdis.hasClass("active")){
				pdis.addClass("active");
			}
		}else{
			pdis.removeClass("active");
		}
	};
	
	/** Hightlights Hex **/
	Hex.prototype.highlight = function(){
		$("#hex-"+this.i+"-"+this.j).addClass("highlight");
	};
	
	/** Removes Highlight from Hex **/
	Hex.prototype.removehighlight = function(){
		$("#hex-"+this.i+"-"+this.j).removeClass("highlight");
	};

	
	
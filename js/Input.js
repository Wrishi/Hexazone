	window.onload = function(){
		var gc = new GameController();
		gc.start();
		
		/** Select for Move **/
		/** Move Points to selected hex **/
		$(".hexagon").on("tap",function(){
			var chex = $(this);
			var i = parseInt(chex.data("i"));
			var j = parseInt(chex.data("j"));
			
			if(gc.selectedhex == null || gc.selectedhex == 'undefined'){
				gc.preparemove(i,j);
			}else{
				gc.move(i,j);
			}
		});
		
		$("#endturn").on("tap", function(){
			gc.forceupdateturn();
		});
		
		$("#giveup").on("tap", function(){
			gc.giveup();
		});
		
		$("#newgame").on("tap",function(){
			window.location.reload();
		});
	};
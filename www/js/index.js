var MainApp = function(){
	//private members

	var dac = new localDac();

	var bindEvents = function(){
		$(window).on("dacLoaded",function(){
			dac.save("item to save","itemKey");
			//console.log(dac.read("itemKey"));
		});
		
	}

	//public members

	this.Initialize = function() {
		bindEvents();
	}
};
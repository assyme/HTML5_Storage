// This would save all functions related to data access layer

var fileDac = function(){
	//private members

	fileSystem = null;

	var inInitFileSystem = function(fs){
		console.log("file system recieved " + fs.name);
		fileSystem = fs;
		$(window).trigger('dacLoaded');
	}

	var errorHandler = function errorHandler(e) {
	  var msg = '';

	  switch (e.code) {
	    case FileError.QUOTA_EXCEEDED_ERR:
	      msg = 'QUOTA_EXCEEDED_ERR';
	      break;
	    case FileError.NOT_FOUND_ERR:
	      msg = 'NOT_FOUND_ERR';
	      break;
	    case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	      break;
	    case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	      break;
	    case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	      break;
	    default:
	      msg = 'Unknown Error';
	      break;
  		};

  	console.log('Error: ' + msg);
	}
	// Create a file system during the construction of this class. 
	//TODO : Request for quoto to create persistent fileSytem
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.requestFileSystem(window.TEMPORARY,1024*1024,inInitFileSystem,errorHandler);

	//public members
	this.save = function(obToSave,key){
		//use the file system to save the text in the file. 
		if (fileSystem == null){
			throw "File system was not initialized";

		}else{
			fileSystem.root.getFile(key + ".txt",{create: true},function(fileEntry){
				fileEntry.createWriter(function(writer){
					writer.onwriteend = function(e){
						console.log("write ended");
					}
					var blob = new Blob([obToSave],{type: 'text/plain'});
					writer.write(blob);
				},errorHandler)
			},errorHandler);
		}
	}

	this.read = function(key){
		if (fileSystem == null){
			throw "File system was not initialized."
		}else{
			fileSystem.root.getFile(key + ".txt",{},function(fileEntry){
				fileEntry.file(function(file){
					var reader = new FileReader();
					reader.onloadend = function(e){
						console.log(this.result);
					};
					reader.readAsText(file);
				},errorHandler)
			},errorHandler);
		}
	}
};

var localDac = function(){
	//private members

	
//public members
	this.save = function(obToSave,key){
		//Check the argument for string else fail.
		if (typeof obToSave === "string"){
			//continue with saving 
			window.localStorage[key] = obToSave;
		}else{
			throw "Input should be a string";
		}
	}

	this.read = function(key){
		return window.localStorage[key];
	}
	$(window).trigger("dacLoaded");
	
};
/***************************************************
* Author: Arjun Sreedharan
* Email: arjun024@gmail.com
* Original Repo: github.com/arjun024/meg
* License: GPL v2
* IF YOU RELEASE ANY MODIFIED VERSION OF THIS CODE,
* YOU ARE REQUIRED TO MAKE THE MODIFIED SOURCE CODE
* AVAILABLE AS FREE AND OPEN SOURCE.
***************************************************/

var Meg = {};
/*
* constructor
*/
Meg = function (content) {
	this._content = content ? content : {};
	this.children = [];
};

/*
* Instance Methods
*/
Meg.prototype.getContent = function(){
  return this._content;
};

Meg.prototype.getChildren = function(){
	return this.children;
};

Meg.prototype.getChild = function(i){
	if(typeof i != "undefined" && i < this.children.length) {
		i = parseInt(i);
		return this.children[i];
	}
	else if(typeof i != "undefined" && i >= this.children.length) throw "No index " + i + " exists. Enter an integer between 0 and " + this.children.length - 1;
	else throw "Pass argument - index of required child.  Enter an integer between 0 and " + (this.children.length - 1);
};

Meg.prototype.addChild = function(meg, i){
	if(meg.constructor && meg.constructor == Meg){
		if(typeof i != "undefined") {
			i = parseInt(i);
			this.children.splice(i, 0, meg);
		}
		else this.children.push(meg);
		return this;
	}
	else throw "You can only add an object of type Meg";
};

Meg.prototype.removeAllChildren = function(){
	this.children = [];
	return this;
};

Meg.prototype.removeChild = function(i){
	if(typeof i == "undefined") this.children.pop();
	else this.children.splice(i, 1);
	return this;
}
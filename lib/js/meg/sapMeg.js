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

Meg.prototype.makeTree = function(){
  var sapTree = new sap.ui.commons.Tree();
  sapTree.setShowHeader(false);
  var rootTreeNode = new sap.ui.commons.TreeNode({text:(""+this.getContent()).split(".").slice(-1)[0].replace("#"," (#")+")", expanded: true})
  sapTree.addNode(rootTreeNode);
  Meg.treeRenderer(this, rootTreeNode);
  return sapTree;
};

/*
* Static Methods
*/

Meg.treeRenderer = function(root, rootTreeNode){
  var children = root.getChildren();
  if(children.length < 1) return;
  for(var i in children){
    var child = children[i];
    var childTreeNode = new sap.ui.commons.TreeNode({text:(""+child.getContent()).split(".").slice(-1)[0].replace("#"," (#")+")", expanded: true});
    rootTreeNode.addNode(childTreeNode);
    this.treeRenderer(child, childTreeNode);
  }
};

Meg.createMegTree = function(rootMeg){
  if(!(sapObj = rootMeg.getContent())) return;
  var rootContents = [];

  switch (sapObj.constructor){
    case sap.ui.commons.layout.MatrixLayout:
      if(sapObj.getRows().length < 1) return;
      rootContents = sapObj.getRows();
      break;

    case sap.ui.commons.layout.MatrixLayoutRow:
      if(sapObj.getCells().length < 1) return;
      rootContents = sapObj.getCells();
      break;

    case sap.m.IconTabBar:
      if(sapObj.getItems().length < 1) return;
      rootContents = sapObj.getItems();
      break;

    default:
      if(!sapObj.getContent || sapObj.getContent().length < 1) return;
      rootContents = sapObj.getContent();
      break;
  }

  for(var i in rootContents){
    var contentItem = rootContents[i];
    var contentMeg = new Meg(contentItem);
    rootMeg.addChild(contentMeg);
    this.createMegTree(contentMeg);
  }
  return rootMeg;
};

Meg.tree = function(sapRootObj){
  var root = this.createMegTree(new Meg(sapRootObj));
  return root.makeTree();
};

Meg.dialog = function(sapRootObj){
  var githubT = new sap.ui.commons.TextView({}).addEventDelegate({
      onAfterRendering:function(){
        githubT.$().text("[Fork me on GitHub. ").append($("<a target='_blank'>github.com/arjun024/meg]</a>").attr("href","http://github.com/arjun024/meg"))
      }
    });
  new sap.ui.commons.Dialog({
    content: [Meg.tree(sapRootObj), githubT]
  }).open();
}

Meg.sapBoot = function(){
  if(sap && sap.ui.getCore){
    var sapRootControl = sap.ui.getCore().getUIArea("content").getRootControl();
    if(sapRootControl){
      Meg.dialog(sapRootControl);
    }
  }
}();
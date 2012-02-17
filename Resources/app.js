function NameObj() {
	this.id = "";
	this.name = "";	
	this.prefix = "";
	this.gender = "";
	this.starred = false;
}

function ListTab() {
	this.currentPage = 1;	
	this.names = [];
	this.listeners = {};
	this.totalRecords = 0;
	this.totalPages = 1;
	this.queryFunction = null;
	this.itemsPerPage = 10;
}

ListTab.prototype.events = {
	"PAGECHANGED":"pagechanged"
}

ListTab.prototype.addName = function (nameObj) {
		names.push(nameObj);
}

ListTab.prototype.getDataForPage = function(callback) {
	var offset = null;
	
	if(this.currentPage != 1) {
		offset = (this.currentPage-1)*this.itemsPerPage;
	}
	arumbu.log("offset::::::::>"+offset);
	arumbu.log("this.currentPage::::::::>"+this.currentPage);
	if(this.queryFunction) {
		this.queryFunction(this,function(nameList){
			
			this.names = [];
			this.names = nameList;		
			callback.call();
		},this.itemsPerPage,offset);
	}
}

ListTab.prototype.setTotalRecords = function (total) {	
	if(total) {
		this.totalRecords = total;
		this.totalPages = Math.ceil(this.totalRecords/this.itemsPerPage);
		arumbu.log("this.totalPages in class:::::::>"+this.totalPages);
	}
	
}

ListTab.prototype.gotoPage = function (pageNo) {
		if( ! (pageNo<0 && pageNo> this.totalPages)) {
			this.currentPage = pageNo;			
		}
}

ListTab.prototype.navigatePrevious = function() {
	if(this.currentPage != 1) {
		this.currentPage --;
	}
}

ListTab.prototype.navigateNext = function() {
	if(this.currentPage != this.totalPages) {
		this.currentPage++;		
	}
}

ListTab.prototype.dispatchEvent = function(event,data) {
	var listeners = this.listeners[event];	
	for(var i=0;i<listeners.length;i++) {
		listeners[i].callBack.apply(listeners[i],data||null);		
	}
}

ListTab.prototype.addListener = function (event,callBack,thisObj) {
	var listeners = this.listeners[event];
	for(var i=0;i<listeners.length;i++) {
		if(listeners[i].callBack === callBack) {
			return false;
		}
	}	
	
	this.listeners[event].push ({"callBack":callBack,"thisObj":thisObj});
	return true;
}

ListTab.prototype.removeListener = function (event,callBack) {
	var listeners = this.listeners[event];
	for(var i=0;i<listeners.length;i++) {
		if(listeners[i].callBack === callBack) {
			listeners[i].slice(i,1);
			return true;
		}
	}	
	
	return false;
}


var arumbu = {		
	
	//Constants
	"gender": {
		"MALE":"boy",
		"FEMALE":"girl"
	},
	"phrases":{	
		"noData":"No Data Found",
		"page":"Àì¸õ"
	},
	
	"DEVELOPMENT":"dev",
	"itemsPerPage":20,	
	
	"mode":"dev",
	
	"filters": {
		"startingLetterFilter":{
			"letters":[],
			"query":"",
			"addLetter":function(letter) {				
				for(var i=0;i<this.letters.length;i++) {
					if(this.letters[i] == letter){
						return false;
					}
					
				}		
				
				this.letters.push(letter);
				this.updateQuery();
			},
			
			"removeLetter":function(letter){
				
				for(var i=0;i<this.letters.length;i++) {
					if(this.letters[i] == letter){
						this.letters.splice(i,1);
						this.updateQuery();
						return true;
					}					
				}
				
				return false;
			},

			"updateQuery":function() {
				this.query = "";
				var len = this.letters.length;		
				
				for(var i=0;i<len;i++) {					
					this.query += " names.prefix='"+this.letters[i]+"'" + ((len>1 && i!=len-1)?"OR ":"");
				}
				arumbu.log("updateQuery filter Query ::::>"+this.query);
			}
		}
	},
	
	"log":function(msg){
		//console.log(msg);
	},
	
	"addStartingLetterFilter":function(letter) {
		this.filters.startingLetterFilter.addLetter(letter);		
	},
	
	"listTabs" :{
		"both":new ListTab(),
		"male":new ListTab(),
		"female":new ListTab(),
		"starred":new ListTab()
	},
	
	"activeTab":null,
	
	"init":function() {	
		
		Titanium.UI.setBackgroundColor('#000');

		// create tab group
		var tabGroup = Titanium.UI.createTabGroup();
		
		//
		// create base UI tab and root window
		//
		var bothWindow = Titanium.UI.createWindow({  
		    title:'Both',
		    backgroundColor:'#fff'
		});
		
		var maleWindow = Titanium.UI.createWindow({  
		    title:'Male',
		    backgroundColor:'#fff'
		});
		
		var femaleWindow = Titanium.UI.createWindow({  
		    title:'Female',
		    backgroundColor:'#fff'
		});
		
		var starredWindow = Titanium.UI.createWindow({  
		    title:'Starred',
		    backgroundColor:'#fff'
		});
		
		var filtersWindow = Titanium.UI.createWindow({  
		    title:'Filters',
		    backgroundColor:'#fff'
		});
		
		var aboutWindow = Titanium.UI.createWindow({  
		    title:'About',
		    backgroundColor:'#fff'
		});
		
		var bothTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Both',
		    window:bothWindow
		});
		
		var maleTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Male',
		    window:maleWindow
		});
		
		var femaleTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Female',
		    window:femaleWindow
		});
		
		var starredTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Starred',
		    window:starredWindow
		});
		
		var filtersTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'Filters',
		    window:filtersWindow
		});
		
		var aboutTab = Titanium.UI.createTab({  
		    icon:'KS_nav_views.png',
		    title:'About',
		    window:aboutWindow
		});		
		
		var label1 = Titanium.UI.createLabel({
			color:'#999',
			text:'Àì¸õ',
			font:{fontSize:20,fontFamily:'TSCu_Paranar'},
			textAlign:'center',
			width:'auto'
		});
		
		//win1.add(label1);
		
		var label2 = Titanium.UI.createLabel({
			color:'#999',
			text:'I am Window 2',
			font:{fontSize:20,fontFamily:'Helvetica Neue'},
			textAlign:'center',
			width:'auto'
		});
		
		
		//
		//  add tabs
		//
		tabGroup.addTab(bothTab);  
		tabGroup.addTab(maleTab);  
		tabGroup.addTab(femaleTab);
		tabGroup.addTab(starredTab);
		tabGroup.addTab(filtersTab);
		tabGroup.addTab(aboutTab);
		
		// open tab group
		tabGroup.open();
		
		//function initialize
		 $(document).ready(function(){ 			
		 
			var bothTab = arumbu.listTabs.both;
			var maleTab = arumbu.listTabs.male;
			var femaleTab = arumbu.listTabs.female;
			var starredTab = arumbu.listTabs.starred;
			
			bothTab.queryFunction = arumbu.getBothNames;
			maleTab.queryFunction = arumbu.getMaleNames;
			femaleTab.queryFunction = arumbu.getFemaleNames;
			starredTab.queryFunction = arumbu.getStarredNames;
			
			bothTab.name = "both";
			maleTab.name = "male";
			femaleTab.name = "female";
			starredTab.name = "starred";
			
			bothTab.itemsPerPage = maleTab.itemsPerPage = femaleTab.itemsPerPage = arumbu.itemsPerPage;
			starredTab.itemsPerPage = null;			
			
			$("#both").bind('pageshow',function(evt){
				arumbu.activeTab = bothTab;	
				arumbu.activeTab.currentPage = 1;
				
				arumbu.getRecordCount("",this,function(result){
					arumbu.log("both getRecordCount::::>"+result);
					bothTab.setTotalRecords(result);
				});
			
				arumbu.showTab(bothTab);
			});
			
			$("#both").bind('pagebeforeshow',function(evt){
				arumbu.clearPaginationText("both");
			});
			
			$("#boy").bind('pagebeforeshow',function(evt){
				arumbu.clearPaginationText("boy");
			});
			
			$("#girl").bind('pagebeforeshow',function(evt){
				arumbu.clearPaginationText("girl");
			});
			
			$("#boy").bind('pageshow',function(evt){
					arumbu.activeTab = maleTab;
					arumbu.activeTab.currentPage = 1;					
					
					arumbu.getRecordCount("male",this,function(result){
						arumbu.log("male getRecordCount::::>"+result);
						maleTab.setTotalRecords(result);
					});
					
					arumbu.showTab(maleTab);						
			});
			
			
			$("#girl").bind('pageshow',function(evt){
					arumbu.activeTab = femaleTab;
					arumbu.activeTab.currentPage = 1;
					arumbu.getRecordCount("female",this,function(result){
						femaleTab.setTotalRecords(result);
					});
					arumbu.showTab(femaleTab);
					
			});
			
			$("#starred").bind('pageshow',function(evt){
					arumbu.activeTab = null;
					starredTab.getDataForPage(function() {
						var len = starredTab.names.length;	
						var op1="<ul data-role='listview' class='nameList' style='opacity:0'>";
						if(len) {														
							for(var i=0;i<len;i++) {
									var nameobj = starredTab.names[i];					
									op1 +="<li data-icon='delete'><a href='#' class='starListItem' id='"+nameobj.id+"' >"+nameobj.name+"</a></li>";					
							}
						}else {
							op1 += "<li>"+arumbu.phrases.noData+"</li>"								
						}
						op1 += "</ul>"		
						$('.ui-page-active .nameListContainer').html(op1);
						$('#starred').page('destroy').page();
						arumbu.showNameList();
					});	
			});
			
			$("#starred").bind('pagehide',function(evt){				
				arumbu.hideNameList("starred");				
			});
			
			$("#girl").bind('pagehide',function(evt){				
				arumbu.hideNameList("girl");
			});			
			
			$("#boy").bind('pagehide',function(evt){				
				arumbu.hideNameList("boy");
			});	
			
			$("#both").bind('pagehide',function(evt){				
				arumbu.hideNameList("both");
			});

			$(".filt").bind("tap",function(evt){				
				if($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					arumbu.filters.startingLetterFilter.removeLetter($(this).data('letter'));				
				}else {
					$(this).addClass('selected');					
					arumbu.filters.startingLetterFilter.addLetter($(this).data('letter'));				
				}	
				evt.stopImmediatePropagation();
				evt.preventDefault();				
			});
			
			$(".nameItem").live("tap",function(evt){		
				arumbu.log("Name item clicked :::::::::::::>"+$(this).attr('id'));
				if($(this).hasClass('starredName')) {
					arumbu.unstarName($(this).attr('id'),this,function() {
						$(this).removeClass('starredName');						
						element_theme_refresh($(this).parent().parent().parent(),"e","c");
					});
																
				}else {
					arumbu.starName($(this).attr('id'),this,function() {
						$(this).addClass('starredName');						
						element_theme_refresh($(this).parent().parent().parent(),"c","e");
						
					});
					
				}				
				$.mobile.activePage.page('destroy').page();
				evt.stopImmediatePropagation();
				evt.preventDefault();
			});
			
			$(".starListItem").live("tap",function(evt){
				arumbu.unstarName($(this).attr('id'),this,function() {
					/*$(this).addClass('starredName');*/
					$(this).parent().parent().parent().fadeOut(function() {		
						$.mobile.fixedToolbars.hide();
						$(this).remove();		
						if($("#nameListContainerStarred ul").children().length == 0) {
							$("#nameListContainerStarred ul").html("<li>"+arumbu.phrases.noData+"</li>");
						}
						$("#nameListContainerStarred ul").listview('refresh'); 												
						$.mobile.fixedToolbars.show();
						$.mobile.activePage.page('destroy').page();
					}); 
					
				});
				
				evt.stopImmediatePropagation();
				evt.preventDefault();
			});
			
			//Previous, Next Navigation
			$(".nextPage").live("tap",function(evt){				
				
				arumbu.activeTab.navigateNext();			
				
				if(arumbu.activeTab.currentPage == arumbu.activeTab.totalPages) {
					arumbu.hideNextButton();
				}
				
				arumbu.showPreviousButton();
				arumbu.hideNameList(function() {
					arumbu.showTab(arumbu.activeTab);
				});				
				evt.stopImmediatePropagation();
				evt.preventDefault();
				
			});
			
			$(".previousPage").live("tap",function(evt){
				arumbu.activeTab.navigatePrevious();				
				if(arumbu.activeTab.currentPage == 1) {
					arumbu.hidePreviousButton();
				}
				
				arumbu.showNextButton();
				arumbu.hideNameList(function() {
					arumbu.showTab(arumbu.activeTab);
				});
				
				evt.stopImmediatePropagation();
				evt.preventDefault();
			});
			
			$("#both").trigger("pageshow");
			
		});
		
		
	},	
	
	"clearPaginationText":function(pageId) {
		$("#"+pageId+" .pageDisplay").empty();
	},
	
	"showTab":function(tab) {				
				tab.getDataForPage(function() {
					var len = tab.names.length;	
				
					var op1="<ul data-role='listview' class='nameList' style='opacity:0'>";
					var headerTitle="";
					if(len){													
						for(var i=0;i<len;i++) {
								var nameobj = tab.names[i];										
								op1 +="<li data-icon='star' "+((nameobj.isStarred)?" data-theme = 'e' ":"")+" ><a href='#' id='"+nameobj.id+"' class='nameItem "+((nameobj.isStarred)? "starredName":"")+"'" + "' data-id='"+nameobj.id+"'>"+nameobj.name+"</a></li>";					
						}
						headerTitle += arumbu.phrases.page+" "+tab.currentPage+"/"+tab.totalPages;
						
					}else {
						op1 += "<li>"+arumbu.phrases.noData+"</li>"
						
					}
					op1 += "</ul>"	
			
					$('.ui-page-active .nameListContainer').html(op1);
					$.mobile.activePage.page('destroy').page();
					arumbu.showNameList();					
					
					$('.ui-page-active .pageDisplay').html(headerTitle);	
					if(arumbu.activeTab.currentPage == 1) {
						arumbu.hidePreviousButton();
					}
					
					if(arumbu.activeTab.totalPages == 1){
						arumbu.hidePreviousButton();
						arumbu.hideNextButton();
					}					
				});
				
	},
	
	"hideNameList":function(arg) {
		var sel = '.ui-page-active .nameList';
		var callback = null;
		if(typeof(arg) == "string") {
			sel = "#"+arg+" .nameList";
		}else {
			callback = arg;
		}		
		if($(sel).length>0) {
			$(sel).animate({'opacity':0},'fast',callback);
		}
	},
	
	"showNameList":function(callback) {
		if($('.ui-page-active .nameList').length>0) {
				$('.ui-page-active .nameList').animate({'opacity':1},'fast',callback);
		}
	},	
	
	"showNextButton":function(){
		arumbu.log("show next button :::::::>"+$(".nextPage").hasClass('ui-disabled'));
		$(".nextPage").removeClass('ui-disabled');
	},
	
	"hideNextButton":function() {		
		$(".nextPage").addClass('ui-disabled');
;
	},
	
	"showPreviousButton":function() {	
		$(".previousPage").removeClass('ui-disabled');
	},
	
	"hidePreviousButton":function() {
		$(".previousPage").addClass('ui-disabled');
	},
	
	"jQueryMobileInit":function() {
		//function jQuery Mobile Initialize
		$.extend($.mobile,{
				touchOverflowEnabled:true,
				defaultPageTransition:'fade'
		}); 
		
		$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	},	
	
	"phoneGapInit":function() {
		arumbu.log("phoneGapInit********STARTS");
		if(arumbu.mode == arumbu.DEVELOPMENT) {
			window.localStorage.setItem("isArumbuDbInitializes", "no");
		}
		arumbuDb.initialize();
		arumbu.init();
		arumbu.log("phoneGapInit*******ENDS");		
	},
	
	"desktopInit":function() {
		arumbu.init();
	},
	
	"getRecordCount":function(tab,thisObj,callback) {
		var cb = callback;
		var gender = tab||"";
		var where = "";
		if(gender == "male") {
			where = "WHERE gender='boy'";
		}else if(gender == "female") {
			where = "WHERE gender='girl'";
		}
		
		if(arumbu.filters.startingLetterFilter.query) {
			if(where == "") {
				where = "WHERE";
			}else {
				where += "AND";
			}
			where += " ("+arumbu.filters.startingLetterFilter.query+") ";
		}
		
		var qry = "SELECT COUNT(*) FROM names "+where;		
		
		arumbuDb.query(qry,function(tx,results){
			var totalRecords = results.rows.item(0)["COUNT(*)"];				
			callback.call(arumbu,totalRecords);
		});
		
	},	
	
	"getMaleNames":function(thisObj,callback,limit,offset) {
		//Code Needs Cleanup
		var qry = "SELECT names.id, names.name , names.prefix, starred.name_id as is_starred FROM names LEFT OUTER JOIN starred ON names.id = starred.name_id WHERE names.gender='boy' ";
		
		if(arumbu.filters.startingLetterFilter.query) {
			qry += "AND ("+arumbu.filters.startingLetterFilter.query+") ";
		}
		
		if(limit) {
			qry += "LIMIT "+arumbu.itemsPerPage;
		}	
		
		if(offset) {
			qry += " OFFSET "+offset+" ";
		}
		
		var nameObjectList = [];
		
		arumbuDb.query(qry,function(tx,results){
				var len = results.rows.length;
				for(var i=0;i<len;i++) {
					var rowItem = results.rows.item(i);					
					var nameobj = new NameObj();
					nameobj.id = rowItem.id;
					nameobj.name = rowItem.name;
					nameobj.prefix = rowItem.prefix;
					nameobj.isStarred = (rowItem.is_starred)?true:false;					
					nameObjectList.push(nameobj);
					
				}
				callback.apply(thisObj,[nameObjectList]);
		});
	},
	
	"getBothNames":function(thisObj,callback,limit,offset) {
		//Code Needs Cleanup
		var qry = "SELECT names.id, names.name ,names.prefix, starred.name_id as is_starred FROM names LEFT OUTER JOIN starred ON names.id = starred.name_id ";
		
		if(arumbu.filters.startingLetterFilter.query) {
			qry += "WHERE "+arumbu.filters.startingLetterFilter.query;
		}
		
		if(limit) {
			qry += "LIMIT "+arumbu.itemsPerPage;
		}

		if(offset) {
			qry += " OFFSET "+offset+" ";
		}
		
		var nameObjectList = [];
		
		arumbuDb.query(qry,function(tx,results){
				var len = results.rows.length;	
				
				for(var i=0;i<len;i++) {
					var rowItem = results.rows.item(i);					
					var nameobj = new NameObj();
					nameobj.id = rowItem.id;
					nameobj.name = rowItem.name;					
					nameobj.prefix = rowItem.prefix;
					nameobj.isStarred = (rowItem.is_starred)?true:false;					
					nameObjectList.push(nameobj);
					
				}				
				callback.apply(thisObj,[nameObjectList]);
		});
	},
	
	"getFemaleNames":function(thisObj,callback,limit,offset) {
		//Code Needs Cleanup
		var qry = "SELECT names.id, names.name , names.prefix, starred.name_id as is_starred FROM names LEFT OUTER JOIN starred ON names.id = starred.name_id  WHERE names.gender='girl' ";		
		if(arumbu.filters.startingLetterFilter.query) {
			qry += "AND "+arumbu.filters.startingLetterFilter.query;
		}	
		if(limit) {
			qry += "LIMIT "+arumbu.itemsPerPage;
		}			
		if(offset) {
			qry += " OFFSET "+offset+" ";
		}		
				
		var nameObjectList = [];		
		arumbuDb.query(qry,function(tx,results){
				var len = results.rows.length;				 
				for(var i=0;i<len;i++) {
					var rowItem = results.rows.item(i);					
					var nameobj = new NameObj();
					nameobj.id = rowItem.id;
					nameobj.name = rowItem.name;
					nameobj.prefix = rowItem.prefix;
					nameobj.isStarred = (rowItem.is_starred)?true:false;					
					nameObjectList.push(nameobj);					
				}
				callback.apply(thisObj,[nameObjectList]);
		});
	},
	
	"getStarredNames":function(thisObj,callback,limit,offset) {
		//Code Needs Cleanup
		var qry = "SELECT names.id, names.name , names.prefix, starred.name_id as is_starred FROM names INNER JOIN starred ON names.id = starred.name_id ";			
			
		if(limit) {
			qry += "LIMIT "+arumbu.itemsPerPage;
		}		
		if(offset) {
			qry += " OFFSET "+offset;
		}		
		var nameObjectList = [];		
		arumbuDb.query(qry,function(tx,results){
				var len = results.rows.length;				 
				for(var i=0;i<len;i++) {
					var rowItem = results.rows.item(i);					
					var nameobj = new NameObj();
					nameobj.id = rowItem.id;
					nameobj.name = rowItem.name;
					nameobj.prefix = rowItem.prefix;
					nameobj.isStarred = (rowItem.is_starred)?true:false;					
					nameObjectList.push(nameobj);					
				}
				callback.apply(thisObj,[nameObjectList]);
		});
	},
	
	"starName":function(id,thisObj,callback) {
		var qry = "INSERT INTO starred (name_id) values ("+id+")";	
		arumbuDb.query(qry,function(tx,results){				
				callback.apply(thisObj);
		});
	},
	
	"unstarName" :function(id,thisObj,callback){
		var qry = "DELETE FROM starred where name_id="+id;	
		arumbuDb.query(qry,function(tx,results){				
				callback.apply(thisObj);
		});
	},
	
}

//Database Handling
var arumbuDb = {		
		"dbObj":null,
		
		"query" :function(qry) {
			arumbu.log("arumbuDb executing query:::>"+qry);
			var resultsToReturn = null;
			var _parent = this;
			resultsToReturn = this.dbObj.execute(qry);
			return resultsToReturn;			
		},
		
		"prepare":function() {
			this.dbObj.execute("DROP TABLE IF EXISTS names");
			this.dbObj.execute("DROP TABLE IF EXISTS starred");
			this.dbObj.execute("CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, meaning TEXT, gender TEXT, prefix TEXT)");
			this.dbObj.execute("CREATE TABLE IF NOT EXISTS starred (id INTEGER PRIMARY KEY AUTOINCREMENT, name_id INTEGER)");			
			
		},	
		
		"dbError":function(err) {
			//db error handling
			arumbu.log("Error Opening Database :::>" + err);
		},
		
		"initialize":function() {
			arumbu.log("arumbuDb.initialize********STARTS");
			this.dbObj = Titanium.Database.open("thamizha_arumbu");
			//this.dbObj = window.openDatabase("thamizha_arumbu","1.0","Thamizha's Arumbu",3145728);//3MB	
			//arumbu.log("isArumbuDbInitializes:::::>"+window.localStorage.getItem("isArumbuDbInitializes"));
			
			this.prepare();
			this.initializeData();
			
			arumbu.log("arumbuDb.initialize********ENDS");
		},
		
		"initializeData":function() {
			this.dbObj.execute(arumbuDb.data[i]);
		},
		
		"data": ["INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ì¸¼ø','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ì¸ñ½¢','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ì¸¨½','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ìÌÁÃ¢','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ìÌÂ¢ø','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ì§¸¡¨¾','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡îº¢ÄõÒ','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡î¦ºøÅ¢','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡î§ºö','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡î¦º¡ø','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¾í¨¸','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¾Á¢ú','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¾¡ö','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¾¡¨É','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¾¢Èø','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡òÐ¨½','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò¦¾ýÈø','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡ò§¾Å¢','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¡¦¿È¢','','girl','§¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌ','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸ÓÐ','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸Ãº¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸Ãñ','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸ÕÅ¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸ÄÃ¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¨Ä','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸Æ¸¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸ÆÌ','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¡Æ¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¢¨º','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¢¨Æ','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¢É¢Âû','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡í¸¢É¢Â¡û','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌì¸¼ø','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌì¸É¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌì¸¢Ç¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌìÌÁÃ¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌìÌÂ¢ø','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¸¡íÌî¦ºøÅ¢','','girl','¦¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ôÒÃ¢¨Á ¾Á¢ú ÅÇ÷îº¢ì¸Æ¸ò¾¢üÌÃ¢ÂÐ','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡¿¢Ä¡','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡Á½¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡Á¾¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÁÄ÷','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÓ¾õ','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÓÐ','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÃº¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÃÍ','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÕÅ¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÆ¸¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ÅÆÌ','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡Å¢Æ¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡Å¢É¢Âû','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡Å¢É¢Â¡û','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡¦ÅÆ¢ø','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡¦ÅÆ¢Ä¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡¦ÅÆ¢É¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¡ïº¢','','girl','¸¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢õÒÃ¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Æò¾¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨Ç','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨Ç¦Á¡Æ¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨ÇÂõÁ¡','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨ÇÂÃº¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨ÇÂÆ¸¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨ÇÂ¡û','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢û¨Ç¦ÂÆ¢Ä¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢¦Á¡Æ¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢ÂõÁ¡','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢ÂÃº¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢ÂÆ¸¢','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢Â¡û','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢¨Ç','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢¨½','','girl','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Æ¡ý','','boy','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢ûÇ¢','','boy','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¢Ç¢','','boy','¸¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸£Ãý','','boy','¸£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸£ÃÉ¡÷','','boy','¸£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍ','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍì¸¢Ç¢','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍìÌÂ¢ø','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍîº¢ðÎ','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍôÀ¢¨È','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍôâ¨Å','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌïÍÁÂ¢ø','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊ','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊò¾í¸õ','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊò¾í¨¸','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊ¿¡îº¢','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊôÀ¢Ê','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊôÀ¢¨½','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊôÀ¢û¨Ç','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊôÀ¢¨È','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊÁ½¢','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊÁÄ÷','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊÁ¨Ä','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊÁ¡¨Ä','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÌðÊÁ¡ý','','girl','Ì')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ø','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼øÅÊ×','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼øÅÂø','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼øÅøÄ¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼øÅ¢ÈÄ¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ø¦ÅüÈ¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼Ä½¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ÄÓ¾õ','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ÄÓÐ','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ÄÃº¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ÄÆ¸¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼æÃ¡û','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼¦ÄÆ¢Ä¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼¦Ä¡Ç¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ü¸¢û¨Ç','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ü¸¢Ç¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼üÌÁÃ¢','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼üÌÂ¢ø','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼ü¦¸¡Ê','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ü¼üº¢ðÎ','','girl','Ü')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸û','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ûÅ¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ûÅ¢î¦ºøÅõ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ûÅ¢ÂÈ¢×','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸Ç½¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸Çõ¨Á','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÓÐ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÃº¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÃÍ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÃñ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÆ¸¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇÆÌ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ÇýÒ','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¦ÇÆ¢ø','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¦ÇÆ¢Ä¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸¦Ç¡Ç¢','','girl','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ñ¨Á','','boy','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ñ¨Áì¸¼ø','','boy','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ñ¨Áì¸¾¢÷','','boy','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¸ñ¨Áì¸¡Ã¢','','boy','§¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¨½','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸Äõ','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸Æ¢','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸É¢','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¡ó¾û','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¢¨½','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¢û¨Ç','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¢Ç¢','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ì¸¢¨Ç','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸§¸¡û','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸î¦ºøÅõ','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ò¾¢Õ','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ò¾¢Èø','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ò¾¢Èý','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸òÐ¨½','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ó¦¿È¢','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ô¦À¡Õû','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ô¦À¡¨È','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¸ô¦À¡ý','','girl','¨¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸ðÎ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸ð¼Æ¸¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÒ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÁ½¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÁÂ¢ø','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÁÄ÷','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÁ¨Ä','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÁ¡¨Ä','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀ½¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀõ¨Á','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÓ¾õ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÓÐ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÃº¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÃÍ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÃñ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÅ¡½¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÆ¸¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀÆÌ','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀý¨É','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¸¼õÀ¢','','girl','¸')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨½','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Ä','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äì¸É¢','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äì¸¢Ç¢','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨ÄìÌÂ¢ø','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äì¦¸¡Ê','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äîº¢ðÎ','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨ÄîÍ¨É','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äî¦ºÊ','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äî¦ºøÅ¢','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò¾Á¢ú','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò¾¨Æ','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò¾¢Õ','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò¦¾ýÈø','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò§¾ý','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Äò§¾¡¨¸','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Ä¿¨¸','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Ä¿í¨¸','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Ä¿ýÉ¢','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¡¨Ä¿¢Ä×','','girl','§º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡Ã¢¾ø','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡Ã¢¸¨½','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡ø','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄ½¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÓ¾õ','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÓÐ','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÃº¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÃ¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÕÅ¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÆ¸¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄÈ¢×','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄ¡Æ¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄ¡üÈø','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÄ¢ýÀõ','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡ø¦ÄÆ¢Ä¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡ø§Äó¾¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡ø§Ä¡Å¢Âõ','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÅÊ×','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÅøÄ¡û','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦º¡øÅøÄ¢','','girl','¦º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡Åïº¡û','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡Å¢Ä¡û','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡óÐ','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾½¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾õ','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾Ã¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾ÅøÄ¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾Æ¸¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾ÆÌ','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾¢É¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ó¾¢É¢Â¡û','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡óÐì¸Äõ','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡Ãø','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ÃøÅÊ×','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ÃøÅÂø','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ÃøÅøÄ¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ÃøÅûÇ¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡ÃøÅ¡½¢','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¡Ãø§Åö','','girl','º¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ðÎ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ð¼õÁ¡','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ð¼Æ¸¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ð¼ÆÌ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ðÎìÌÕÅ¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ð¦¼Æ¢ø','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ð¦¼Æ¢Ä¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÒ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀ½¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀõ¨Á','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÃº¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÃÍ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÃñ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÃ¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÕÅ¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÆ¸¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀÆÌ','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÀ¢¨º','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÒî¦ºøÅ¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º¢ÄõÒÁ½¢','','girl','º¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¼ø','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸ñ½¢','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸ñÏ','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¨½','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸Âõ','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸Âø','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸Äõ','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¨Ä','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸Æø','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸ÆÉ¢','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¨Æ','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸É¢','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¡','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¡ïº¢','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¡ó¾û','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¡Éø','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¢¨½','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¢û¨Ç','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('º£÷ì¸¢Ç¢','','girl','º£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸ñ½¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¨½','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸Äõ','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¨Ä','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸Æø','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸ÆÉ¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸Éø','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸É¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¡','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¡ïº¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¡ó¾û','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¡Éø','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¢û¨Ç','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¸¢Ç¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ìÌÁÃ¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ìÌ¨Æ','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ìÌÈ¢ïº¢','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¦¸¡ØóÐ','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Í¼÷ì¦¸¡ý¨È','','girl','Í')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝÐ','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ý¾¢Ä¡û','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸¼ø','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸¨½','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸¨Ä','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸Æø','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸ÆÉ¢','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¸Éø','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¦¸¡ý¨È','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú§¸¡¨¾','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýúº¢ÄõÒ','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÍ¼÷','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¦¾¡¨¼','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÒ¸ú','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÒÄ¨Á','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÒÉø','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ýú¦À¡Æ¢ø','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÁÕ¾õ','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÝúÅ¡Ã¢','','girl','Ý')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºÊ','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºÊòÐÇº¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºÊôÀ¸ý¨È','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢ø','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅÊ×','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅÂø','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅøÄ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅûÇ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¨Ç','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¡¨¸','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¡½¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¡Ã¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¡Æ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¢ÇìÌ','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¢Èø','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ¢ÈÄ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢øÅ£','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢ø¦ÅüÈ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢ø§Åí¨¸','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ºó¾¢ø§ÅÃ¢','','girl','¦º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§º¾¡','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºó¾¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºó¾¢É¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÂ¢¨Æ','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºö','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃý','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃì¸¾¢÷','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃì¸É¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃì¸¢û¨Ç','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃì¸¢Ç¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃìÌÊÁ¸û','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃìÌÁÃ¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃìÌÂ¢ø','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃîº¢ÄõÒ','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃîÍ¼÷','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃî¦ºøÅ¢','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃî§ºö','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃò¾í¸õ','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ºÃò¾í¨¸','','girl','§º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌ','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸½¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸Æ¸¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸ÆÌ','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸¡Æ¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸¢¨º','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸¢¨Æ','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸¢¨ÆÂ¡û','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¸¢É¢Â¡û','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌì¸¼ø','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÁ½¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÓòÐ','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌ¦Á¡ðÎ','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÅÊ×','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÅÂø','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÅ¨Ç','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÌÅ¡Ã¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºíÜÃ¡û','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¦¸Æ¢ø','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ºí¦¸Æ¢Ä¢','','girl','º')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Â¢Ú','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Â¢üÚì¸¾¢÷','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Â¢üÚì¸Éø','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äõ','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸¼ø','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸ñ½¢','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸¾¢÷','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸¨Ä','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸É¢','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¸¢Ç¢','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡ÄìÌÂ¢ø','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äì¦¸¡Ê','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡ÄîÍ¼÷','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äî¦ºøÅ¢','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äî§º¡¨Ä','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äò¾Á¢ú','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äò¾¨ÄÅ¢','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äò¾¡ö','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äò¾¢Õ','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('»¡Äò¾¢Èø','','girl','»¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('½¢ÂÆÌ','','girl','½¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ªÇ¢Âý','','boy','¦¾ª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ªÇ¢Â¡ý','','boy','¦¾ª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ª¦Ç¡Ç¢','','boy','¦¾ª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ª¦Ç¡Ç¢Âý','','boy','¦¾ª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¾ÂÄÃ¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸¿øÄ¡û','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸ÁÂ¢ø','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸Á¡ÁÂ¢ø','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸Â½¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸ÂÆ¸¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸Â¡û','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸¦ÂÆ¢Ä¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸§Â¡¾¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸ÅÊ×','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡¨¸Å¡½¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡ú','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡Æ¢','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡û','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡ñÁí¨¸','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡ñÁ¼ó¨¾','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡ñÁ¨Ä','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡ñÁ¡¨Ä','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾¡½í¨¸','','girl','§¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Ê','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Êì¸ñ½¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Êì¸¢Ç¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Êì¨¸Âû','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Êî¦ºøÅ¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Ê¿í¨¸','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡Ê¿øÄ¡û','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊôÀ10¨Å','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÁ¸û','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÁí¨¸','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÁ¼ó¨¾','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÁ½¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÁÂ¢ø','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÓòÐ','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂ½¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂõ¨Á','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂÆ¸¢','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂ¡û','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂ¢¨Æ','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾¡ÊÂ¢¨ÆÂ¡û','','girl','¦¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡ö','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ã','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸ñ½¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸Âõ','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸Æø','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸ÆÉ¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸É¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¸¢Ç¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨ÃìÌÇò¾û','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì¦¸¡Ê','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãì§¸¡¨¾','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãîº¢ÅôÀ¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨ÃîÍ¨É','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãî¦ºøÅõ','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãî¦ºøÅ¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãî§ºó¾¢','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãî§ºö','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãî§º¡¨Ä','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãò¾í¸õ','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¡Á¨Ãò¾í¨¸','','girl','¾¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¼ø','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸ñ½¢','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¨½','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¾¢÷','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸Âõ','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸Âø','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¨Ã','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸Äõ','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸ÆÉ¢','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸Æ¢','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¨Æ','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸Éø','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸É¢','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¡','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¡ïº¢','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¡ó¾û','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¡Éø','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¢¨½','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¢¸ú¸¢û¨Ç','','girl','¾¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ì¸¼ø','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ì¸¨½','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ì¸¾¢÷','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ì¸Éø','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ì¦¸¡ØóÐ','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£îÍ¼÷','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ò¾½ø','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£¿¢Ä×','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Áí¨¸','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Á¼ó¨¾','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Á¨Ä','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Á¢ýÉø','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Âõ¨Á','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ÂÃº¢','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£ÂÃñ','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Âý¨É','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£Â¡Æ¢','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£¦ÂÃ¢','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾£§Âó¾¢','','girl','¾£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð¸¢÷','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊ','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊìÌÃø','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊôÀñ','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊÁ¢ýÉø','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊÓÃÍ','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊÂ¢¨º','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊÂ¢¨¼','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊ§Âó¾¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÐÊ¦Â¡Ä¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢×','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢Åõ¨Á','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢ÅÃº¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢ÅÃñ','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢ÅÆ¸¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢Å¡üÈø','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢×ìÌÁÃ¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢×î¦ºøÅ¢','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢×ò¾¢Èø','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ð½¢×¿í¨¸','','girl','Ð')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àö¨Á','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÁ½¢','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¼ø','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¨½','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¾¢÷','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸Âõ','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸Äõ','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¨Ä','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸Æø','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸ÆÉ¢','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¨Æ','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸É¢','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¸¢Ç¢','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂÌÂ¢ø','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂÌÆø','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¦¸¡Ê','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ¦¸¡¨¼','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂ§¸¡¨¾','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂº¡Ãø','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('àÂº¢ðÎ','','girl','à')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¨Á','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¸¼ø','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¸¾¢÷','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¸Âõ','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¸¨Ã','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÌÃø','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÌÇò¾û','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÍ¼÷','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÍ¨É','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¦º¡ø','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ½¨¸','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ½¢Ä×','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ½¢Ä¡','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¦½ïºû','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¦½È¢','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÒÉø','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¦À¡Õ¨¿','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÁ½¢','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñÁ¾¢','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¾ñ¦Á¡Æ¢','','girl','¦¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾õ','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸¼ø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸ñ½¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸Âõ','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸Âø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸Äõ','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸¨Ä','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸ÆÉ¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸É¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸¡ïº¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸¡ó¾û','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¸¢Ç¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÂ¢ø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÃø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÅ¨Ç','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÆø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÆÄ¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÌÈ¢ïº¢','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾íÜó¾ø','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¾í¦¸¡Ê','','girl','§¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨¾Âø','','girl','¨¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸×','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Å½¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅõÁ¡','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Åõ¨Á','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÓÐ','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÃº¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÃÍ','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÃñ','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÃ¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÕÅ¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅøÄ¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÄÃ¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÆ¸¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÆÌ','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅÈ¢×','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸ÅýÒ','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Åý¨É','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Å¡õÀø','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Å¡Æ¢','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¾¸Å¡û','','girl','¾')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢','','girl','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì¸ñ½ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì¸¾¢÷','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì¸¡¼ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì¸¡ÅÄý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì¸¢Æ¡ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ìÌÁÃý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ìÌýÈý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ìÜò¾ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì§¸¡¼ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì§¸¡¨¾','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì§¸¡Á¡ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ì§¸¡ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢î¦ºõÁø','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢î¦ºøÅý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ò¾í¸ý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ò¾õÀ¢','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢òÐ¨Ã','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¡îº¢ò§¾Åý','','boy','¦¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡¿øÄû','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡§¿Ã¢Âû','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡ôÒÄ¨Á','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¸û','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Áí¨¸','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¼ó¨¾','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á½¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¾¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡ÁÂ¢ø','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡ÁÄ÷','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¨Æ','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¨È','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Á¡¨Ä','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Ó¸¢Ä¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡ÓòÐ','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Ó¾øÅ¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡Ó¾Ä¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡ÓÃÍ','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¡¦Á¡Æ¢','','girl','¿¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢¸÷','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢¸Ã¢Ä¡û','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äõ','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äì¸É¢','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äî¦ºøÅ¢','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äò¾¡Á¨Ã','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äò¾¡ö','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Ä¿í¨¸','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Ä¿øÄ¡û','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄôÒ¸ú','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄôÒÐ¨Á','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äôâ','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢Äô¦À¡¨È','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÁ¸û','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÁí¨¸','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÁ¼ó¨¾','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÁ½¢','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÁ¨Ä','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÅÓ¾õ','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¢ÄÅÓÐ','','girl','¿¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷(¨Á','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Á','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áì¸¼ø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áì¸¨Ä','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áì¸Æø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áì¸É¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áì¸¢Ç¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÁÃ¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÂ¢ø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÃø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÆø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÆÄ¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÌÈ¢ïº¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÜ¼ø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨ÁìÜó¾ø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áî¦ºøÅõ','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áî¦ºøÅ¢','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áî§ºö','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áò¾¢Õ','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿£÷¨Áò¾¢Èø','','girl','¿£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÑÚíÌÆÄ¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ø','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾øÅ¢Æ¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾Ä½¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ÄÆ¸¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾¦ÄÆ¢Ä¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ü¸ñ½¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ü¦À¡ðÎ','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ýÁ½¢','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ñ¾ýÁ¡¨Ä','','girl','Ñ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¸É¢','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¸¢Ç¢','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÌÂ¢ø','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÌÆø','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÌÆÄ¢','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÜó¾ø','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¦¸¡Ê','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¦¸¡õÒ','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¦¸¡ØóÐ','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú§¸¡¨¾','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¦º¡ø','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¦¾¡¨¼','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¿¨¸','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢ú¿¢Ä¡','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÀÆõ','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÀ¢¨½','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÀ10¨Å','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÁ¾¢','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦¿¸¢úÁÂ¢ø','','girl','¦¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âõ','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸¼ø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸ñ½¢','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸¾¢÷','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸Âõ','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸Äõ','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸¨Ä','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸Æø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¸¢Ç¢','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂìÌÂ¢ø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂìÌÃø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂìÜ¼ø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âì¦¸¡¨¼','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂîÍ¼÷','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂîÍÃÀ¢','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿ÂîÍ¨É','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âî¦ºøÅ¢','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âî§ºö','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âî¦º¡ø','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§¿Âî§º¡¨Ä','','girl','§¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿Ì','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿Ì¸ñ½¢','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸ñ½¢','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸¾¢÷','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸Äõ','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸¨Ä','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸¢û¨Ç','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¸¢Ç¢','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ìÌÂ¢ø','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ìÌÃø','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ìÌ¨Å','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ì¦¸¡Ê','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸îº¢ÄõÒ','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸î¦ºøÅ¢','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸ò§¾Å¢','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸¿í¨¸','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸¿øÄ¡û','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸¿¢Ä×','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¿¨¸¿¢Ä¡','','girl','¿')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¼ø','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸ñ½¢','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¨½','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¾¢÷','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸Äõ','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¨Ä','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸Éø','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸É¢','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¢¨½','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¢û¨Ç','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¸¢Ç¢','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ìÌÁÃ¢','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ìÌÂ¢ø','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ìÌÃø','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ì¦¸¡Ê','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷îº¢ÄõÒ','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ò¾¨ÄÅ¢','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ò¾¡¨É','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§À¡÷ò¾¢Õ','','girl','§À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡üÈô§À¡÷','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡ðÎ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸ñÏ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¾¢÷','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸Âõ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸ÆÉ¢','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¨Æ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸É¢','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¡','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¡Î','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¢û¨Ç','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¸¢Ç¢','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ìÌÁÃ¢','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ìÌÂ¢ø','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ìÌÈ¢ïº¢','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ìÌýÈõ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¦¸¡Ê','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì¦¸¡ØóÐ','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦À¡¾¢¨¸ì§¸¡¨¾','','girl','¦À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸¼ø','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸¨½','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸¨Ä','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸É¢','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸¢û¨Ç','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì¸¢Ç¢','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÌðÊ','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÌÊÁ¸û','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÌÁÃ¢','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÌÂ¢ø','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÌÃø','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ìÜ¼ø','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ì§¸¡¨¾','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡îº¢ÄõÒ','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡î¦ºøÅõ','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡î¦ºøÅ¢','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡î¦º¡ø','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ò¾í¸õ','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¡ò¾Á¢ú','','girl','À¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢îº¢','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢Ê','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨½','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢Ã¡ðÊ','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢û¨Ç','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨È','','girl','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢ò¾ý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢û¨Ç','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢û¨Çî¦ºøÅý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨È','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨Èì¸¾¢÷','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨ÈìÌðÊ','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨Èî¦ºøÅý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨ÈÝÊ','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨Èò§¾Åý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨ÈÁ¾¢','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨ÈÂÆ¸ý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨ÈÂ¡Çý','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨È§Âó¾¢','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¢¨È¦Â¡Ç¢','','boy','À¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼½¢','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼õ¨Á','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼Ãº¢','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼Ãñ','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼Æ¸¢','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼È¢×','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼¡Æ¢','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼¡û','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£¼¡üÈø','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Ê¨º','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£ÊýÀõ','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£ÊÉ¢','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£ÊÉ¢Â¡û','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î¨¼Â¡û','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£ÎÕ','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î¿¨¸','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î¿í¨¸','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î¿¨¼','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À£Î¿øÄ¡û','','girl','À£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸ú','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¨½','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÒÐ¨Á','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÒÄ¨Á','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÒÄ¢','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Òý¨É','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÒÉø','','girl','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸ø','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸øÅñ½ý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸øÅÇò¾ý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸øÅÇÅý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸øÅ¡½ý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸øÅ¢ÇõÀ¢','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸ÄÓ¾ý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸ÄÃºý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸Ä¢ýÀý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸Ä¢É¢Âý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸æÃý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸¦ÄÆ¢Äý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ò¸¦ÄÆ¢§Ä¡ý','','boy','Ò')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â¨Å','','girl','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âí¸ñ½ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âí¸ÆÄý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âí¸Æ§Ä¡ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âíÌýÈý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âï§º¡¨ÄÂý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âó¾¡Ãý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âó¾¡§Ã¡ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âó¦¾ýÈø','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â¿õÀ¢','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â¿¡¼ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â¦¿ïºý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('â§¿Âý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âõ¦À¡Æ¢ø¿õÀ¢','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âõ¦À¡Æ¢Äý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âÅñ½ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âÅÃºý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âÅÆ¸ý','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('âÅÆÌ','','boy','â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Àñ','','girl','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀñÎ','','girl','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕ¨Á','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢Âñ½ø','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢Âñ½ý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢Â¾õÀ¢','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢Â¿õÀ¢','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢ÂÅý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÃ¢Âý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí¸¼ø','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí¸ñ½ý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí¸¨Ä»ý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí¸¢ûÇ¢','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí¸£Ãý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕíÌÁÃý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕíÌÃ¢º¢ø','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕíÌýÈý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí§¸ûÅý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí§¸¡','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÀÕí§¸¡Á¡ý','','boy','¦À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÓ¾ý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÃºý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÃÍ','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÕÅ¢','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÕÇý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÕÇ¡Çý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÆ¸ý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÈ§Å¡ý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÈ¢»ý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÈ¢Åý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃÈ¢×','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃýÀý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃýÒ','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¡Âý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¡Æ¢','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¡Çý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¡üÈø','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¢ýÀõ','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÀÃ¢ýÀý','','boy','§À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨À','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí§¸¡¼ý','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àõ¦À¡Æ¢ø','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àó¾Á¢ú','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àó¾Á¢ÆÃÍ','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àó¾Á¢Æý','','boy','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨À','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸ñ½¢','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¨½','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¾¢÷','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸Âõ','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸Âø','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸Äõ','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¨Ä','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸Æø','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸ÆÉ¢','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¨Æ','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸É¢','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¡','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Àí¸¡ïº¢','','girl','¨À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ø','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅÊ×','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅ¡Éõ','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅ¢Æ¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅ¢Èø','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅ¢ÈÄ¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸øÅ£','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ø§Åø','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸Ä½¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄõÁ¡','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄõÁ¡û','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸Äõ¨Á','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÓ¾õ','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÓÐ','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÃº¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÃÍ','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÃ¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÕÅ¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÆ¸¢','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('À¸ÄÆÌ','','girl','À')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅø','','girl','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅø','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅæÃý','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅ¦Ä¡Ç¢','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅü¸¡¼ý','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅü§¸¡¨¾','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅü§º¡¨Ä','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅü§º¡¨ÄÂý','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅüÀ¢ò¾ý','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁªÅü¦À¡Æ¢Äý','','boy','¦Áª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡Ð','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¾½¢','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¾Ã¢','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¾ÕÅ¢','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¾¨Ä','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¾¡Æ¢','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡Ð¸Äõ','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡ÐÀ¨¼','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡ÐÒÄ¢','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡¨É','','girl','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡º¢¸£ÃÉ¡÷','','boy','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡º¢¦¸¡üÈÉ¡÷','','boy','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡º¢Â¡÷','','boy','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Á¡Í¸£Ãý','','boy','§Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡ðÎ','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸¼ø','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸¾¢÷','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸Äõ','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸¨Ä','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸É¢','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸¢û¨Ç','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ì¸¢Ç¢','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ìÌðÊ','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ìÌÂ¢ø','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢îÍ¼÷','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢î¦ºøÅ¢','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ò¾¡ö','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ò¾¢Õ','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ò¾¢Èø','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢òÐ¨½','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢òÐ¨È','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ò¦¾ýÈø','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Á¡Æ¢ò§¾Å¢','','girl','¦Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡§¾Å¢','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡Ð¨Ç','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡ÁÉ¢','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡Á¾¢','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡ÁÂ¢ø','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡Ã¢','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡¨Ä','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡ý','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡Éõ','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡É¢','','girl','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡ì¸¼ø','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡ì¸¾¢÷','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡îÍ¼÷','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡îÍ¼§Ã¡ý','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡¿õÀ¢','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡¿¡¼ý','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡¿¢ÄÅý','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡§¿Âý','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¡Á¸ý','','boy','Á¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸ñ½¢','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸¨½','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸¾¢÷','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸Äõ','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸¨Ä','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¸¢Ç¢','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÌÂ¢ø','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÌ¨Æ','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¦¸¡Ê','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý§¸¡¨¾','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýº¢ÄõÒ','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÍ¼÷','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¦ºøÅ¢','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÀ¢¨È','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýâ¨Å','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¦À¡ðÎ','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ý¦À¡ýÉ¢','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÁ¸û','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¢ýÁí¨¸','','girl','Á¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£û','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£û¸¨½','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£û¸Äõ','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¸¼ø','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¸ñ½¢','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¸ñÏ','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¸Âõ','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¸Âø','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÌ¨Å','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÌÇò¾û','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¦¸¡Ê','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÍ¼÷','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ý¦ºøÅ¢','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÀ¨¼','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÒÉø','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÁ¸û','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÁí¨¸','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÁ¼ó¨¾','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á£ýÅÊ×','','girl','Á£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ø','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢øÅÊ×','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢øÅøÄ¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢øÅ¡½¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢øÅ¡Éõ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢øÅ¢Æ¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Ä½¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄõÁ¡','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Äõ¨Á','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÓ¾õ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÓÐ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÃº¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÃÍ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÃñ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Ä¨Ä','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÆ¸¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢ÄÆÌ','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Ä¡û','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Ä¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ó¸¢Ä¢É¢','','girl','Ó')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ã','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãÅÃñ','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ì¸É¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ì¸¢Ç¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ìÌÁÃ¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ìÌÂ¢ø','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ìÌÇò¾û','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ì¦¸¡Ê','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ì§¸¡¨¾','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷î¦ºøÅ¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ò§¾Å¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ò§¾¡¨¸','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷¿í¨¸','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ôÀ¢¨½','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ô¦ÀñÎ','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷ô¦À¡ýÉ¢','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷Á¸û','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷Áí¨¸','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ãà÷Á¼ó¨¾','','girl','ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áö','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¼ø','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸ñ½¢','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸ñÏ','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¨½','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¾¢÷','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸Äõ','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¨Ä','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸Æø','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸É¢','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¢û¨Ç','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¸¢Ç¢','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁöìÌÊ','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁöìÌÊÁ¸û','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁöìÌÁÃ¢','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁöìÌÂ¢ø','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÁöìÌÃø','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì¦¸¡Ê','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöì§¸¡¨¾','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Áöîº¢ÄõÒ','','girl','¦Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁÎ','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Áð¼Ãñ','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎì¸¢Ç¢','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎìÌÊÁ¸û','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎìÌÂ¢ø','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎìÌÇò¾û','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎî¦ºøÅ¢','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎòÐ¨È','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎò§¾¡¨¸','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎôÀ¡Ê','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎôâ¨Å','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁ¸û','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁí¨¸','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁ¼ó¨¾','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁ½¢','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁÂ¢ø','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁÕ¾õ','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁÄ÷','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁ¨Ä','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§ÁðÎÁ¨ÄÂû','','girl','§Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Á','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Áì¸¼ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Áì¸ñ½¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Áì¸¢Ç¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁìÌÂ¢ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁìÌÆø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁìÌÆÄ¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁìÌýÈõ','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁìÜó¾ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Áì¦¸¡Ê','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Áó¦¿ö¾ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁôÀ¢Ê','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÁ½¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÁÂ¢ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÁÄ÷','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÁ¨Ä','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÓ¸¢ø','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁõÓ¸¢Ä¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁÅÊ×','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨ÁÅøÄ¢','','girl','¨Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸û','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸ñ½¢','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸ñÏ','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¨½','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¾¢÷','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸Âõ','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸Âø','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸Äõ','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¨Ä','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸Æø','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸ÆÉ¢','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¨Æ','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸É¢','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¡Î','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¢û¨Ç','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢ú¸¢Ç¢','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢úÌÁÃ¢','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢úÌÂ¢ø','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Á¸¢úÌÃø','','girl','Á')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ì¸Äõ','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ì¸¨Ä','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ì¸É¢','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷î¦ºøÅõ','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷î¦ºøÅ¢','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷¿í¨¸','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷¿¢Ä×','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷¿¢Ä¡','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷¦¿È¢','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á¸û','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Áí¨¸','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á¼ó¨¾','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á½õ','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á½¢','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á¾¢','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ÁÂ¢ø','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ÁÕ¾õ','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷ÁÄ÷','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¡½÷Á¨Ä','','girl','Â¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Â¦½¦ÃÆ¢Ä¢','','girl','Â')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ã¡\ˆ','','boy','Ã¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Ã¡Â÷','','boy','Ã¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('ÃÅ¢','','boy','Ã')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅÃ¢','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅ¨Ä','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅ¡¨¼','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅ¡Ã¢','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅ¡Æ¢','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅªÅ¢Èø','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åª§Åø','','girl','¦Åª')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Å¡íÌ§Å§Ä¡ý','','boy','§Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ã','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãì¸É¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãì¸¢Ç¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃìÌÁÃ¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃìÌÂ¢ø','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãì¦¸¡Ê','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãì§¸¡¨¾','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃîÍ¼÷','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãî¦ºøÅ¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãò¾í¸õ','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãò¾í¨¸','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãò§¾Å¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãò§¾¡¨¸','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ã¿í¨¸','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ã¿¢Ä×','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ã¿¢Ä¡','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃôÀ¢Ê','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃôÀ¢¨½','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨Ãô¦À¡ýÉ¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¡¸¨ÃÁ½¢','','girl','Å¡')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂø','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂøÅÊ×','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂøÅ¡Éõ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂøÅ¢ÇìÌ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂø¦ÅûÇ¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄ½¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄõ¨Á','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄÓÐ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄÃº¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄÆ¸¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄÆÌ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄ¡û','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄ¢¨º','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄ¢ýÀõ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÄ¢É¢Âû','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂÖÕ','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂ¦ÄÆ¢ø','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂ¦ÄÆ¢Ä¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂ¦Ä¡Ç¢','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å¢ÊÂü¸¾¢÷','','girl','Å¢')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãõ','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸¼ø','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸¨½','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸Äõ','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸¨Ä','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸Æø','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸Éø','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸É¢','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¸¢Ç¢','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£ÃìÌðÊ','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£ÃìÌÂ¢ø','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãì¦¸¡Ê','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãîº¢ÄõÒ','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£ÃîÍ¼÷','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãî¦ºøÅ¢','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãò¾Á¢ú','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãò¾¡ö','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãò¾¡¨É','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ãò§¾Å¢','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Å£Ã¿í¨¸','','girl','Å£')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åðº¢','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åñ¨Á','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÍ¼÷','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÍ¨É','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åñ¼¡Á¨Ã','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÊí¸û','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åñ½¢Ä×','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åñ½¢Ä¡','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÀÉ¢','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÀ¢¨È','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÁ½¢','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÁ¾¢','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÓ¸¢ø','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÓ¨¸','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÓòÐ','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÓø¨Ä','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅñÓÚÅø','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦Åñ¦Á¡ðÎ','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅûÅ¨Ç','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¦ÅûÅ¡Éõ','','girl','¦Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ì¦¸¡Ê','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸îº¡Ãø','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸î¦ºøÅ¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ò¾¢Èø','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸¿øÄ¡û','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ôÀ¨¼','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ôÒÄ¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ôâ','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Á¸û','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Á½¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ÁÄ÷','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Á¨Ä','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ÓòÐ','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Â½¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ÂõÁ¡','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ÂÃº¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸ÂÆ¸¢','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Â¡û','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('§Åí¨¸Â¡üÈø','','girl','§Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨È','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èì¸¾¢÷','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èì¸¢Ç¢','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈìÌÂ¢ø','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈîÍ¼÷','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èî¦ºøÅ¢','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èò¾¡Á¨Ã','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èò¦¾ýÈø','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èò§¾Å¢','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨È¿í¨¸','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈôÀ¸ø','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈôÀñ','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈôÀÃ¢¾¢','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨Èôâ','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁ¸û','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁí¨¸','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁ¼ó¨¾','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁ½¢','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁÂ¢ø','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¨Å¸¨ÈÁÄ÷','','girl','¨Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ì¸É¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ì¸¢Ç¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ìÌÂ¢ø','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ì¦¸¡Ê','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ì¦¸¡ØóÐ','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢¿øÄ¡û','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Á½¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Á¾¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÁÂ¢ø','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Á¡¨Ä','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Á¡ý','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Ó¨¸','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÓòÐ','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Óø¨Ä','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢Â½¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÂõÁ¡','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÂÓÐ','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÂÃº¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('Åïº¢ÂÆ¸¢','','girl','Å')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¼ø','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸ñ½¢','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸ñÏ','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¨½','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¾¢÷','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¨Ä','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸Éø','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸É¢','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¢û¨Ç','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¸¢Ç¢','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ìÌÂ¢ø','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¦¸¡Ê','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¦¸¡ØóÐ','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì¦¸¡ý¨È','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸ì§¸¡¨¾','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸îº¡óÐ','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸îº¢ðÎ','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸îÍ¼÷','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸îÍÃÀ¢','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('«¸îÍ¨É','','girl','«')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨º','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºì¸ñ½¢','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºì¸ñÏ','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºì¸É¢','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºì¸¢Ç¢','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºìÌÂ¢ø','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºìÌÃø','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºìÌÆø','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºì¦¸¡Ê','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºîº¢ðÎ','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºî¦ºøÅ¢','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò¾í¸õ','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò¾í¨¸','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò¾Á¢ú','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò¾¡ö','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò¾¢Õ','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºò§¾ý','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨º¿¢Ä×','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨º¿¢Ä¡','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¬¨ºôÀÆõ','','girl','¬')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨º','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨¼','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þò¾¢','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨Á','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨Æ','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨ÆÂ¡û','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¨ÈÅ¢','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þýÀõ','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þÉ¢','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þÉ¢Âû','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þÉ¢Â¡û','','girl','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸ø','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸øÅØ¾¢','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸øÅÇÅý','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸øÅ¡½ý','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸øÅ£Ãý','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸ø¦ÅüÀý','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸ø§Åí¨¸','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸ÄÃºý','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('þ¸Ä¡Æ¢','','boy','þ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸õ','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¸¼ø','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¸¾¢÷','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¸Éø','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¸¢Ç¢','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ìÌÂ¢ø','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¦¸¡Ê','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ì¦¸¡ØóÐ','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸îº¢ðÎ','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸îÍ¼÷','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸îÍ¨É','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸î¦ºøÅ¢','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¿í¨¸','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¿¡îº¢','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¿¢Ä×','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¿¢Ä¡','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¦¿ïºû','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸¦¿È¢','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ôÒ¸ú','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('®¸ôÒ¨½','','girl','®')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯¨¼Â¡û','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷×','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷Åõ¨Á','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷ÅÃº¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷Å¡Æ¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷Å¢ýÀõ','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷Å¢É¢Â¡û','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷¦ÅÃ¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯½÷¦Å¡Ç¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Â¢÷','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Â¢¦Ã¡Ç¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Â¢§Ã¡Å¢Âõ','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ã×','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ã×¨¼Â¡û','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸õ','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸õ¨Á','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸Á½¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸ÁÄ÷','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸Á¡§¾Å¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('¯Ä¸Á¡Á½¢','','girl','¯')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°ì¸õ','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°ì¸Á¸û','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°ì¸Á½¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°÷','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Ã½¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Ãõ¨Á','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°ÃÓÐ','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°ÃÆ¸¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Ã¡û','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Õ½¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°¦ÃÆ¢ø','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°¦Ã¡Ç¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢ì¸¼ø','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢îÍ¼÷','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢î¦ºøÅ¢','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢ò¾¢Èø','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢ò¾£','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°Æ¢ÓòÐ','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('°üÚ','','girl','°')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±¸¢Éõ','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ¸¼ø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñÍ¼÷','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ½È¢×','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ½¡Æ¢','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ½¡üÈø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ¦½¡Ç¢','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñ§½¡Å¢Âõ','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñÅøÄ¡û','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±ñÅøÄ¢','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Â¢É¢','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢¸¨½','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢¸¾¢÷','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢¸Éø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢Í¼÷','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢¾½ø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢¾Æø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('±Ã¢À¸ø','','girl','±')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²óÐ¾ø','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²ó¾¢¨Æ','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²ó¾¢¨ÆÂ¡û','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²ó¦¾Æ¢ø','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²ó¦¾Æ¢Ä¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²ó¦¾Æ¢É¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷ì¸ñ½¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷ì¦¸¡Ê','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷îº¢ÄõÒ','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷î¦ºøÅ¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷¿í¨¸','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷ôÀÃ¢¾¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷Á¸û','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷Áí¨¸','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷Á¼ó¨¾','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷Á½¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷Á¾¢','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷ÁÂ¢ø','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('²÷ÁÕ¾õ','','girl','²')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ø','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ÄÕÅ¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ÄÆ¸¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ÄÆÌ','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡¦ÄÆ¢ø','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡¦ÄÆ¢Ä¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡¦ÄÆ¢É¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ü¸¼ø','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ü¦ºøÅõ','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³õÀ¡ü¦ºøÅ¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³ÂÅ¢','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³¨Â','','girl','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸¼ø','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸¨Ã','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸¡Ã¢','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸¢Æ¡ý','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸¢ûÇ¢','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³Âý¸£Ãý','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('³ÂýÌÁÃý','','boy','³')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ÕÅ¨¸ÁÃõ','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¨Á','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¼ø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸ñ½¢','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¨½','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¾¢÷','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸Âø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸Äõ','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¨Ä','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸ÆÉ¢','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸Éø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸É¢','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¡ïº¢','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¡ó¾û','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¡Éø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¢¨½','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¢û¨Ç','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñ¸¢Ç¢','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñÌÂ¢ø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('´ñÌÃø','','girl','´')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨º','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºì¸¼ø','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºîº¢ÄõÒ','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÁ½¢','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÂÕÅ¢','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÂÆ¸¢','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÂ¡ú','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÂ¢ýÀõ','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨ºÂ¢É¢Â¡û','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨¼','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨¼Ñ¾ø','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µ¨¼Â½¢','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅì¸¨Ä','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅîÍ¼÷','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅî¦ºøÅõ','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅî¦ºøÅ¢','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅî§º¡¨Ä','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅò¾¨¸','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅò¾¢Èø','','girl','µ')",
	"INSERT INTO names (name,meaning,gender,prefix) VALUES ('µÅò§¾Å¢','','girl','µ')"
	]		
}
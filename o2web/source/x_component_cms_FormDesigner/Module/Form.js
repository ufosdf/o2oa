MWF.xApplication.cms.FormDesigner.Module = MWF.xApplication.cms.FormDesigner.Module || {};
MWF.xDesktop.requireApp("process.FormDesigner", "Module.Form", null, false);
MWF.xDesktop.requireApp("cms.FormDesigner", "Property", null, false);
MWF.xApplication.cms.FormDesigner.Module.Form = MWF.CMSFCForm = new Class({
	Extends: MWF.FCForm,
	options: {
		"style": "default",
		"propertyPath": "../x_component_cms_FormDesigner/Module/Form/form.html",
		"mode": "PC",
		"fields": ["Calendar", "Checkbox", "Datagrid", "Datagrid$Title", "Datagrid$Data", "Datatable", "Datatable$Title", "Datatable$Data",
			"Datatemplate", "Htmleditor", "TinyMCEEditor", "Number", "Currency", "Office", "Orgfield", "Personfield", "Readerfield", "Authorfield", "Org",
			"Reader", "Author", "Radio", "Select", "Textarea", "Textfield", "Address","Combox",
			"Elcascader","Elcheckbox","Elcolorpicker", "Eldate", "Eldatetime", "Elinput", "Elnumber", "Elradio", "Elrate", "Elselect", "Elslider", "Elswitch", "ElTime"],
		"injectActions" : [
			{
				"name" : "top",
				"styles" : "injectActionTop",
				"event" : "click",
				"action" : "injectTop",
				"title": MWF.APPFD.LP.formAction["insertTop"]
			},
			{
				"name" : "bottom",
				"styles" : "injectActionBottom",
				"event" : "click",
				"action" : "injectBottom",
				"title": MWF.APPFD.LP.formAction["insertBottom"]
			}
		]
	},
	initialize: function(designer, container, options){
		this.setOptions(options);

		this.path = "../x_component_process_FormDesigner/Module/Form/";
		this.cssPath = "../x_component_process_FormDesigner/Module/Form/"+this.options.style+"/css.wcss";

		this._loadCss();

		this.container = null;
		this.form = this;
		this.moduleType = "form";

		this.moduleList = [];
		this.moduleNodeList = [];

		this.moduleContainerNodeList = [];
		this.moduleElementNodeList = [];
		this.moduleComponentNodeList = [];

		//	this.moduleContainerList = [];
		this.dataTemplate = {};

		this.designer = designer;
		this.container = container;

		this.selectedModules = [];
	},

	// 移动端表单加载工具栏
	loadMobileActionToos: function() {
		if (this.options.mode==="Mobile"){
			if (!this.json.defaultTools){
				this.json.defaultTools = o2.JSON.get("../x_component_cms_FormDesigner/Module/Form/toolbars.json", null,false);
			}
			if (!this.json.tools) this.json.tools=[];
		}
	},

	//loadTemplateStyles : function( file, callback ){
	//	debugger;
	//	if( !file ){
	//		if (callback) callback({});
	//		return;
	//	}
	//	this.templateStylesList = this.templateStylesList || {};
	//	if( this.templateStylesList[file] ){
	//		if (callback) callback(this.templateStylesList[file]);
	//		return;
	//	}
	//	var stylesUrl = "../x_component_cms_FormDesigner/Module/Form/skin/"+file;
	//	MWF.getJSON(stylesUrl,{
	//			"onSuccess": function(responseJSON){
	//				this.templateStylesList[file] = responseJSON;
	//				if (callback) callback(responseJSON);
	//			}.bind(this),
	//			"onRequestFailure": function(){
	//				if (callback) callback({});
	//			}.bind(this),
	//			"onError": function(){
	//				if (callback) callback({});
	//			}.bind(this)
	//		}
	//	);
	//},
	loadTemplateStyleFile : function(file, callback ){
		if( !file ){
			if (callback) callback({});
			return;
		}
		var stylesUrl = "../x_component_cms_FormDesigner/Module/Form/skin/"+file;
		MWF.getJSON(stylesUrl,{
				"onSuccess": function(responseJSON){
					//this.templateStylesList[file] = responseJSON;
					if (callback) callback(responseJSON);
				}.bind(this),
				"onRequestFailure": function(){
					if (callback) callback({});
				}.bind(this),
				"onError": function(){
					if (callback) callback({});
				}.bind(this)
			}
		);
	},
	loadTemplateExtendStyleFile : function(extendFile, callback ){
		if( !extendFile ){
			if (callback) callback({});
			return;
		}
		var stylesUrl = "../x_component_cms_FormDesigner/Module/Form/skin/"+extendFile;
		MWF.getJSON(stylesUrl,{
				"onSuccess": function(responseJSON){
					//this.templateStylesList[file] = responseJSON;
					if (callback) callback(responseJSON);
				}.bind(this),
				"onRequestFailure": function(){
					if (callback) callback({});
				}.bind(this),
				"onError": function(){
					if (callback) callback({});
				}.bind(this)
			}
		);
	},
	loadStylesList: function(callback){
		//var stylesUrl = "../x_component_process_FormDesigner/Module/Form/template/"+((this.options.mode=="Mobile") ? "mobileStyles": "styles")+".json";
		//var stylesUrl = "../x_component_process_FormDesigner/Module/Form/template/"+((this.options.mode=="Mobile") ? "styles": "styles")+".json";
		var configUrl = "../x_component_cms_FormDesigner/Module/Form/skin/config.json";
		MWF.getJSON(configUrl,{
				"onSuccess": function(responseJSON){
					this.stylesList = responseJSON;
					if (callback) callback(this.stylesList);
				}.bind(this),
				"onRequestFailure": function(){
					this.stylesList = {};
					if (callback) callback(this.stylesList);
				}.bind(this),
				"onError": function(){
					this.stylesList = {};
					if (callback) callback(this.stylesList);
				}.bind(this)
			}
		);
	},

    //loadStylesList: function(callback){
		//var stylesUrl = "../x_component_cms_FormDesigner/Module/Form/template/"+((this.options.mode=="Mobile") ? "styles": "styles")+".json";
		//MWF.getJSON(stylesUrl,{
		//		"onSuccess": function(responseJSON){
		//			this.stylesList= responseJSON;
		//			if (callback) callback(this.stylesList);
		//		}.bind(this),
		//		"onRequestFailure": function(){
		//			this.stylesList = {};
		//			if (callback) callback(this.stylesList);
		//		}.bind(this),
		//		"onError": function(){
		//			this.stylesList = {};
		//			if (callback) callback(this.stylesList);
		//		}.bind(this)
		//	}
		//);
    //},

	loadModule: function(json, dom, parent){
		var module, className;
		if( !json ){
			className = ( dom.get("MWFType") || "div" ).capitalize();
			this.getTemplateData(className, function(data){
				var moduleData = Object.clone(data);
				moduleData.id = dom.get("id");
				this.json.moduleList[dom.get("id")] = moduleData;
				module = new MWF["CMSFC"+className](this);
				module.load(moduleData, dom, parent);
			}.bind(this), false);
			return module;
		}else if( MWF["CMSFC"+json.type] ){
			className = json.type.capitalize();
			this.getTemplateData(className, function(data){
			    var moduleData = Object.clone(data);
				Object.merge(moduleData, json);
				Object.merge(json, moduleData);
			    module = new MWF["CMSFC"+json.type](this);
			    module.load(json, dom, parent);
			}.bind(this), false);
			return module;
		}else{
			className = json.type.capitalize();
			this.getTemplateData(className, function(data){
				var moduleData = Object.clone(data);
				Object.merge(moduleData, json);
				Object.merge(json, moduleData);
				module = new MWF["CMSFCDiv"](this);
				module.load(json, dom, parent);
			}.bind(this), false);
			return module;
		}
	},


	createModule: function(className, e){
		//var classPre = MWF.CMSFD.RedesignModules.indexOf( className.toLowerCase() ) != -1 ? "CMSFC" : "FC";
		var classPre = "CMSFC";
		this.getTemplateData(className, function(data){
			var moduleData = Object.clone(data);
			var newTool = new MWF[classPre+className](this);
			newTool.create(moduleData, e);
		}.bind(this));
	},
	getTemplateData: function(className, callback, async){
		if (this.dataTemplate[className]){
			if (callback) callback(this.dataTemplate[className]);
		}else{
			var _className = className.indexOf("Process") === 0 ? className.substr( 7, className.length - 1 ) : className;
			var path = MWF.CMSFD.ResetTemplateModules.indexOf( className.toLowerCase() ) != -1 ? "x_component_cms_FormDesigner" : "x_component_process_FormDesigner";
			var templateUrl = "../"+path+"/Module/"+_className+"/template.json";
			MWF.getJSON(templateUrl, function(responseJSON, responseText){
				this.dataTemplate[className] = responseJSON;
				if (callback) callback(responseJSON);
			}.bind(this), async);
		}
	},
	showProperty: function(callback){
		if (!this.property){
			this.property = new MWF.xApplication.cms.FormDesigner.Property(this, this.designer.propertyContentArea, this.designer, {
				"path": this.options.propertyPath,
				"onPostLoad": function(){
					this.property.show();
					if (callback) callback();
				}.bind(this)
			});
			this.property.load();
		}else{
			this.property.show();
		}
	},
	save: function(callback){
        this.designer.saveForm();
		//this._getFormData();
		//this.designer.actions.saveForm(this.data, function(responseJSON){
		//	this.form.designer.notice(MWF.APPFD.LP.notice["save_success"], "ok", null, {x: "left", y:"bottom"});
        //
		//	//this.json.id = responseJSON.data;
		//	if (!this.json.name) this.treeNode.setText("<"+this.json.type+"> "+this.json.id);
		//	this.treeNode.setTitle(this.json.id);
		//	this.node.set("id", this.json.id);
		//
		//	if (callback) callback();
		//	//this.reload(responseJSON.data);
		//}.bind(this));
	},
	implode: function(){
        MWF.xDesktop.requireApp("cms.FormDesigner", "Import", function(){
            MWF.CMSFormImport.create("O2", this);
        }.bind(this));
    },
    implodeHTML: function(){
        MWF.xDesktop.requireApp("cms.FormDesigner", "Import", function(){
            MWF.CMSFormImport.create("html", this, {"type": "process"});
        }.bind(this));
    },
    implodeOffice: function(){
        MWF.xDesktop.requireApp("cms.FormDesigner", "Import", function(){
            MWF.CMSFormImport.create("office", this);
        }.bind(this));
    },
	showFormVersion: function(){
		this.versionNode = new Element("div");
		this.dlg = o2.DL.open({
			"title": MWF.CMSFD.LP.version["title"],
			"content": this.versionNode,
			"offset": {"y": -100},
			"isMax": false,
			"width": 500,
			"height": 300,
			"buttonList": [
				{
					"type": "cancel",
					"text": MWF.CMSFD.LP.version["close"],
					"action": function(){ this.close(); }
				}
			],
			"onPostShow": function(){
				this.loadVersionList();
			}.bind(this),
			"onPostClose": function(){
				this.dlg = null;
			}.bind(this)
		});
	},
	loadVersionList : function(){
		var tableHtml = "<table width='100%' cellspacing='0' cellpadding='3' style='margin-top: 1px'><tr>" +
			"<th>"+MWF.CMSFD.LP.version["no"]+"</th>" +
			"<th>"+MWF.CMSFD.LP.version["person"]+"</th>" +
			"<th>"+MWF.CMSFD.LP.version["updateTime"]+"</th>" +
			"<th>"+MWF.CMSFD.LP.version["op"]+"</th>" +
			"</tr></table>";
		this.versionNode.set("html", tableHtml);
		this.versionTable = this.versionNode.getElement("table");
		o2.Actions.load("x_cms_assemble_control").FormVersionAction.listWithForm(this.form.json.id, function(json){
			this.versionList = json.data;
			this.versionList.each(function (version,index) {
				var node = new Element("tr").inject(this.versionTable);
				var html = "<td>"+(index+1)+"</td>" +
					"<td>"+version.person+"</td>" +
					"<td>"+version.updateTime+"</td>" +
					"<td></td>";
				node.set("html", html);
				var actionNode = new Element("div",{"styles":{
						"width": "60px",
						"padding": "0px 3px",
						"border-radius": "20px",
						"cursor" : "pointer",
						"color": "#ffffff",
						"background-color": "#4A90E2",
						"float": "left",
						"margin-right": "2px",
						"text-align": "center",
						"font-weight": "100"
					}}).inject(node.getLast("td"));
				actionNode.set("text", MWF.CMSFD.LP.version["resume"]);
				actionNode.addEvent("click",function (e) {
					var _self = this;
					this.designer.confirm("warn", e,  MWF.CMSFD.LP.version["resumeConfirm"], MWF.CMSFD.LP.version["resumeInfo"], 460, 120, function(){
						_self.resumeForm(version);
						this.close();
					}, function(){
						this.close();
					});
				}.bind(this));
			}.bind(this))
		}.bind(this));
	},
	resumeForm : function(version){
		o2.Actions.load("x_cms_assemble_control").FormVersionAction.get(version.id, function( json ){
			var formData = JSON.parse(json.data.data);
			//this.action.FormAction.update(version.form, formData,function( json ){
			this.designer.notice(MWF.CMSFD.LP.version["resumeSuccess"]);
			var data = JSON.decode(MWF.decodeJsonString(formData.data));
			data.isNewForm = false;
			this.reload(data);
			this.dlg.close();
			//}.bind(this), null, false);
		}.bind(this), null, false);
	},
	setPropertiesOrStyles: function(name){
		if (name=="styles"){
			this.setCustomStyles();
		}
		if (name=="properties"){
			this.node.setProperties(this.json.properties);
		}
	},
	setCustomStyles: function(){
		var border = this.node.getStyle("border");
		this.node.clearStyles();
		this.node.setStyles((this.options.mode==="Mobile") ? this.css.formMobileNode : this.css.formNode);
        var y = this.container.getStyle("height");
        y = (y) ? y.toInt()-2 : this.container.getSize().y-2;
		this.node.setStyle("min-height", ""+y+"px");

		if (this.initialStyles) this.node.setStyles(this.initialStyles);
		this.node.setStyle("border", border);

		Object.each(this.json.styles, function(value, key){
			var reg = /^border\w*/ig;
			if (!key.test(reg)){
				this.node.setStyle(key, value);
			}
		}.bind(this));
	},
	//_setEditStyle: function(name, obj, oldValue){
	//	if (name=="name"){
	//		var title = this.json.name || this.json.id;
	//		this.treeNode.setText("<"+this.json.type+"> "+title+" ["+this.options.mode+"] ");
	//	}
	//	if (name=="id"){
	//		if (!this.json.name) this.treeNode.setText("<"+this.json.type+"> "+this.json.id+" ["+this.options.mode+"] ");
	//		this.treeNode.setTitle(this.json.id);
	//		this.node.set("id", this.json.id);
	//	}
     //   if (name=="formStyleType"){
     //       this.templateStyles = (this.stylesList && this.json.formStyleType) ? this.stylesList[this.json.formStyleType] : null;
     //       if (oldValue) {
     //           var oldTemplateStyles = this.stylesList[oldValue];
     //           if (oldTemplateStyles){
     //               if (oldTemplateStyles["form"]) this.clearTemplateStyles(oldTemplateStyles["form"]);
     //           }
     //       }
     //       if (this.templateStyles){
     //           if (this.templateStyles["form"]) this.setTemplateStyles(this.templateStyles["form"]);
     //       }
     //       this.setAllStyles();
    //
     //       this.moduleList.each(function(module){
     //           if (oldTemplateStyles){
     //               module.clearTemplateStyles(oldTemplateStyles[module.moduleName]);
     //           }
     //           module.setStyleTemplate();
     //           module.setAllStyles();
     //       }.bind(this));
     //   }
     //   if (name==="css"){
     //       this.reloadCss();
     //   }
	//	this._setEditStyle_custom(name, obj, oldValue);
	//},

	_setEditStyle: function(name, obj, oldValue){
		if (name=="name"){
			var title = this.json.name || this.json.id;
			this.treeNode.setText("<"+this.json.type+"> "+title+" ["+this.options.mode+"] ");
		}
		if (name=="id"){
			if (!this.json.name) this.treeNode.setText("<"+this.json.type+"> "+this.json.id+" ["+this.options.mode+"] ");
			this.treeNode.setTitle(this.json.id);
			this.node.set("id", this.json.id);
		}
		if (name=="formStyleType"){

			var file = (this.stylesList && this.json.formStyleType) ? this.stylesList[this.json.formStyleType].file : null;
			var extendFile = (this.stylesList && this.json.formStyleType) ? this.stylesList[this.json.formStyleType].extendFile : null;
			this.loadTemplateStyles( file, extendFile, function( templateStyles ){
				//this.templateStyles = (this.stylesList && this.json.formStyleType) ? this.stylesList[this.json.formStyleType] : null;
				this.templateStyles = templateStyles;

				var oldFile, oldExtendFile;
				if( oldValue && this.stylesList[oldValue] ){
					oldFile = this.stylesList[oldValue].file;
					oldExtendFile = this.stylesList[oldValue].extendFile;
				}
				this.loadTemplateStyles( oldFile, oldExtendFile, function( oldTemplateStyles ){
					//if (oldValue) {
					//	var oldTemplateStyles = this.stylesList[oldValue];
					//	if (oldTemplateStyles){
					//		if (oldTemplateStyles["form"]) this.clearTemplateStyles(oldTemplateStyles["form"]);
					//	}
					//}

					this.json.styleConfig = (this.stylesList && this.json.formStyleType) ? this.stylesList[this.json.formStyleType] : null;

					if (oldTemplateStyles["form"]) this.clearTemplateStyles(oldTemplateStyles["form"]);
					if (this.templateStyles["form"]) this.setTemplateStyles(this.templateStyles["form"]);

					this.setAllStyles();

					this.moduleList.each(function(module){
						if (oldTemplateStyles[module.moduleName]){
							module.clearTemplateStyles(oldTemplateStyles[module.moduleName]);
						}
						module.setStyleTemplate();
						module.setAllStyles();
					}.bind(this));
				}.bind(this))

			}.bind(this))
		}
		if (name==="css"){
			this.reloadCss();
		}
		this._setEditStyle_custom(name, obj, oldValue);
	},

    parseCSS: function(css){
        var rex = /(url\(.*\))/g;
        var match;
        while ((match = rex.exec(css)) !== null) {
            var pic = match[0];
            var len = pic.length;
            var s = pic.substring(pic.length-2, pic.length-1);
            var n0 = (s==="'" || s==="\"") ? 5 : 4;
            var n1 = (s==="'" || s==="\"") ? 2 : 1;
            pic = pic.substring(n0, pic.length-n1);

            if ((pic.indexOf("x_processplatform_assemble_surface")!=-1 || pic.indexOf("x_portal_assemble_surface")!=-1)){
                var host1 = MWF.Actions.getHost("x_processplatform_assemble_surface");
                var host2 = MWF.Actions.getHost("x_portal_assemble_surface");
                if (pic.indexOf("/x_processplatform_assemble_surface")!==-1){
                    pic = pic.replace("/x_processplatform_assemble_surface", host1+"/x_processplatform_assemble_surface");
                }else if (pic.indexOf("x_processplatform_assemble_surface")!==-1){
                    pic = pic.replace("x_processplatform_assemble_surface", host1+"/x_processplatform_assemble_surface");
                }
                if (pic.indexOf("/x_portal_assemble_surface")!==-1){
                    pic = pic.replace("/x_portal_assemble_surface", host2+"/x_portal_assemble_surface");
                }else if (pic.indexOf("x_portal_assemble_surface")!==-1){
                    pic = pic.replace("x_portal_assemble_surface", host2+"/x_portal_assemble_surface");
                }
				pic = o2.filterUrl(pic);
            }
            pic = "url('"+pic+"')";
            var len2 = pic.length;

            css = css.substring(0, match.index) + pic + css.substring(rex.lastIndex, css.length);
            rex.lastIndex = rex.lastIndex + (len2-len);
        }
        return css;
    },
	preview: function(){

		MWF.xDesktop.requireApp("cms.FormDesigner", "Preview", function(){

			if (this.options.mode=="Mobile"){
				this.previewBox = new MWF.xApplication.cms.FormDesigner.Preview(this, {"size": {"x": "400", "y": 580}});
			}else{
				this.previewBox = new MWF.xApplication.cms.FormDesigner.Preview(this);
			}
			this.previewBox.load();

		}.bind(this));
	}
});

(function (){
	var tmplConfig = {
		server:  '<li><a href="<% href %>" class="server_btn needLogin" target="_blank"><i class="s_i <% status %>"></i><i class="ico_ico ico_new"></i><b><% name %></b></a></li>',
		indexServer: '<a href="<% href %>"" target="_blank" class="cs-clear needLogin"><em class="">推荐服：</em><% name %> </a>',
		topNews: '<a href="http://www.ibaiyu.cn/4372news.aspx?id=<% _id %>" title="<% _title_short %>" target="_blank"><% _title %></a>',
		news: '<li class="cs-clear"><a class="new_tit" target="_blank" href="http://www.ibaiyu.cn/4372news.aspx?id=<% _id %>" title="<% _title %>"><label class="tit_label">[<% _label %>]</label><% _title_short %></a><span class="new_date"><% _date %></span></li>'
	}
	var hasLogin = false;
	var lastOrRecServerObj = {
		name: "",
		href: "",
		state: "",
		text: ""
	};
	function getLoginUser(){
		var options = ajaxConfig.getLoginUser;
		$.ajax(options).success(function(data){
			if(typeof data === 'string'){
				data = JSON.parse(data);
			}
			if(data.name){
				$(".not-login.navbar-right").hide();
				$(".has-login.navbar-right").show().find(".username span").text(data.name);
				hasLogin = true;
			}
		})
	}
	function getNews(){
		if($(".mod_newstab").length > 0){
			var words = 30, length = 6; /*每条新闻最大字数和新闻条数*/
			var $tabs_item = $(".mod_newstab").find(".newcom_box");
			var topTmpl = tmplConfig.topNews;
			var tmpl = tmplConfig.news;
			getNewsHuodong($tabs_item.eq(1), tmpl, words, length, topTmpl);
			getNewsGonggao($tabs_item.eq(0), tmpl, words, length, topTmpl);
		}
	}
	function createNews(elem, tmpl, data, words, length, topTmpl){
		var newsArr = [];
		if(typeof data === 'string'){
			data = JSON.parse(data);
		}
		$(data).each(function(i, v){
			if(i >= length){
				return false;
			}
			var date = new Date(parseInt(v._release_time.replace('/Date(', '').replace('+0800)/', '')));
			v._date = (date.getMonth() + 1) + '-' + date.getDate();
			v._title_short = (words && v._title.length > words) ? v._title.slice(0,words).concat('…') : v._title;
			if(topTmpl !== undefined && i === 0){
				var topHTML = topTmpl.replace(/<%\s?(\w+)\s?%>/g, function(m1, m2){
					return v[m2] ? v[m2] : data[m2];
				});
//				console.log(topHTML)
//				console.log(elem);
				return elem.find(".new_top").html(topHTML);
			}
			newsArr.push(tmpl.replace(/<%\s?(\w+)\s?%>/g, function(m1, m2){
				return v[m2] ? v[m2] : data[m2];
			}));
		});
		elem.find("ul").html(newsArr.join(""))
	}
	function getNewsError(elem){
		elem.find("ul").html("<a class='pointer' onclick='getNews()'>加载失败，点击重新加载</a>")
	}
	function getNewsHuodong(elem, tmpl, words, length, topTmpl){
		var options = ajaxConfig.getNewsHuodong;
		$.ajax(options).success(function(data){
			data._label = "活动";
			createNews(elem, tmpl, data, words, length, topTmpl);
		}).error(function(xhr){
					getNewsError(elem);
				});
	}
	function getNewsGonggao(elem, tmpl, words, length, topTmpl){
		var options = ajaxConfig.getNewsGonggao;
		$.ajax(options).success(function(data){
			data._label = "公告";
			createNews(elem, tmpl, data ,words, length, topTmpl);
		}).error(function(xhr){
					getNewsError(elem);
				});
	}
	function loginOut(){
		$("#loginOut").attr("href", ajaxConfig.loginOut.url);
	}
	function parseServerData(data){
		if(typeof data === 'string'){
			if(data.indexOf('[') !== 0){
				data = '["' + data + ']';
			}
			data = JSON.parse(data);
		}
		return data;
	}
	function createServerHtml(data, tmpl, text){
		var htmlArr = [];
		var tempObj, tempArr;
		data = parseServerData(data);
		$.each(data, function(i, v){
			tempObj = {};
			if(typeof v === 'string'){
				tempArr = v.split('|');
				if(tempArr.length === 0){
					return;
				}
				tempObj.name = tempArr[0];
				tempObj.state = parseInt(tempArr[1]);
				tempObj.id = tempArr[2];
				tempObj.href = 'http://www.ibaiyu.cn/4372game.aspx?gv='+ tempObj.id +'&gk=68';
			}else{
				tempObj.href = 'http://www.ibaiyu.cn/4372game.aspx?gv='+ v._id +'&gk=68';
				tempObj.name = v._name;
				tempObj.state = v._state;
			}
			if(tempObj.state === 1 || tempObj.state === 2){
				tempObj.status = 's_h';
				tempObj.href = 'javascript: void'
			}else if(tempObj.state === 3 || tempObj.state === 4){
				tempObj.status = 's_g';
			}
			if(!lastOrRecServerObj.text){
				lastOrRecServerObj.text = text;
				lastOrRecServerObj.name = tempObj.name;
				lastOrRecServerObj.state = tempObj.state;
				lastOrRecServerObj.href = tempObj.href;
			}
			htmlArr.push(tmpl.replace(/<%\s?(\w+)\s?%>/g, function(m1, m2){
				return tempObj[m2];
			}));
		});
		return htmlArr.join('');
	}
	function initStatNewGame(){
		var $StatNewGame = $(".StatNewGame");
		if(lastOrRecServerObj.text){
			$StatNewGame.addClass("needLogin").attr("href", lastOrRecServerObj.href).text(lastOrRecServerObj.text + ': ' + lastOrRecServerObj.name);
		}else{
			$StatNewGame.attr("href", "./serverlist.html");
		}
	}
	function getRecommendServers(){
		var options = ajaxConfig.getRecommendServers;
		$.ajax(options).success(function(data){
			var indexServer = createServerHtml(data, tmplConfig.indexServer, "推荐服务器");
			var server = createServerHtml(data, tmplConfig.server);
			$(".server_list").html(indexServer);
			$("#recommendserver").html(server);
		}).complete(function(){
					initStatNewGame();
				});
	}
	function getLastServers(){
		var options = ajaxConfig.getLastServers;
		$.ajax(options).success(function(data){
			var html = createServerHtml(data, tmplConfig.server, "最近登录服务器");
			$("#myserver").html(html);
		}).complete(function(){
			getRecommendServers();
				});
	}
	function getAllServers(){
		var options = ajaxConfig.getAllServers;
		if($("#allserver").length > 0){
			$.ajax(options).success(function(data){
				var html = createServerHtml(data, tmplConfig.server);
				$("#allserver").html(html);
			})
		}
	}
	function login(redirectUrl){
		$("#loginModal").modal({});
		$(".form-signin").submit(function(){
			var subBtn = $(this).find("button[type=submit]");
			if(subBtn.isDisabled()){
				return false;
			}
			$(this).checkForm();
			if(!this.valid){
				return false;
			}
			$(this).clearFormError();
			subBtn.disableBtn().text("登录中...");
			var formData = $(this).serialize();
			var options = $.extend(ajaxConfig.login, {
				data: formData
			});
			try{
				$.ajax(options).success(function(data){
					if(typeof data === 'string'){
						data = JSON.parse(data);
					}
					if(data.error === 1 && data.msg){
						$(".form-signin").showFormError(data.msg);
					}else{
						redirectUrl && redirectUrl !== 'javascript: void' ? (location.href = redirectUrl) : location.reload();
					}
				}).fail(function(xhr, err){
//							console.error(err);
						}).complete(function(){
							subBtn.ableBtn().text("登录");
						});
			}catch (e){
//				console.log('catch e:');
//				console.error(e);
			}
			return false;
		});
	}
	function fastStartGame(serverNum){
		var options = ajaxConfig.getAllServers;
		var serverHref;
		if(isNaN(serverNum)){
			return $.showErrMsg("区服数不能为空哦~")
		}
		$.ajax(options).success(function(data){
			if(typeof data === 'string'){
				data = JSON.parse(data);
			}
			$(data).each(function(i, v){
				if(parseInt(v._qufu) === serverNum){
					serverHref = 'http://www.ibaiyu.cn/4372game.aspx?gv='+ v._id +'&gk=68';
					if(hasLogin){
						location.href = serverHref;
					}else{
						login(serverHref);
					}
				}
			});
			if(!serverHref){
				$.showErrMsg("您填写的区服（双线" + serverNum + "服）不存在哦~");
			}
		});
	}
	$(function () {
		getLoginUser();
		getNews();

		getLastServers();
		getAllServers();
		loginOut();
		$("#serverFastBtn").click(function(){
			var serverNum = parseInt($(this).siblings("input").val());
			fastStartGame(serverNum);
		});
		$("#login").click(function(){
			login();
		});
		$("body").delegate(".needLogin", "click", function(){
			if(!hasLogin){
				var href = $(this).attr("href");
				login(href);
				return false;
			}
		})
		/*$(".zonelist").delegate("a", "click", function(){
			if(!hasLogin){
				var href = $(this).attr("href");
				login(href);
				return false;
			}
		})*/
	});
})();

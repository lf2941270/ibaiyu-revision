$.fn.clearInputStatus = function(){
	$(this).parent().removeClass("has-warning has-error has-success has-feedback").find(".glyphicon, .help-block").remove();
	return this;
}
$.fn.inputSuccess = function(){
	$(this).clearInputStatus().parent().addClass("has-success has-feedback").append("<span class=\"glyphicon glyphicon-ok form-control-feedback\"></span>");
}
$.fn.inputWarning = function(msg){
	$(this).clearInputStatus().parent().addClass("has-warning has-feedback").append("<span class=\"glyphicon glyphicon-warning-sign form-control-feedback\"></span>");
	if(msg){
		$(this).parent().append($("<span class='help-block'>" + msg +"</span>"));
	}
}
$.fn.inputError = function(msg){
	$(this).clearInputStatus().parent().addClass("has-error has-feedback").append("<span class=\"glyphicon glyphicon-remove form-control-feedback\"></span>");
	if(msg){
		$(this).parent().append($("<span class='help-block'>" + msg +"</span>"));
	}
}

$(function(){
	/*浏览器检测并给ie8浏览器下的body添加class*/
	try{
		var browser=navigator.appName
		var b_version=navigator.appVersion
		var version=b_version.split(";");
		var trim_Version=version[1].replace(/[ ]/g,"");
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
			$("body").addClass("ie8");
		}
	}catch(e){

	}

	/*除修改资料页外其他页面自动滚动一段*/
	if(document.title.indexOf("修改资料") < 0){
		$("html, body").animate({
			scrollTop: 35 + $(".usercard").height()
		}, 500);
	}

	/*表单验证*/
	//所有表单必填项非空验证
	$("form[method=post]").submit(function(){

		var inputs = $(this).find("input, select").not("[type=radio]");
		var _ = this;
		this.valid = true;
		inputs.each(function(i, v){
			if($(v).val() === ""){
				$(v).inputError($(v).parents(".form-group").find("label").text() + "不能为空");
				_.valid = false;
			}else{
				$(v).inputSuccess();
			}
		});
	});
	//防沉迷验证表单
	$("form.id-card").submit(function(){
		var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
		if($("#inputIdCard").val() && !reg.test($("#inputIdCard").val())){
			$("#inputIdCard").inputError("身份证格式不正确");
			this.valid = false;
		}
	});
	//修改密码表单
	$("form.change-password").submit(function(){
		var _ = this;
		$(this).find("input[type=password]").each(function(){
			if($(this).val() && $(this).val().length < 6){
				$(this).inputError("密码长度最少为6位");
				_.valid = false;
			}
		});
		if($("#cur-pwd2").val() !== $("#cur-pwd").val()){
			$("#cur-pwd2").inputError("两次输入的密码不一致");
			_.valid = false;
		}
	});
	//设置密保表单
	$("form.security").submit(function(){
		if($("select").eq(0).val() === $("select").eq(1).val()){
			$("select").eq(1).inputError("问题二和问题一不能重复")
			this.valid = false;
		}
	});
	//绑定邮箱表单
	$("form.bind-email").submit(function(){
		var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if($("#email").val() && !reg.test($("#email").val())){
			$("#email").inputError("邮箱地址格式不正确");
			this.valid = false;
		}
	});
	//将所有的post表单提交改为Ajax方式
	$("form[method=post]").submit(function(){
		var submitBtn = $(this).find("button[type=submit]");
		var originText = submitBtn.text();
		if(this.valid === true){
			submitBtn.attr("disabled", true).text("提交中..."); //提交过程中将提交按钮设置为不可用
			$.ajax({
				url: $(this).attr("action"),
				method: 'post',
				data: $(this).serialize()
			}).success(function(data){
			//提交成功或者提交后后台验证有错误后的逻辑（包括页面跳转）
						//todo

					}).fail(function(xhr, errType, err){ //出现404或者500等错误就会进入这个回调
						setTimeout(function(){
							$(submitBtn).popover({
								title:'提交失败',
								content:'错误消息：' + xhr.status +  ' ' + err ,
								"show": 500,
								"hide": 500
							}).popover('show');
							$(document).click(function(){
								$(submitBtn).popover('destroy');
							})
						})
					}).complete(function(){
						submitBtn.attr("disabled", false).text(originText);
					});
		}
		return false;
	})
	$("form").find("input, select").focus(function(){
		$(this).clearInputStatus();
	});
	/*日期选择插件*/
	$("input[type=date]").focus(function(){
		WdatePicker();
	}).click(function(){
		WdatePicker();
	})
	$("form.choose-date").submit(function(){
		/*console.log($("[name=startDate]").val())
		console.log($("[name=endDate]").val())*/
	})

	/*设置左侧导航的高度*/
	function setLeftHeight(){
		$(".left-nav").height(466).height($(".main-nav").height());
	}
	setLeftHeight();
	$(window).resize(setLeftHeight);

	$(".icon-list").delegate("li", "click", function(){
		location.href = $(this).find("a").attr("href");
	});
	/*更换头像*/
	(function(){
		/*修改头像*/
		$('#myModal').on('hidden.bs.modal', function (e) {
			setTimeout(function(){
				$(".face-container").addClass("hover");
			},0);
			setTimeout(function(){
				$(".face-container").removeClass("hover");
			},500);
		});

		$(".face-container").hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		});
		var cur = $(".face-container>img").attr("src").match(/\/(\d+)\.jpg/)[1]; //当前图像的数字编号
		var choose;
		$(".face-choose .choose").delegate("li", "click", function(){
			choose = $(this).index() + 1;
			$(this).addClass("cur").append("<i></i>").siblings().removeClass("cur").find("i").remove();
		});
		$("#save-face").click(function(){
			if(choose && choose !== cur && !$(this).hasClass("disable")){
				var _ = this;
				$(this).addClass("disable").text("修改中...")
				$.ajax({
					url: '/changeface?faceid='+choose,
					method: 'post'
				}).success(function(data){
							//todo
					changeLocalFace(choose);
					$('#myModal').modal('hide');
				}).fail(function(){
							//todo
					/*后台接口写好后需要修改*/
					setTimeout(function(){
						changeLocalFace(choose);
						$('#myModal').modal('hide');
					},1000)
				}).complete(function(){
							//todo
					setTimeout(function(){
						$(_).removeClass("disable").text("保存更改")
						changeLocalFace(choose);
						$('#myModal').modal('hide');
					},1000)
				})
			}
		});
		function changeLocalFace(fid){
			cur = choose;
			$(".face-container>img").attr("src", "/前端源码/upload/face/" + fid + ".jpg")
		}
	})();

	/*我的游戏页设置每个的高度为最大高度*/
	function setImgBoxHeight(){
		var height, minHeight;
		$(".game-list .img-box").each(function(){
			$(this).height("")
			height = $(this).height();
			minHeight = minHeight || height;
			if(minHeight > height){
				minHeight = height;
			}
		});
		$(".game-list .img-box").each(function(){
			$(this).height(minHeight);
		})
	}
	setTimeout(setImgBoxHeight,40);
	$(window).resize(setImgBoxHeight);

	/*平台消息页全选取消及删除消息*/
	(function(){
		var msgList = [];
		$(".choose-all").click(function(){
			var checkboxes = $(".msg-box").find("input:checkbox");
			if($(this).find("span").text() === "全选"){
				$(this).find("span").text("取消");
				checkboxes.prop("checked", true).trigger("change");
				return;
			}else if($(this).find("span").text() === "取消"){
				$(this).find("span").text("全选");
				checkboxes.prop("checked", false).trigger("change");
				return;
			}
		});
		$("[name=choose-msg]").change(function(){
			var val = $(this).val();
			if($(this)[0].checked){
				msgList.push(val);
			}else{
				msgList = msgList.filter(function(v){
					return v !== val;
				});
			}
		})
		$(".del-msg").click(function(){
			//todo
			//msgList里面就是待删除的消息id数组
			console.log(msgList)
		});
		var msgModal = $("#myMsgModal");
		/*点击标题弹出阅读消息的模态框并且将未读消息设为已读*/
		$(".msg-box .title").click(function(){
			var hasReadEle = $(this).siblings("[data-hasread]");
			if(hasReadEle.data("hasread") === false){
				//发送消息已读的请求给服务器
				$.ajax({
					//todo
				})
				hasReadEle.data("hasread", true).find("i").removeClass("n").addClass("y").siblings("span").text("已读");
			}
			msgModal.find(".modal-title").text($(this).text());
			msgModal.find(".modal-body").html($(this).siblings(".hidden").html());
			msgModal.modal();
		})
	})();
})
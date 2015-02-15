(function (window, $){
	'use strict';

	var hasLogin = false;

	var ajaxConfig = $.extend(window.ajaxConfig, {
		login: {
			url: '/Game/GameCom.ashx?method=Login',
			type: 'post'
		},
		loginOut: {
			url: '/Game/GameCom.ashx?method=Logout'
		},
		getLoginUser: {
			url: '/Game/GameCom.ashx?method=GetUser'
		}
	});
	$.fn.showFormError = function(msg){
		this.find(".form-error").text(msg);
	};
	$.fn.clearFormError = function(){
		this.find(".form-error").text('');
	};
	$.fn.checkForm = function(){
		var $userInput = this.find("[type=text]");
		var $pwdInput = this.find("[type=password]");
		var user = $userInput.val();
		var pwd = $pwdInput.val();
		this[0].valid = true;
		if(user === ''){
			this[0].valid = false;
			return this.showFormError("用户名不能为空");
		}
		if(user.length < 6){
			this[0].valid = false;
			return this.showFormError("用户名最少为6位");
		}
		if(pwd === ''){
			this[0].valid = false;
			return this.showFormError("密码不能为空");
		}
		if(pwd.length < 6){
			this[0].valid = false;
			return this.showFormError("密码最少为6位");
		}
	};
	$.fn.disableBtn = function(){
		this.addClass("disable").attr("disable", true);
		return this;
	};
	$.fn.ableBtn = function(){
		this.removeClass("disable").attr("disable", false);
		return this;
	};
	$.fn.isDisabled = function(){
		return this.hasClass("disable");
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

	function loginOut(){
		$("#loginOut").attr("href", ajaxConfig.loginOut.url);
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
	function scrollNav(){
		$(window).bind('scroll', function(){
			var scrollTop = $(this).scrollTop();
			var $navbar = $('.navbar');
			if(scrollTop >= 250){
				$navbar.addClass('navbar-scroll');
			}else{
				$navbar.removeClass('navbar-scroll');
			}
		})
	}
	$(function () {
		getLoginUser();
		loginOut();
		scrollNav();
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

	});
})(window, jQuery);

(function(){
	//幻灯片
	function sliderAction()	{
		if( $('.banner').length>0)
		{
			var unslider = $('.banner').unslider({
				speed: 500,               //  滚动速度
				delay: 5000,              //  动画延迟
//				complete: function() {$('.banner_info').animate({bottom:"-80px"},"fast");},  //  动画完成的回调函数
				keys: true,               //  启动键盘导航
				dots: false,               //  显示点导航
				fluid: false              //  支持响应式设计
			});
			$('.unslider-arrow').click(function() {
				var fn = this.className.split(' ')[1];
				//  Either do unslider.data('unslider').next() or .prev() depending on the className
				$('.banner_info').animate({bottom:"-80px"},"fast",function(){unslider.data('unslider')[fn]();});
			});

			$('.banner>ul>li').hover(
				function() {
//					$('.unslider-arrow').css("display","block");
					$('.banner_info').stop().animate({bottom:"0px"},"fast");
				},
				function()	{
//					$('.unslider-arrow').css("display","none");
					$('.banner_info').stop().animate({bottom:"-80px"},"fast");
				}
			);
		}
	}
	function serversListAction(){
		$(".servers-list>ul>li").hover(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
		});
	}
	$(function(){
		sliderAction();
		serversListAction();
	})
})();
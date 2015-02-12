'use strict';
/*ajax全局默认参数设置*/
$.ajaxSetup({
	dataType: 'json'
});
/*各后端API的参数设置,现在的是本地提供的模拟数据，需要更换成实际的线上地址*/
var ajaxConfig = {
	login: {
		url: '/Game/GameCom.ashx?method=Login',
		type: 'post'
	},
	loginOut: {
		url: '/Game/GameCom.ashx?method=Logout'
	},
	getNewsHuodong: {
		url: '/Game/GameCom.ashx?method=GetNews2&top=6&gameid=68&type=4',
		type: 'post'
	},
	getNewsGonggao: {
		url: '/Game/GameCom.ashx?method=GetNews&top=6&gameid=68&type=2'
	},
	getLoginUser: {
		url: '/Game/GameCom.ashx?method=GetUser'
	},
	getRecommendServers: {
		url: '/Game/GameCom.ashx?method=GetTjServer&gameid=68'
	},
	getLastServers: {
		url: '/Game/GameCom.ashx?method=GetLastLogin&gameid=68'
	},
	getAllServers: {
		url: '/Game/GameCom.ashx?method=GetServers&gameid=68'
	}
};


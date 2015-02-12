'use strict';
/*ajax全局默认参数设置*/
$.ajaxSetup({
	dataType: 'json'
});
/*各后端API的参数设置,现在的是本地提供的模拟数据，需要更换成实际的线上地址*/
var ajaxConfig = {
	login: {
		url: '/api/login'
	},
	loginOut:{
		url: '/api/loginOut'
	},
	getNewsHuodong: {
		url: '/api/getNewsHuodong'
	},
	getNewsGonggao: {
		url: '/api/getNewsGonggao'
	},
	getLoginUser: {
		url: '/api/getLoginUser'
	},
	getRecommendServers: {
		url: '/api/getRecommendServers'
	},
	getLastServers: {
		url: '/api/getLastServers'
	},
	getAllServers: {
		url: '/api/getAllServers'
	}
}
/*更换API中的localhost为本机在局域网中的IP，以允许局域网内访问*/
function replaceIp(obj, ip){
	for(var k in obj){
		obj[k].url = obj[k].url.replace('localhost', ip);
	}
}
replaceIp(ajaxConfig, '192.168.1.105');
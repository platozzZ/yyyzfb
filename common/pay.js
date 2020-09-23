export function payH5(that,e,v) {
    
}
export function payApp(that,type,orderInfo,pay_name){
	console.log('that:',that)
	console.log('pay_name:',pay_name)
	uni.requestPayment({
	    provider: type,//alipay / wxpay
	    orderInfo: orderInfo, //微信、支付宝订单数据
	    success: function (res) {
	        console.log('success:' + JSON.stringify(res));
			uni.showModal({
				title: '支付成功回调',
				content: 'success:' + JSON.stringify(res) 
			})
			uni.showToast({
				title: '支付成功！',
				duration: 1000,
				icon: 'none',
			})
			// if(pay_name == "DJ"){//订单类型会员等级DJ
			// 	uni.removeStorage('tui_id')
			// 	setTimeout(function() {
			// 		uni.redirectTo({
			// 			url: '../../pagesA/vipClub/vipClub'
			// 		})
			// 		me.pay_display = false
			// 	}, 1000)
			// }else if(pay_name == "MYORDER"){//我的订单
			// 	if(me.appPaySuccess){
			// 		me.appPaySuccess();
			// 	}
			// } else {
			// 	setTimeout(function() {
			// 		uni.setStorageSync("payRes", me.order_list);
			// 		uni.redirectTo({
			// 			url: "payResult"
			// 		})
			// 		// me.pay_display = false
			// 	}, 1000)
			// }
	    },
	    fail: function (err) {
			uni.setStorageSync('payStatus',false)
			uni.showModal({
				title: '支付失败回调',
				content: 'err:' + JSON.stringify(err) 
			})
			// uni.switchTab({
			// 	url: '/pages/tabBar/home'
			// })
	        console.log('fail:' + JSON.stringify(err));
			// if(pay_name == "DJ"){//订单类型会员等级DJ
			// 	uni.removeStorage('tui_id')
			// 	setTimeout(function() {
			// 		uni.redirectTo({
			// 			url: '../../pagesA/vipClub/vipClub'
			// 		})
			// 		me.pay_display = false
			// 	}, 1000)
			// }else if(pay_name == "MYORDER"){//我的订单
			// 	if(me.appPaySuccess){
			// 		me.appPaySuccess();
			// 	}
			// } else {
			// 	setTimeout(function() {
			// 		uni.setStorageSync("payRes", me.order_list);
			// 		uni.redirectTo({
			// 			url: "payResult"
			// 		})
			// 		// me.pay_display = false
			// 	}, 1000)
			// }
	    }
	});
}
<template>
	<view class="topay">
		<view class="pay-title">{{ orderdetail.l_matchname }}</view>
		<min-collapse class="collapse" list="" :desc="'¥' + orderdetail.l_charge" placeholder="订单明细">
			<view name="na" style="width:100%;padding:0 0 20rpx;">
				<view class="listone" v-for="(item, index) in 1" :key="index">
					<text class="title">报名费</text>
					<text class="num">x{{ orderdetail.l_count }}</text>
					<text class="price">¥ {{ orderdetail.l_charge }}</text>
				</view>
			</view>
		</min-collapse>
		<view class="choose">请选择支付方式</view>
		<view class="pay-b">
			<radio-group @change="radioChange">
				<view class="pay-bg pay-bg1" v-if="hidezhi&&statusBar > 0">
					<view class="pay-text">
						<image class="pay-img" src="../../static/images/payment_alipay.png" mode=""></image>
						<view class="text">支付宝</view>
					</view>
					<view class="paychoose"><radio value="1" /></view>
				</view>
				<view class="pay-bg">
					<view class="pay-text">
						<image class="pay-img" src="../../static/images/payment_wechat.png" mode=""></image>
						<view class="text">微信</view>
					</view>
					<view class="paychoose"><radio value="2"  checked="true"/></view>
				</view>
			</radio-group> 
		</view>
		<view class="topay-button iphonex" @click="getinfo">
			<view class="payin">去支付 ¥{{ orderdetail.l_charge }}</view>
		</view>
	</view>
</template>

<script>
	import _uni from '../../static/uni.webview.1.5.2.js'
export default {
	data() {
		return {
			choosed:2,
			orderid:'',
			orderdetail:'',
			hidezhi:true,
			statusBar: this.StatusBar
		};
	},
	onLoad(e) {
		this.orderid=e.id;
		this.orderInfo();
		// this.callbacks();
		var that = this;
	},
	onShow() {
		//#ifdef MP-WEIXIN
			this.hidezhi=false
		// #endif
	},
	methods:{
		callbacks(){
			this.$bridge.register("payResult",(data) => {//对接app支付宝支付返回处理逻辑
				if(data=='9000'){
					this.godetail(0)
				}else{
					this.godetail(1)
				}

			});
		},
		radioChange(e){
			this.choosed=e.detail.value
		},
		getinfo(){
				this.getapp()
			// if(this.StatusBar > 0){//判断是否在app里，其他地方有用到  需要封装
			// 	this.getapp()
			// }else{
			// 	// this.getcode()
			// 	this.payH5()
			// }
		},
		async getapp(openid){//得到赛事活动详情
			let choosed
			if(this.statusBar > 0){
				choosed = this.choosed==1?'alipay':'wx'
			} else {
				choosed = 'wx_h5'
			}
			console.log(choosed);
				// var choosed = this.choosed==1?'alipay':'wx'
				// let choosed = 'alipay'
			// if(uni.getStorageSync("channel")){
			// 	var choosed = this.choosed==1?'alipay':'wx'
			// }else{
			// 	var choosed = 'wx_pub'
			// }
			var data = {openid:openid,order_id:JSON.stringify([this.orderid]),channel:choosed,charge:this.orderdetail.l_charge};
			try {
			  let response = await this.$http.post('/pay/pay',data);
			  console.log('getapp:',response);
			  if (response.rspInfo.rspCode == 1000) {
				  var orderInfo = response.rspData
					if(this.statusBar > 0){
						let providerStr = this.choosed==1?'alipay':'wxpay'
						// if(this.choosed==1?'alipay':'wx')
						uni.webView.postMessage({
							data: {
								type: providerStr,
								datas: this.choosed==1?orderInfo.alipay:orderInfo,
							},
						});
						
						// this.toappalipy(response)
					} else {
						let url = orderInfo
						console.log(url)
						window.location.href = url
						// this.toxcxpay(data)
					}
			  }else{
			    uni.showToast({
			        title: response.rspInfo.rspDesc,
					icon:'none',
			        duration: 2000
			    });
			  }
			} catch (e) {
			  console.log(e);
			} finally {

			}
		},
		h5_pay(me,type,orderInfo){
			console.log('h5_pay')
			console.log('h5_pay-type:',type)
			console.log('h5_pay-orderInfo:',orderInfo)
			console.log(me.sNo)
			
			if (type == 'ali') {
				var url = uni.getStorageSync("endurl") + 'order/' + me.sNo + '_alipay.html'
				window.location.href = url
			} else {
				let url = orderInfo.data
				console.log(url)
				window.location.href = url
				
			}
			// let url = uni.getStorageSync("h5_url") + 'order/' + me.sNo + '_alipay.html'
			// window.location.href = url
		},
		getcode(){
			var that = this;
			wx.login({
			  success: function (res) {
			    that.getOpenId(res.code)
			  }
			});
		},
		getOpenId: function (code) {//获取openid
		    var that = this;
		    wx.request({
		      url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx36e54a23628acfec&secret=96df491781940a5be03d1c61375f560a&js_code=" + code + "&grant_type=authorization_code",
		      data: {},
		      method: 'GET',
		      success: function (res) {
		        that.getapp(res.data.openid)
		      },
		      fail: function () {
		        // fail
		      },
		      complete: function () {
		        // complete
		      }
		    })
		 },

		toxcxpay(data){//微信小程序支付
			uni.requestPayment({
					provider,//付款商家
					timeStamp,//时间戳(当前支付时间)
					nonceStr,//支付密匙
					package: packages,
					paySign,//支付id
					success(res) {
							success(JSON.stringify(res));
					},
					fail(err) {
							fail(JSON.stringify(err))
					}
			});
		},
		
		toappalipy(response){//对接app支付
			if(this.choosed==1){
				this.$bridge.call("cmmc.pushPay",response.rspData.alipay, (data) => {
					var newdata = JSON.parse(data);
					if(newdata.resultStatus=='9000'){
						this.godetail(0)
					}else{
						this.godetail(1)
					}
				});
			}else{
				this.$bridge.call("cmmc.pushWXPay", response.rspData, (data) => {
				  var newdata = JSON.parse(data);
				  if(newdata.resultStatus=='9000'){
				  	this.godetail(0)
				  }else{
				  	this.godetail(1)
				  }
				});
			}
		},
		godetail(type){
			if(type==0){
				uni.showToast({
					title: '支付成功',
					duration: 1500
				})
			}else if(type==1){
				uni.showToast({
					image:'../../static/images/fail.png',
					title: '支付失败',
					duration: 1500
				})
			}
			setTimeout(function(){
				uni.switchTab({
					url:'../order/order'
				})
			}, 1500)
		},
		async orderInfo(){//得到赛事活动详情
			var data = {order_id:this.orderid}
			try {
			  let response = await this.$http.post('/order/memberActivityDetail',data);
			  console.log('orderInfo:',response)
			  if (response.rspInfo.rspCode == 1000) {
					this.orderdetail = response.rspData;
			  }else{
			    uni.showToast({
			        title: response.rspInfo.rspDesc,
							icon:'none',
			        duration: 2000
			    });
			  }
			} catch (e) {
			  console.log(e);
			} finally {

			}
		},
	}
}
</script>

<style lang="scss">
@import '@/common/style/style.scss';
</style>

<template>
	<view class="container index">
		<cu-custom bgColor="bg-white" :isLeft="true" :isRight="true">
			<block slot="left">
				<text class="cuIcon-homefill bar-action" @tap="closeWebview"></text>
			</block>
			<block slot="content">
				<image src="../../static/images/logo.png" mode="widthFix"></image>
			</block>
			<block slot="right">
				<text class="cuIcon-search bar-action" style="opacity: 0;"></text>
			</block>
		</cu-custom>
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<!-- <swiper-item>
				<view class="swiper-item">
					<image src="../../static/images/del/banner1.jpg" mode="widthFix"></image>
				</view>
			</swiper-item>  -->
			<swiper-item v-for="(item, index) in bannerList" :data-url = "item.url" :key="index" @click="goUrl">
				<view class="swiper-item" >
					<image :src="item.photo" mode="widthFix" ></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="tabbg">
			<view class="tab-one" @click="changetab(index)" v-for="(item,index) in tabItems" :key="index">
				<image v-if="checktab==index" :src="item.srcur" mode="widthFix"></image>
				<image v-else :src="item.src" mode="widthFix"></image>
				<view :class="{'tab-text':true, 'tab-textcur':checktab==index}">{{item.name}}</view>
			</view>
		</view>
		
		<view class="listbg">
			<view class="list-one" v-for="(item, index) in listItems" :data-mid = "item.mid" :key="index" @click="godetail">
				<esay-loadimage class="list-image" :imgheight="360" :scroll-top="scrollTop" :open-transition="true" :image-src="item.logo" mode="aspectFill"></esay-loadimage>
				<view class="list-title-bg">
					<text class="list-type">{{item.type_name}}</text>
					<text class="list-title">{{item.name}}{{try2}}</text>
				</view>
				<view class="list-info">
					<view class="list-info-in">
						<view class="list-location elp1">{{item.city}}</view>
						<view class="list-time elp1">{{item.starttime}} - {{item.endtime}}</view>
					</view>
					<view class="list-money elp1">{{item.pricestr}}/人</view>
				</view>
				<view class="list-status" v-html="item.match_status.match_status_msg"></view>
			</view>
			<uni-load-more :status="moretype" iconType="snow"></uni-load-more>
			<!-- loading 的状态，可选值：more（loading前）、loading（loading中）、noMore（没有更多了） -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				try1:'',
				try2:'',
				moretype:'more',
				scrollTop:0,
				checktab:0,
				typeItems:[10,20,30,40],
				listItems:[],
				tabItems:[
					{
						name:'全部',
						src:'/static/images/index/in_allhig.png',
						srcur:'/static/images/index/in_allhig_hlighted.png'
					},{
						name:'最新',
						src:'/static/images/index/in_latest.png',
						srcur:'/static/images/index/in_latest_hlighted.png'
					},{
						name:'赛事',
						src:'/static/images/index/in_event.png',
						srcur:'/static/images/index/in_event_hlighted.png'
					},{
						name:'活动',
						src:'/static/images/index/in_calendar.png',
						srcur:'/static/images/index/in_calendar_hlighted.png'
					}
				],
				page:1,
				rows:10,
				bannerList:[]
			}
		},
		onLoad(e) {
			if(e.channel){
				uni.setStorage({
				    key: 'comephone',  
				    data: e.phone
				});  
				uni.setStorage({
				    key: 'channel',  
				    data: e.channel
				}); 
			}
			// uni.setNavigationBarTitle({
			// title:'设置标题(可以是变量)'
			// })
			this.getindex()
			
			// uni.getSystemInfo({
			//     success: function (res) {
			// 				console.log(res)
			//         console.log(res.model);
			//         console.log(res.pixelRatio);
			//         alert(res.screenHeight);
			//         console.log(res.windowHeight);
			//         console.log(res.language);
			//         console.log(res.version);
			//         console.log(res.platform);
			//     }
			// });
			this.getBanner();
		},
		methods: {
			closeWebview(){
				if(this.StatusBar > 0){
					let ws = plus.webview.getTopWebview();
					plus.webview.close(ws);
				} else {
					window.history.back()
				}
			},
			
			async getBanner(){
				  let response = await this.$http.post('/Site/banner',{},'',false);
				  if (response.rspInfo.rspCode == 1000) {
					  this.bannerList=response.rspData;
				  }
			},
			onPageScroll({scrollTop}) {
				this.scrollTop = scrollTop;
			},
			changetab(index){
				this.checktab=index;
				this.page=1;
				this.listItems=[];
				this.getindex()
			},
			goUrl(e){
				window.location.href=e.currentTarget.dataset.url;
			},
			godetail(e){
				uni.navigateTo({
					url:'../matchInfo/matchInfo?mid='+e.currentTarget.dataset.mid
				})
			},
			onReachBottom(){
				if(this.moretype!='noMore'){
					this.getindex();
				}
			},
			async getindex(){//得到活动列表
				let {page, rows, checktab, typeItems} = this;
				var type = typeItems[checktab];
				this.moretype = 'loading';
				try {
					var data = {page:page,rows:rows,type:type}
				  let response = await this.$http.post('/Site/index',data,'',false);
					  console.log(JSON.stringify(response));
				  if (response.rspInfo.rspCode == 1000) {
						this.listItems=this.listItems.concat(response.rspData.list);
						if(page*rows<response.rspData.count){
							this.moretype = 'more';
						}else{
							this.moretype = 'noMore';
						}
						this.page = this.page+1;
				  }else{
						this.moretype = 'more';
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
	@import "@/common/style/style.scss";
</style>

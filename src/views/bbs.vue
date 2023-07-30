<template>
    <scroller
        class="list"
        :pulling="pulling"
        :dragging="dragging"
        :pullLength="60"
        :loadLength="60"
        :pull="pull"
        :load="onLoading"
    >
        <template v-slot:pulling>
            <refresh class="refreshing">
                <text>{{refreshText}}</text>
            </refresh>
        </template>
        <div class="information_list">
            <div
                v-for="item in list"
                :key="item.id"
                class="information_item"
                @click="choose(item)">
                <div class="header">
                    <div style="display: flex;flex-direction: row;align-items: center;">
                        <text class="information_item_title" v-if="item.title">{{item.title}}</text>
                        <text v-if="item.type===3" class="modal">问答</text>
                    </div>
                    <div @click.stop="chooseMore(item)">
                        <pic src="more" width="50" height="50"/>
                    </div>
                </div>
                <div v-if="item.creator" class="creator">
                    <pic
                        :class="item.creator.icon?['creator_pic']:['creator_pic_empty']"
                        :src="item.creator.icon?(item.creator.icon.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_100,w_100'):'user'"
                        :width="item.creator.icon?50:40"
                    />
                    <text class="creator_name">{{creatorName(item)}}</text>
                    <text class="creator_createTime">{{item.time_begin}}</text>
                </div>
                <text v-if="item.desc" class="information_item_desc">{{item.desc}}</text>
                <div class="imgs">
                    <div v-if="item.img && item.img[0]==='['">
                        <div v-if="JSON.parse(item.img).length===1">
                            <pic
                                v-for="imgUrl in JSON.parse(item.img)"
                                :key="imgUrl"
                                class="information_item_pic_small"
                                :src="imgUrl.replace('http://','https://')+'?x-oss-process=image/resize,w_1000'"
                                :width="670"
                            />
                        </div>
                        <div v-else>
                            <pic
                                v-for="imgUrl in JSON.parse(item.img)"
                                :key="imgUrl"
                                class="information_item_pic_small"
                                :src="imgUrl.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_300,w_300'"
                                :width="208"
                            />
                        </div>
                    </div>
                    <div v-else-if="item.img">
                        <pic
                            class="information_item_pic"
                            :src="item.img.replace('http://','https://')+'?x-oss-process=image/resize,w_1000'"
                            :width="670"
                        />
                    </div>
                </div>
                <!--                    <div v-if="item.type===3">-->
                <!--                        <text class="information_item_tips">最佳答案将奖励10金币</text>-->
                <!--                    </div>-->
                <div class="information_item_answerCount">
                    <pic src="comment" style="opacity: 0.6;" width="32" height="32"/>
                    <text class="information_item_answerCount_number">{{item.answerCount}}</text>
                </div>
            </div>
        </div>
        <Popup
            :show="showReport"
            @close="showReport=false"
            title="操作"
        >
            <div class="bbsReportTools">
                <div class="bbsReportToolsItem" @click="reportSent">
                    <pic src="police" style="opacity: 0.6;" width="64" height="64"/>
                    <text class="text">举报</text>
                </div>
                <div class="bbsReportToolsItem" @click="disableMessage">
                    <pic src="disable" style="opacity: 0.6;" width="64" height="64"/>
                    <text class="text">屏蔽此条动态</text>
                </div>
                <div class="bbsReportToolsItem" @click="userShield">
                    <pic src="user_shield" style="opacity: 0.6;" width="64" height="64"/>
                    <text class="text">屏蔽此人动态</text>
                </div>
            </div>
            <div class="bbsReportCancel">
                <Button
                    text="取消"
                    @click="showReport=false"
                >
                </Button>
            </div>
        </Popup>
        <template v-slot:loading>
            <loading class="loading">
                <text>{{loadingText}}</text>
            </loading>
        </template>
    </scroller>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import pic from '../components/icon';
import {updateUsed} from '../plugin/information.js';
import InformationDetail from "../views/informationDetail.vue";
import request from '../plugin/request'
import Popup from '../components/Popup.vue'
import Button from '../components/Button.vue'
// import { WxcPopup, WxcDialog } from 'weex-ui';

// var modal = weex.requireModule('modal');

export default {
    name: 'bbs',
    created() {
        this.refresh();
        // this.logAction('friend');
        // this.setRightButton([{
        //     img: 'add',
        //     click: this.clickAdd.bind(this)
        // }])
    },
    data() {
        return {
            loading: false,
            showInsert: true,
            showLoading: 'hide',
            refreshText: '',
            loadingText: '',
            list: [],
            isIpx: navigator.userAgent.includes('iPhone'),
            showReport: false,
            chooseMoreItem: null
        }
    },
    computed: {
        ...mapGetters('main', ['userInfo'])
    },
    methods: {
        ...mapActions('main', ['setPath', 'setToken', 'setUserInfo']),
        pulling(isHasLength) {
            if(isHasLength) {
                this.refreshText = '松手后刷新'
            } else {
                this.refreshText = '下拉刷新'
            }
        },
        dragging(isHasLength) {
            if(isHasLength) {
                this.loadingText = '松手后加载更多'
            } else {
                this.loadingText = '上拉刷新'
            }
        },
        refresh() {
            return new Promise(resolve => {
                if (this.loading === false) {
                    this.loading = true;
                    let lastId = this.list.length > 0 ? Math.max(...this.list.map(item => item.id)) : 0;
                    request.get('/systemInformation/getNewList?lastId=' + lastId + '&types=1,2,3').then(res => {
                        res.forEach(item => {
                            this.list.unshift(item);
                        });
                    }).finally(e => {
                        this.loading = false;
                        resolve()
                        
                        // // 保证当前不要太少，否则，没有滚动条
                        // if (lastId === 0 && this.list.length < 10 && this.list.length > 0) {
                        //     setTimeout(() => {
                        //         this.onLoading()
                        //     }, 100)
                        // }
                    });
                    updateUsed('information')
                }
            })
        },
        async pull() {
            function sleep(time) {
                return new Promise((resolve)=>{
                    setTimeout(() => {
                        resolve()
                    }, time)
                })
            }
            this.refreshText = '刷新中'
            await Promise.all([
                this.refresh(),
                sleep(300)
            ])
            this.refreshText = ''
        },
        async onLoading() {
            if (this.loading === false) {
                this.loading = true;
                this.showLoading = 'show'
                let oldEstId = Math.min(...this.list.map(item => item.id));
                const res = await request.get('/systemInformation/getOlder?oldEstId=' + oldEstId + '&types=1,2,3')
                res.forEach(item => {
                    this.list.push(item);
                });
                this.loading = false;
                this.showLoading = 'hide'
            }
        },
        choose(item) {
            if (item.type === 1) {
                this.openNewPage(InformationDetail, {
                    id: item.id
                })
            } else if (item.type === 2) {
                this.$router.push({path: '/friend/dailyQuestion/' + item.id})
            } else if (item.type === 3) {
                this.$router.push('/zhidaoDetail/'+item.id)
                // this.openNewPage(zhidaoDetail, {
                //     id: item.id
                // })
            }
        },
        chooseMore(item) {
            this.chooseMoreItem = item;
            this.showReport = true;
        },
        reportSent() {
            request.post('/zhidao/report/' + this.chooseMoreItem.id)
                .then(res => {
                    if (res.result === true) {
                        // modal.toast({
                        //     'message': res.data,
                        //     'duration': 2.0
                        // })
                        setTimeout(() => {
                            this.showReport = false;
                        }, 100)
                    }
                })
                .catch(e => {
                    this.showReport = false;
                });
        },
        disableMessage() {
            request.post('/systemInformation/disableMessage/' + this.chooseMoreItem.id)
                .then(res => {
                    if (res.result === true) {
                        // modal.toast({
                        //     'message': res.data,
                        //     'duration': 2.0
                        // })
                        let index = this.list.findIndex(item => {
                            return this.chooseMoreItem.id === item.id;
                        })
                        if (index > -1) {
                            this.list.splice(index, 1)
                        }
                        //
                        setTimeout(() => {
                            this.showReport = false;
                        }, 100)
                    }
                })
                .catch(() => {
                    this.showReport = false;
                });
        },
        userShield() {
            request.post('/systemInformation/disableMessage/' + this.chooseMoreItem.id)
                .then(res => {
                    if (res.result === true) {
                        // modal.toast({
                        //     'message': res.data,
                        //     'duration': 2.0
                        // })
                        let index = this.list.findIndex(item => {
                            return this.chooseMoreItem.id === item.id;
                        })
                        if (index > -1) {
                            this.list.splice(index, 1)
                        }
                        //
                        setTimeout(() => {
                            this.showReport = false;
                        }, 100)
                    }
                })
                .catch(e => {
                    this.showReport = false;
                });
        },
        clickAdd() {
            this.$router.push('/addQuestion')
        },
        creatorName(item) {
            return item.creator.name ? item.creator.name : ('用户' + item.creator.account);
        },
    },
    components: {
        pic,
        Popup,
        Button,
        // WxcPopup,
        // WxcDialog
    }
}
</script>

<style scoped lang="less">
    .tabContent {
        width: 750px;
        height: 80px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom-style: solid;
        border-bottom-color: #afafaf;
        border-bottom-width: 1px;

        &Item {
            width: 200px;
            text-align: center;
        }
    }

    .list {
        flex: 1;
        width: 100%;
        background-color: #f2f2f2;
    }

    .information_item {
        background-color: white;
        border-bottom-style: solid;
        border-bottom-width: 20px;
        border-bottom-color: #f2f2f2;
        padding: 18px 42px;
        position: relative;
        .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        &_title {
            font-size: 40px;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        &_desc {
            font-size: 34px;
            color: #4d4d4d;
        }

        &_pic {
            border-style: solid;
            border-width: 1px;
            border-color: #e2e2e2;
            border-radius: 10px;
        }

        &_pic_small {
            border-style: solid;
            border-width: 1px;
            border-color: #e2e2e2;
            border-radius: 10px;
            margin-right: 20px;
            margin-bottom: 20px;
        }

        &_tips {
            color: #d3292d;
            font-size: 26px;
        }

        &_answerCount {
            margin-top: 20px;
            display: flex;
            flex-direction: row;
            align-items: center;

            &_number {
                margin-left: 12px;
                font-size: 24px;
                font-family: PingFangSC-Medium;
                color: #565656;
            }
        }
    }

    .ending {
        font-size: 32px;
        padding: 30px;
        color: #b6b6b6;
        text-align: center;
    }

    .refreshing {
        width: 750px;
        height: 100px;
        line-height: 100px;
        text-align: center;
        color: #9d9d9d;
        border-bottom: solid 1px #cdcdcd;
    }

    .loading {
        width: 750px;
        height: 100px;
        bottom: 0px;
        line-height: 100px;
        text-align: center;
        color: #9d9d9d;
    }

    .creator {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;

        &_pic {
            border-radius: 25px;
            margin-right: 10px;

            &_empty {
                border-radius: 0;
                margin-right: 10px;
                opacity: 0.4;
            }
        }

        &_name {
            color: #979797;
            flex: 1;
            font-size: 28px;
        }

        &_createTime {
            color: #979797;
            font-size: 28px;
        }
    }

    .input {
        border-style: solid;
        border-width: 2px;
        border-color: #004e3b;
        margin-left: 30px;
        width: 200px;
        height: 64px;
        font-size: 36px;
        border-radius: 16px;
        text-align: center;
        padding: 0 10px;
    }

    .imgs {
        width: 700px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .modal {
        font-size: 24px;
        background-color: rgba(0, 121, 92, 0.59);
        height: 40px;
        line-height: 40px;
        width: 70px;
        color: white;
        text-align: center;
        border-radius: 20px;
        margin-left: 10px;
    }

    .bbsReportTools {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding-top: 40px;
        padding-bottom: 40px;

        &Item {
            width: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .text {
                font-size: 28px;
                color: #404040;
            }
        }
    }

    .bbsReportCancel {
        height: 100px;
        border-top-style: solid;
        border-top-width: 1px;
        padding: 20px;
        border-top-color: #636363;
    }
</style>

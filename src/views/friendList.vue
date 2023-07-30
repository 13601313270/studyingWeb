<template>
    <div style="flex: 1;">
        <div v-if="showInsert" class="insert" @click="$emit('close')">
            <div class="insertInner">
                <div class="formItem" style="justify-content: center">
                    <text style="font-size: 40px;">我的信息</text>
                </div>
                <div class="formItem" style="justify-content: center">
                    <pic
                        :src="userInfo.icon+'?x-oss-process=image/resize,m_fill,h_200,w_200'"
                        width="200"
                        height="200"
                    />
                </div>
                <div class="formItem">
                    <text style="width: 100px;">微信：</text>
                    <input class="inputValue" v-model="weChart"/>
                </div>
                <div class="formItem">
                    <text style="width: 100px;">QQ：</text>
                    <input class="inputValue" v-model="qq"/>
                </div>
                <text style="width: 200px;margin-top: 50px;">交友宣言：</text>
                <div class="formItem">
                    <textarea class="textAreaValue" rows="3" style="width:500px;height:200px;"
                              v-model="content"></textarea>
                </div>
                <div style="display: flex;flex-direction: row;justify-content: flex-end">
                    <Button class="publishButton" text="发布" icon="light" @click="publish"/>
                </div>
            </div>
        </div>
        <scroller class="list">
            <refresh @refresh="refresh" :display="refreshLoading">
                <text class="refreshing">{{refreshText}}</text>
            </refresh>
            <div class="userList">
                <div v-for="item in dataList" class="userItem">
                    <div style="display: flex;flex-direction: row;margin-bottom: 20px;">
                        <pic
                            :src="item.userInfo.icon+'?x-oss-process=image/resize,m_fill,h_130,w_130'" width="130"
                            height="130"
                            style="border-radius:10px;overflow: hidden"
                        />
                        <div>
                            <text style="font-size: 36px;width: 200px;margin-left: 15px;">{{item.userInfo.name}}</text>
                        </div>
                    </div>
                    <text class="userInfoTip">性别：{{item.userInfo.sex===1?'女':'男'}}</text>
                    <text class="userInfoTip">城市：{{item.userInfo.city}}</text>
                    <text class="userInfoTip">年纪：高{{item.userInfo.grand}}</text>
                    <text
                        class="userInfoTip"
                        @click="clipboard(item.userInfo.weChartAccount)"
                    >微信：{{item.userInfo.weChartAccount}}</text>
                    <text
                        class="userInfoTip"
                        @click="clipboard(item.userInfo.qqAccount)"
                    >QQ：{{item.userInfo.qqAccount}}</text>
                    <text class="userInfoTip">交友格言：</text>
                    <text class="userInfoTip">{{item.content}}</text>
                </div>
            </div>
            <loading @loading="onLoading" :display="showLoading">
                <text class="loading">加载更多数据</text>
            </loading>
        </scroller>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import Button from "@/components/Button";
    import Pic from "@/components/icon";

    // const clipboard = weex.requireModule('clipboard');

    // const modal = weex.requireModule('modal');

    export default {
        name: "",
        props: {
            showInsert: Boolean
        },
        data() {
            return {
                userInfo: null,
                page: 0,
                weChart: '',
                qq: '',
                content: '',
                dataList: [],
                refreshText: '下拉刷新',
                loading: false,
                refreshLoading: 'hide',
                showLoading: 'hide',
                hasToEnd: false
            }
        },
        created() {
            this.axios.get('/user/getInfo').then(res => {
                this.userInfo = res;
                this.weChart = res.weChartAccount;
                this.qq = res.qqAccount;
            })
            this.initList();
        },
        methods: {
            async initList() {
                this.loading = true;
                const list = await this.axios.get('/expansionFriend/list/' + this.page);
                this.dataList = [...this.dataList, ...list]
                if (list.length === 0) {
                    this.hasToEnd = true;
                }
                this.loading = false;
            },
            async refresh() {
                if (this.loading === false) {
                    this.page = 0;
                    this.refreshLoading = 'show'
                    this.refreshText = '刷新中'
                    this.dataList = [];
                    await this.initList();
                    this.refreshLoading = 'hide'
                    this.refreshText = '下拉刷新'
                }
            },
            async onLoading() {
                if (this.loading === false) {
                    if (!this.hasToEnd) {
                        this.page++;
                        this.showLoading = 'show'
                        await this.initList()
                        this.showLoading = 'hide'
                    } else {
                        // modal.toast({
                        //     'message': '无更多数据',
                        //     'duration': 2.0
                        // })
                    }
                }
            },
            publish() {
                if (!this.weChart && !this.qq) {
                    // modal.toast({
                    //     'message': '微信和QQ至少提供一项',
                    //     'duration': 2.0
                    // })
                    return;
                }
                if (!this.content) {
                    // modal.toast({
                    //     'message': '请编辑交友宣言',
                    //     'duration': 2.0
                    // })
                    return;
                }
                this.$emit('close');
                this.axios.post('/expansionFriend/set', {
                    weChart: this.weChart,
                    qq: this.qq,
                    content: this.content,
                }).then((res) => {
                    this.page = 0;
                    this.initList();
                })
            },
            clipboard(val) {
                if (val) {
                    // clipboard.setString(val);
                    // modal.toast({
                    //     'message': '已经复制到剪切板',
                    //     'duration': 2.0
                    // })
                }
            }
        },
        components: { Pic, Button }
    }
</script>

<style scoped lang="less">
    .insert {
        position: fixed;
        top: -100px;
        bottom: 0;
        left: 0;
        width: 750px;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;

        &Inner {
            width: 580px;
            padding: 36px;
            background-color: white;
            border-radius: 30px;
            display: flex;
        }
    }

    .inputValue {
        width: 400px;
        height: 80px;
        border-style: solid;
        border-width: 1px;
        border-color: #858585;
        border-radius: 10px;
        text-align: left;
        color: #5d5d5d;
        padding-left: 10px;
    }

    .textAreaValue {
        border-style: solid;
        border-width: 1px;
        border-color: #858585;
        border-radius: 10px;
    }

    .formItem {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 10px;
    }

    .publishButton {
        width: 200px;
        margin-top: 20px;
        margin-right: 8px;
        text-align: center;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .list {
        flex: 1;
        background-color: #fafffd;
    }

    .userList {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .userItem {
        border-style: solid;
        width: 350px;
        margin: 20px 10px;
        border-width: 1px;
        border-color: #858585;
        border-radius: 30px;
        padding: 20px;
        z-index: 2;
        background-color: white;
    }

    .userInfoTip {
        font-size: 30px;
        color: #494949;
    }

    .refreshing {
        width: 750px;
        color: #494949;
        text-align: center;
    }

    .loading {
        width: 750px;
        color: #494949;
        text-align: center;
    }
</style>

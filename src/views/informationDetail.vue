<template>
    <div>
        <div class="information_item">
            <text class="information_item_title">{{info.title}}</text>
            <div class="information_item_creator" v-if="info.creator">
                <pic class="information_item_creator_pic" :src="info.creator.icon.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_100,w_100'" width="50"/>
                <text class="information_item_creator_text">{{info.creator.name}}</text>
                <!--<text>{{info.creator}}</text>-->
            </div>
            <div v-if="loading">
                <text>加载中</text>
                <pic src="loading"/>
            </div>
            <text class="information_item_desc">{{info.desc}}</text>
            <div
                v-if="info.img"
                @click="showImgDetail(info.img)">
                <pic
                    class="information_item_pic"
                    :src="info.img" :width="670"/>
            </div>
            <div v-if="info.content">
                <div class="information_item_content" v-html="info.content"></div>
            </div>
            <div class="tools">
                <text style="font-size: 30px;">全部评论({{answerList.length}})</text>
                <div style="flex: 1;"></div>
                <Button
                    type="white"
                    style="width: 180px;height:70px;"
                    text="写回答"
                    @click="isBottomShow=true"
                ></Button>
            </div>
            <div class="zhidao_content">
                <div v-for="(item) in answerList" class="zhidao_answer_item">
                    <div v-if="item.creator" class="zhidao_answer_item_creator">
                        <pic
                            v-if="item.creator.icon"
                            class="zhidao_answer_item_creator_pic"
                            :src="item.creator.icon.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_100,w_100'" width="50"
                        />
                        <text class="zhidao_answer_item_creator_name">{{item.creator.name?item.creator.name:('用户'+item.creator.account)}}</text>
                        <text class="zhidao_answer_item_creator_ctime">{{item.ctime}}</text>
                    </div>
                    <text class="zhidao_answer_item_content">{{item.content}}</text>
                    <div v-if="item.is_best===1" style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center">
                        <pic src="best" width="50" height="50"/>
                        <text style="color:#552e21;font-size:30px;padding-top:5px;">最佳答案</text>
                    </div>
                </div>
            </div>
            <!--<text v-if="info.others">{{info.others}}</text>-->
        </div>
        <!-- <wxc-popup
            popup-color="white"
            :show="isBottomShow"
            pos="bottom"
            @wxcPopupOverlayClicked="isBottomShow=false"
            :height="isIpx?760:720"
        >
            <div style="margin-top: 24px;"></div>
            <textarea class="content" v-model="answerContent" placeholder="请输入答案"></textarea>
            <div class="answer_tools">
                <Button
                    type="white"
                    style="width: 180px;height:70px"
                    text="发送"
                    @click="sentAnswer"
                ></Button>
            </div>
        </wxc-popup> -->
    </div>
</template>

<script>
import pic from '../components/icon';
// import Nat from 'natjs';
// import sqlClass from '../plugins/sql';
// import {WxcButton, WxcPopup} from 'weex-ui';
import Button from '../components/Button.vue'
// var modal = weex.requireModule('modal');

export default {
    name: "informationDetail",
    props: {
        id: Number
    },
    data() {
        return {
            isBottomShow: false,
            imgsSize: {},
            info: {},
            answerContent: '',
            answerList: [],
            isIpx: navigator.userAgent.includes('iPhone'),
            loading: false,
        }
    },
    async created() {

        // let option = new sqlClass('readFinish')
        //
        // let option2 = new sqlClass('readFinish')

        this.loading = true;
        this.axios.get('/systemInformation/detail/' + this.id).then(res => {
            this.info = res;
        }).finally(() => {
            this.loading = false;
        });
        this.uploadAnswerList();
    },
    methods: {
        onImageLoad(event, src) {
            if(event.success) {
                this.$set(this.imgsSize, src, {
                    naturalWidth: event.size.naturalWidth,
                    naturalHeight: event.size.naturalHeight
                });
            }
        },
        imgSizeInfo(src) {
            let styleWidth = 650;
            if(this.imgsSize[src]) {

                let zoom = 1.5;
                if(this.imgsSize[src].naturalHeight > 1200) {
                    zoom = 1200 / this.imgsSize[src].naturalHeight;
                }
                return {
                    width: parseInt(this.imgsSize[src].naturalWidth * zoom) + 'px',
                    height: parseInt(this.imgsSize[src].naturalHeight * zoom) + 'px'
                };
            } else {
                if(styleWidth) {
                    return {
                        width: parseInt(styleWidth) + 'px',
                        height: '100px'
                    };
                } else {
                    return {
                        width: '100px', height: '100px'
                    };
                }
            }
        },
        showImgDetail(img) {
            // Nat.image.preview(img)
        },
        sentAnswer() {
            if (this.answerContent.length > 0) {
                this.axios.post('/zhidao/answer/' + this.id, {
                    content: this.answerContent
                }).then(res => {
                    if (res > 0) {
                        // modal.toast({
                        //     'message': '已回答',
                        //     'duration': 2.0
                        // })
                        this.answerContent = '';
                        this.isBottomShow = false;
                        this.uploadAnswerList();
                    }
                });
            } else {
                // modal.toast({
                //     'message': '请填写内容',
                //     'duration': 2.0
                // })
            }
        },
        uploadAnswerList() {
            this.axios.get('/zhidao/answer/' + this.id).then(res => {
                this.answerList = res;
            });
        },
    },
    components: {
        pic,
        Button,
        // WxcButton,
        // WxcPopup
    }
}
</script>

<style scoped lang="less">
    .information_item {
        padding: 40px 0 40px 0;

        &_title {
            text-align: center;
            font-size: 40px;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        &_creator {
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;

            &_pic {
                border-radius: 50px;
            }

            &_text {
                font-size: 24px;
                color: #949494;
            }
        }

        &_desc {
            padding: 0 20px 0 20px;
            font-size: 30px;
            margin-top: 20px;
            margin-bottom: 20px;
            color: #787878;
        }

        &_content {
            padding: 0 20px 0 20px;
            margin-top: 50px;
            font-size: 30px;
            color: #787878;
        }

        &_pic {
            margin: 0 20px 0 20px;
            border-style: solid;
            border-width: 1px;
            border-color: #e2e2e2;
        }
    }

    .imgFloat {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(130, 133, 130, 0.75);
    }

    .tools {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 750px;
        height: 100px;
        margin-top: 30px;
        padding: 0 10px 0 20px;
        background-color: #fcfcfc;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #cacaca;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #cacaca;
    }
    .zhidao_answer_item {
        padding: 20px;
        border-bottom-style: solid;
        border-bottom-width: 10px;
        border-bottom-color: #f2f2f2;

        &_content {
            color: #585858;
            margin-bottom: 10px;
            font-size: 28px;
        }

        &_creator {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 10px;

            &_pic {
                border-radius: 25px;
                margin-right: 10px;
            }

            &_name {
                color: #919191;
                font-size: 28px;
                line-height: 28px;
                flex: 1;
            }

            &_ctime {
                color: #a9a9a9;
                text-align: right;
                font-size: 28px;
                line-height: 28px;
            }
        }
    }
    .answer_tools {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding-right: 20px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .content {
        border-style: solid;
        border-width: 2px;
        width: 710px;
        height: 580px;
        margin-left: 20px;
        border-color: #868d92;
        font-size: 36px;
        border-radius: 18px;
        padding: 10px;
    }
</style>

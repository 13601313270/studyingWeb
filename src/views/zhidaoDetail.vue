<template>
    <div style="flex: 1;background-color: white">
        <scroller style="height: 100%">
            <div class="information_item">
                <text class="information_item_title">{{info.title}}</text>
                <div class="information_item_creator" v-if="info.creator">
                    <pic class="information_item_creator_pic" v-if="info.creator.icon" @click="showImgDetail(info.creator.icon.replace('http://','https://'))" :src="info.creator.icon.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_100,w_100'" width="50"/>
                    <text class="information_item_creator_text">{{info.creator.name?info.creator.name:('用户'+info.creator.account)}}</text>
                </div>
                <div class="imgs">
                    <div v-if="info.img && info.img[0]==='['">
                        <div v-if="JSON.parse(info.img).length===1">
                            <pic
                                class="img_big"
                                @click="showImgDetail(JSON.parse(info.img)[0])"
                                :src="JSON.parse(info.img)[0].replace('http://','https://')+'?x-oss-process=image/resize,w_1000'"
                                :width="650"
                            />
                        </div>
                        <template v-else>
                            <div
                                v-for="imgUrl in JSON.parse(info.img)"
                                @click="showImgDetail(imgUrl)"
                            >
                                <pic
                                    class="img_small"
                                    :src="imgUrl.replace('http://','https://')+'?x-oss-process=image/resize,m_fill,h_300,w_300'"
                                    :width="208"
                                />
                            </div>
                        </template>
                    </div>
                    <div v-else-if="info.img">
                        <pic
                            class="information_item_pic"
                            :src="info.img.replace('http://','https://')+'?x-oss-process=image/resize,w_1000'"
                            :width="670"
                        />
                    </div>
                </div>
                <div v-if="info.content">
                    <div class="information_item_content" v-html="info.content"></div>
                </div>
                <!--<text v-if="info.others">{{info.others}}</text>-->
            </div>
            <div class="information_tools">
                <div class="information_tools_item" @click="report">
                    <pic src="warning" style="opacity: 0.6;" width="32" height="32"/>
                    <text class="warningText">举报</text>
                </div>
            </div>
            <div class="tools">
                <text class="title">全部回答({{answerList.length}})</text>
                <div style="flex: 1;"></div>
                <Button
                    type="white"
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
        </scroller>
        <Popup
            title="回复"
            :show="isBottomShow"
            @close="isBottomShow = false"
            >
            <textarea class="content" v-model="answerContent" placeholder="请输入答案"></textarea>
            <div class="answer_tools">
                <Button
                    primary
                    style="width: 180px;"
                    text="发送"
                    @click="sentAnswer"
                ></Button>
            </div>
        </Popup>
        <Popup
            title="是否举报该条问答"
            :show="showReport"
            @close="showReport=false"
        >
            <div class="reportContent">
                <div class="text">
                    当您发现该条问题存在，广告、暴力、色情、政治有害、欺诈、侵权等行为，请反馈给我们，我们将在24小时内解决。
                </div>
                <div style="display: flex; flex-direction: row">
                    <Button
                        text="取消"
                        @click="showReport=false"
                    ></Button>
                    <Button
                        warning
                        text="举报"
                        @click="reportSent"
                    ></Button>
                </div>
            </div>
        </Popup>
        <!--
        <wxc-dialog
            title="是否举报该条问答"
            :show="showReport"
            @wxcDialogCancelBtnClicked="showReport=false"
            @wxcDialogConfirmBtnClicked="reportSent"
            @wxcDialogNoPromptClicked="showReport=false"
            content="当您发现该条问题存在，广告、暴力、色情、政治有害、欺诈、侵权等行为，请反馈给我们，我们将在24小时内解决。"
        >
        </wxc-dialog>
        -->
    </div>
</template>
<script>
import pic from '../components/icon';
// import Nat from 'natjs';
import Button from '../components/Button.vue'
// import {WxcPopup, WxcDialog} from 'weex-ui';
// import sqlClass from '../plugins/sql';
// var modal = weex.requireModule('modal');
import Popup from '../components/Popup.vue'
import request from '../plugin/request'
import toast from '../plugin/toast'
import {showImg} from '../plugin/imagePreview'

export default {
    name: "informationDetail.vue",
    props: {
        id: Number
    },
    data() {
        return {
            imgsSize: {},
            answer: [],
            info: {},
            isBottomShow: false,
            answerContent: '',
            answerList: [],
            isIpx: navigator.userAgent.includes('iPhone'),
            showReport: false,
            sss: '',
        }
    },
    async created() {
        console.log('-----------------')
        console.log(this.$route.params.id)
        request.get('/systemInformation/detail/' + this.$route.params.id).then(res => {
            this.info = res;
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
            showImg(img)
        },
        uploadAnswerList() {
            request.get('/zhidao/answer/' + this.$route.params.id).then(res => {
                this.answerList = res;
                // this.sss = JSON.stringify(res);
            });
        },
        sentAnswer() {
            if (this.answerContent.length > 0) {
                request.post('/zhidao/answer/' + this.$route.params.id, {
                    content: this.answerContent
                }).then(res => {
                    if(res > 0) {
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
        report() {
            this.showReport = true;
        },
        reportSent() {
            request.post('/zhidao/report/' + this.info.id).then(res => {
                if (res.result === true) {
                    toast({
                        'message': res.data,
                        'duration': 2000
                    })
                    setTimeout(() => {
                        this.showReport = false;
                    }, 100)
                }
            });
        }
    },
    components: {
        pic,
        Button,
        Popup,
        // WxcPopup,
        // WxcDialog
    }
}
</script>
<style scoped lang="less">
    .information_item {
        padding: 30px 20px 30px 20px;

        &_title {
            text-align: center;
            font-size: 40px;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        &_creator {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;

            &_pic {
                border-radius: 50px;
                margin-right: 10px;
            }

            &_text {
                font-size: 24px;
                color: #949494;
            }
        }

        &_desc {
            font-size: 30px;
            margin-top: 20px;
            margin-bottom: 20px;
            color: #787878;
        }

        &_content {
            margin-top: 30px;
            font-size: 30px;
            color: #787878;
        }

        &_pic {
            border-style: solid;
            border-width: 1px;
            border-color: #e2e2e2;
        }
    }

    .information_tools {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 30px 20px;

        &_item {
            display: flex;
            flex-direction: row;
            align-items: center;
            .warningText {
                font-size: 28px;
                color: #e75845;
            }
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

    .answer_title {
        line-height: 80px;
        text-align: center;
        font-size: 40px;
        color: #4f4f4f;
    }

    .tools {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 750px;
        height: 120px;
        padding: 0 20px 0 20px;
        background-color: #fcfcfc;
        border-top-width: 2px;
        border-top-style: solid;
        border-top-color: #cacaca;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #cacaca;
        box-sizing: border-box;
        .title {
            font-size: 30px;
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
        box-sizing: border-box;
        resize: none;
    }

    .creator {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;

        &_pic {
            border-radius: 25px;
            margin-right: 10px;
        }

        &_name {
            color: #979797;
            font-size: 28px;
        }
    }

    .imgs {
        width: 700px;
        margin-top: 25px;
        margin-left: 25px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .img {
        width: 220px;
        height: 220px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: grey;
    }

    .img_big {
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: grey;
    }

    .img_small {
        width: 220px;
        height: 220px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 10px;
        border-style: solid;
        border-width: 1px;
        border-color: grey;
    }
    .reportContent {
        padding: 20px;
        .text {
            margin-bottom: 40px;
        }
        :deep(.button) {
            flex-grow: 1;
            &:first-child {
                margin-right: 20px
            }
        }
    }
</style>

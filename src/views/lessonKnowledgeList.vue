<template>
    <div class="content">
        <text class="title">{{info.title}}知识点</text>
        <scroller class="scroll">
            <div style="width: 100%;display: flex;flex-direction: column;align-items: center;">
                <div
                    class="lessons"
                    v-for="item in list.filter(item2 => item2.type===1)"
                    :key="item.id"
                >
                    <text class="lessons_title">{{item.title}}</text>
                    <div
                        v-if="item.img"
                        @click="showImgDetail(item)">
                        <pic
                            class="item_pic"
                            :src="item.img.replace('http://','https://')" :width="600"/>
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
// import Nat from 'natjs';
import pic from '../components/icon';
import request from '../plugin/request'
import {showImg} from '../plugin/imagePreview'

export default {
    name: 'lessonQuestionList',
    created() {

    },
    activated(){
        request.get('/lesson/' + this.$route.params.id + '/info').then(res => {
            this.info = res;
            // self.setPath([
            //     {name: '12', path: '/source/' + self.course},
            //     {name: res.title + '知识点'},
            // ]);
        });
        request.get('/knowledge/lesson/' + this.$route.params.id).then(res => {
            this.list = res;
        });
        // this.logAction('lessonKnowledgeList');
    },
    data() {
        return {
            info: {},
            list: [],
        }
    },
    methods: {
        ...mapActions('main', ['setPath']),
        showImgDetail(detail) {
            console.log(1111, detail)
            if (detail.content) {
                this.$router.push('/lesson/'+this.$route.params.id+'/knowledge/'+detail.id)
                // showImg(detail.img)
                // Nat.image.preview(detail.img)
            } else {
                showImg(detail.img)
            }
        }
    },
    components: { pic }
}
</script>

<style scoped lang="less">
    .content {
        width: 750px;
        height: 100%;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f8f8f8;
        overflow: hidden;
        box-sizing: border-box;
        .title {
            font-size: 40px;
            margin-bottom: 20px;
        }
        .scroll {
            display: flex;
            flex-direction: column;
            overflow: auto;
            width: 750px;
            align-items: center;
        }
    }

    .lessons {
        display: flex;
        margin: 15px;
        position: relative;
        flex-direction: column;
        width: 650px;
        border-style: solid;
        border-color: #e0e0e0;
        border-width: 2px;
        background-color: white;
        float: left;
        flex-shrink: 0;
        padding: 30px 20px 10px;
        box-sizing: border-box;
        border-radius: 8px;

        &_title {
            font-size: 42px;
            text-align: center;
            margin-bottom: 30px;
        }

        &_content {
            display: flex;
            width: 600px;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap
        }
    }

    .question_page {
        display: flex;
        flex-direction: row;

        &_button {
            width: 160px;
            text-align: center;
            line-height: 80px;
            font-size: 32px;
            color: #353535;
            float: left;
            height: 80px;
            border-style: solid;
            border-width: 1px;
            border-color: #54796e;
            border-radius: 20px;
            margin: 10px;
        }
    }

    .item_pic {
        border-style: solid;
        border-width: 1px;
        border-color: #e2e2e2;
    }
</style>

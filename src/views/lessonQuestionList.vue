<template>
    <div>
        <div style="height: 100%" @scroll="scroll">
            <div class="content">
                <div class="lessons" v-for="item in pois">
                    <text class="lessons_title">{{item.name}}入门</text>
                    <div class="lessons_content">
                        <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi,1)" @click="quizQuestions(item.poi,1,quizIndex-1)">题组 {{quizIndex}}</text>
                    </div>
                </div>
                <div class="lessons" v-for="item in pois">
                    <text class="lessons_title">{{item.name}}基础</text>
                    <div class="lessons_content">
                        <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi,3)" @click="quizQuestions(item.poi,3,quizIndex-1)">题组 {{quizIndex}}</text>
                    </div>
                </div>
                <div class="lessons" v-for="item in pois">
                    <text class="lessons_title">{{item.name}}加强</text>
                    <div class="lessons_content">
                        <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi,5)" @click="quizQuestions(item.poi,5,quizIndex-1)">题组 {{getPageCount(item.poi,5).length>1?quizIndex:''}}</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex';
import request from '../plugin/request'

export default {
    name: 'lessonQuestionList',
    created() {
        this.init()
        // this.logAction('lessonQuestionList');
    },
    activated() {
        if(this.id !== this.$route.params.id) {
            this.init()
        }
    },
    data() {
        return {
            id: -1,
            pois: [],
            countList: []
        }
    },
    methods: {
        ...mapActions('main', ['setPath']),
        init() {
            this.id = this.$route.params.id;
            request.get('/lesson/' + this.$route.params.id + '/poi').then(res => {
                this.pois = res;
            });
            request.get('/lesson/' + this.$route.params.id + '/question/countListV2').then(res => {
                this.countList = res;
            });
        },
        getPageCount(poi, difficult) {
            let item = this.countList.find(item => {
                return item.difficult === difficult && poi === item.poi;
            });
            if(item) {
                return Math.max(Math.min(Math.round(item.count / 20), 20), 1);
            } else {
                return 0;
            }
        },
        quizQuestions(poi, difficult, page) {
            this.$router.push('/poi/' + poi + '/question/' + difficult + '/' + page);
        },
        scroll() {
            console.log(111)
        },
    }
}
</script>

<style scoped lang="less">
    .content {
        width: 750px;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f8f8f8;
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
        border-radius: 18px;

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
</style>

<template>
    <div class="content" :class="{ios: isipx}" v-if="content">
        <VideoLesson
            :content="content"
            @firstPlay="firstPlay"
            @playStep="playStep"
            @end="end"
            :actions="[{text: '去做题',action: gotoQuestion}]"
        />
    </div>
</template>
<script>
import {mapActions} from 'vuex'
import VideoLesson from "../components/video.vue";
import request from '@/plugin/request'
import {play, pause} from '../plugin/audio'

const Nat = {
    audio: {},//require('../plugins/index')
};

// function play(val) {
//     return new Promise((resolve) => {
//         Nat.audio.play(val, () => {
//         }, () => {
//             resolve();
//         });
//     });
// }

export default {
    name: 'lessonDetail',
    async mounted() {
        let self = this;
        // this.isipx = weex && (weex.config.env.deviceModel === 'iPhone10,3' || weex.config.env.deviceModel === 'iPhone10,6');
        this.isipx = false;// weex && weex.config.env.platform === 'iOS';
        request.get('/lesson/' + this.$route.params.id + '/detail').then(data => {
            self.content = data.content;
            self.title = data.title;
            self.course = data.course;
            request.get('/source/' + self.course + '/info').then(data => {
                // console.log(self.setPath);
                self.setPath([
                    {name: data.name, path: '/source/' + self.course},
                    {name: self.title + '课程'},
                ]);
            });
            self.loadImg = [];
        });
        // this.logAction('lessonDetail');
    },
    data() {
        return {
            content: null,
            title: '',
            course: 0,
            list: [],
            loadImg: [],
            playIndex: 0,
            isipx: false,
            recordId: null,
            isEnd: false,
        }
    },
    methods: {
        ...mapActions('main', ['setPath']),
        async firstPlay() {
            this.recordId = await request.post('/lesson/' + this.$route.params.id + '/record', {});
        },
        playStep(playIndex) {
            this.isEnd = false;
            if (this.recordId) {
                // request.put('/lesson/' + this.recordId + '/recordDetail', {
                //     data: {
                //         playTime: playIndex
                //     }
                // });
            }
        },
        end() {
            this.isEnd = true;
        },
        gotoQuestion() {
            this.$router.push('/lesson/' + this.$route.params.id + '/questionList');
        },
        back() {
            this.$router.replace('/source/' + this.course);
        },
    },
    beforeRouteLeave() {
        pause();
    },
    components: { VideoLesson }
}
</script>

<style scoped lang="less">
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: stretch;
        justify-content: space-between;
        background-color: #39723a;
        height: 100%;
        box-sizing: border-box;
        &.ios {
            padding-bottom: 20px;
        }
        /deep/ .tools {
            padding-bottom: env(safe-area-inset-bottom);
        }
    }

    .float {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        background-color: #f2fcfa;
        border-radius: 8px;

        box-shadow: 0 0 20px 0 #b1b1b1;
        width: 500px;
        left: 125px;
        top: 500px;
        padding: 20px;
        text-align: center;

        &_text {
            width: 460px;
            margin-top: 50px;
            color: #10261e;
        }
    }

    .background {
        width: 750px;
        color: white;
        flex: 1;
        display: flex;
        overflow: hidden;

        .banshu {
            min-width: 200px;
            max-width: 50%;
            padding: 10px;
            overflow-y: auto;

            .item {
                display: flex;

                span {
                    margin-left: 20px;
                }
            }
        }

        .temp_say {
            flex-grow: 1;
            padding: 10px;
            overflow: auto;
            text-align: center;
        }
    }

    .tools {
        width: 750px;
        flex: 0;
        background-color: #356a36;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #29572a;
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;

        &_button_group {
            display: flex;
            width: 390px;
            height: 60px;
            border-radius: 20px;
            flex-direction: row;
            justify-content: center;
            background-color: #b66320;
        }

        &_button {
            width: 130px;
            height: 60px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 50px;
            cursor: pointer;
            font-size: 20px;
            color: white;
            border-right-color: #904e19;
            border-right-style: solid;
            border-right-width: 4px;
        }

        &_button_last {
            border-right-style: none;
            border-right-width: 0;
        }
    }

    .play_button {
        position: absolute;
        z-index: 999;
        top: 500px;
        left: 300px;
        width: 150px;
        height: 150px;
        background-color: #a2b89f;
        border-style: solid;
        border-color: #cee2cb;
        border-width: 2px;
        box-shadow: 0 0 100px -5px rgba(236, 220, 204, 0.55);

        border-radius: 80px;
        text-align: center;
        line-height: 150px;
        cursor: pointer;
        font-size: 100px;
        color: black;
    }
</style>

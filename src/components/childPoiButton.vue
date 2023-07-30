<template>
    <div class="button" @click="showInfo">
        <pic src="search" width="20" height="20"/>
        <text class="buttonText">{{childPoi.name}}</text>
        <Popup
            title="提醒讲解"
            :show="isBottomShow"
            @beforeClose="beforeClose"
            @close="close"
        >
            <scroller class="videoLesson">
                <VideoLesson
                    v-if="detail"
                    ref="video"
                    class="videoLessonContent"
                    :content="detail.video"
                    @firstPlay="firstPlay"
                    @playStep="playStep"
                    @end="end"
                />
            </scroller>
        </Popup>
    </div>
</template>

<script>
    import pic from '../components/icon';
    import VideoLesson from '../components/video'
    import request from '../plugin/request'
    import Popup from '../components/Popup.vue'

    export default {
        props: {
            childPoi: Object
        },
        name: "childPoiButton",
        data() {
            return {
                detail: null,
                isBottomShow: false
            }
        },
        methods: {
            firstPlay() {
            },
            playStep() {
            },
            end() {
            },
            async showInfo() {
                this.detail = await request.get('/childPoi/' + this.childPoi.id);
                this.isBottomShow = true
            },
            popupOverlayBottomClick() {
                this.isBottomShow = false;
            },
            beforeClose() {
                this.$refs.video.pause()
            },
            close() {
                this.isBottomShow = false
            }
        },
        components: {
            Popup,
            pic,
            VideoLesson
        }
    }
</script>

<style scoped>
    .button {
        padding: 4px 14px;
        border-radius: 10px;
        height: 56px;
        background-color: #33775e;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .buttonText {
        font-size: 26px;
        line-height: 50px;
        color: white;
        margin-left: 10px;
    }
    .videoLesson {
        height: 400px;
        box-sizing: content-box;
    }
    .videoLessonContent {
        height: 400px;
    }
</style>

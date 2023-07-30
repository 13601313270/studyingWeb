<template>
  <div class="camera">
    <div @click="close" class="close">
      <Icon src="close" :width="50"/>
    </div>
    <video v-if="!showImgUrl" class="video" ref="video"></video>
    <canvas :width="vw" :height="vw / proportion" ref="canvas" style="display:none"></canvas>
    <div v-if="showImgUrl" class="previewImg" :style="shadowStyle"><img :src="showImgUrl"/></div>
    <div v-if="showImgUrl" class="pickTools">
      <Button text="重拍" @click="init" ></Button>
      <Button text="确定" @click="save" primary></Button>
    </div>
    <div v-else class="pickTools">
      <div class="pick" @click="pick"></div>
      <div class="recycle" @click="recycle">
        <Icon src="recycle_white" :width="80" :height="80"/>
      </div>
    </div>
    <div class="shadow" :style="shadowStyle"></div>
  </div>
</template>
<script>
import Button from '@/components/Button.vue'
import Icon from './icon.vue'
export default {
  props: {
    proportion: Number,
    facingMode: String
  },
  mounted() {
    this.init()
  },
  data() {
    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      showImgUrl: '',
      facingMode: 'environment'
    }
  },
  methods: {
    init() {
      this.showImgUrl = '';
      this.$nextTick(() => {
        let video = this.$refs.video;
        if(video.srcObject) {
          video.srcObject.getTracks().forEach(function(track) {
            track.stop();
          });
        }
        video.srcObject = null;
        video.pause()
        //开启摄像头
        this.getUserMedia({
          audio: false,
          // 使用后置摄像头设置分辨率时，宽高颠倒才能正确显示
          video: {
            width: parseInt(this.vh * 0.8),
            height: parseInt(this.vw * 0.8),
            facingMode: this.facingMode,
          }
        })
          .then((stream) => {
            video.srcObject = stream;
            video.play();
          })
          .catch((e) => {
            console.trace(e)
            console.log("访问用户媒体失败");
          })
      })
    },
    getUserMedia(constraints) {
      return new Promise((resolve, reject) => {
        if(navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constraints)
            .then((stream)=>{
              resolve(stream);
            })
            .catch(() => {
              reject()
            });
        } else if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia(constraints,(stream) => {
              resolve(stream)
            },() => {
              reject()
            });
        } else if (navigator.mozGetUserMedia) {
            navigator.mozGetUserMedia(constraints,(stream) => {
              resolve(stream)
            },() => {
              reject()
            });
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints,(stream)=>{
              resolve(stream)
            },() => {
              reject()
            })
        }
      })
    },
    pick() {
      var type = 'jpg';
      var _fixType = function(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
      };
      let canvas = this.$refs.canvas;
      let context = canvas.getContext('2d');
      let video = this.$refs.video;
      context.drawImage(video, 0, (this.vh - this.vw/this.proportion) / -2, this.vw, this.vh);

      var imgData = this.$refs.canvas.toDataURL(type);
      console.log(video);
      // imgData = imgData.replace(_fixType(type),'image/octet-stream');

      // var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      // save_link.href = imgData; //base64码
      // save_link.download = filename;//图片名称

      console.log(imgData);
      this.showImgUrl = imgData;
      video.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });
      video.srcObject = null;
      video.pause()
    },
    save() {
      this.$emit('save', this.showImgUrl)
    },
    close() {
      let video = this.$refs.video;
      if(video.srcObject) {
        video.srcObject.getTracks().forEach(function(track) {
          track.stop();
        });
      }
      video.srcObject = null;
      video.pause()
      this.$emit('close')
    },
    recycle() {
      if(this.facingMode === 'environment') {
        this.facingMode = 'face'
      } else {
        this.facingMode = 'environment'
      }
      this.init()
    }
  },
  computed: {
    shadowStyle(){
      return {
        width: this.vw+ 'px',
        height: this.vw / this.proportion + 'px',
        marginTop: this.vw / this.proportion / -2 + 'px'
      }
    }
  },
  components: {
    Button,
    Icon
  }
}
</script>
<style scoped lang="less">
.camera {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: 1001;
  color: white;
  .close {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 70px;
    height: 70px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .video {
    width: 100vw;
    height: 100vh;
  }
  .pick {
    position: absolute;
    left: 325px;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    border-radius: 50px;
    z-index: 10;
    border: solid 10px white;
    background: rgba(255, 255, 255, .4);
  }

  .recycle {
    position: absolute;
    left: 550px;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
    border-radius: 50px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.314);
  }

  .previewImg {
    position: absolute;
    left: 50vw;
    width: 100vw;
    height: 100vw;
    top: 50vh;
    margin-top: -50%;
    margin-left: -50%;
    img {
      width: 100vw;
    }
  }
  .pickTools {
    position: absolute;
    display: flex;
    bottom: 100px;
    left: 0;
    width: 100%;
    height: 120px;
    z-index: 10;
    justify-content: space-evenly;
    >.button {
      width: 200px;
    }
  }
  .shadow {
    box-sizing: border-box;
    box-shadow: 10px 0 0px 100vh rgba(0,0,0,0.3);
    border: solid 1px rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 50vw;
    width: 100vw;
    height: 100vw;
    top: 50vh;
    margin-top: -50%;
    margin-left: -50%;
  }
}
</style>
<template>
  <div
    class="picturePreview"
    @click="onCancel"
    @touchstart="touchstart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
    <!-- <div style="position:absolute;z-index: 99;background: black;">
      <div>{{split.centerX}},{{split.centerY}}</div>
      <div>{{this.beforeWhiteBackSize.height / this.beforeWhiteBackSize.width * this.windowWidth / 2}}</div>
      <div>{{splitStep}}</div>
    </div> -->
    <img
      class="previewImg"
      :class="{moving:!moving}"
      :src="url"
      :style="beforeSplitImgStyle"
    />
  </div>  
</template>
<script>
export default {
  props: {
    url: String
  },
  created() {
    console.log(11)
    const img = new Image();
    img.onload = () => {
      console.log(11112222,img,img.width)
      this.beforeWhiteBackSize = {
        width: img.width,
        height: img.height
      }
      this.split.centerY = this.beforeWhiteBackSize.height / (this.beforeWhiteBackSize.width / this.windowWidth)/2
    }
    img.src = this.url;
  },
  data(){
    return {
      beforeWhiteBackSize: {},
      moving: false,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      split: {
        centerX: document.documentElement.clientWidth / 2,
        centerY: 0,
        minZoom: 1,
        zoom: 1,
      },
      splitStep: {
        centerX: 0,
        centerY: 0,
        zoom: 1,
      },
      finger1Begin: null,
      finger2Begin: null,
      twoFinger: false,
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel')
    },
    touchstart(e) {
      this.moving = true;
      if (e.touches.length > 1) {
        this.finger1Begin = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        this.finger2Begin = {
          x: e.touches[1].clientX,
          y: e.touches[1].clientY,
        }
      } else {
        this.finger1Begin = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        this.finger2Begin = null
      }
      // e.preventDefault()
    },
    touchmove(e) {
      this.moving = true;
      let zoomStep = 1;
      let moveX = e.touches[0].clientX - this.finger1Begin.x;
      let moveY = e.touches[0].clientY - this.finger1Begin.y;
      if (e.touches.length > 1) {
        if (this.twoFinger === false) {
          // 第二个手指进入，将第一个手指的拖动垮塌，并且按这个瞬间第一个手指的触发点作为放大操作的开始点
          this.split.zoom = this.split.zoom * this.splitStep.zoom;
          this.split.centerX = this.split.centerX - this.splitStep.centerX
          this.split.centerY = this.split.centerY - this.splitStep.centerY
          this.finger1Begin.x = e.touches[0].clientX;
          this.finger1Begin.y = e.touches[0].clientY;
        }
        this.twoFinger = true;
        this.beginDistance = Math.sqrt(Math.pow(this.finger2Begin.x - this.finger1Begin.x, 2) + Math.pow(this.finger2Begin.y - this.finger1Begin.y, 2))
        this.runningDistance = Math.sqrt(Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) + Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2))
        zoomStep = (this.runningDistance + 100) / (this.beginDistance + 100);// 添加100，防止初始两个手指太近，造成放大倍数太大
        // this.log = zoomStep.toFixed(3)
        moveX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - (this.finger1Begin.x + this.finger2Begin.x) / 2
        // moveX = (moveX + e.touches[1].clientX - this.finger2Begin.x)
        moveY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - (this.finger1Begin.y + this.finger2Begin.y) / 2
        // moveY = (moveY + e.touches[1].clientY - this.finger2Begin.y)
      }
      this.splitStep.zoom = Math.max(zoomStep, 0.1)
      this.splitStep.centerX = parseInt(moveX / this.split.zoom);// * zoomStep;
      this.splitStep.centerY = parseInt(moveY / this.split.zoom);// * zoomStep;
      e.preventDefault()
    },
    // 将现有拖拽中变量效果叠加到图片上
    superPosition() {
      const runningZoom = Math.max(this.split.zoom * this.splitStep.zoom, this.split.minZoom);
      this.split.zoom = runningZoom;
      if (this.split.centerX - this.splitStep.centerX < this.windowWidth / (runningZoom) / 2) {
        this.split.centerX = this.windowWidth / 2 / runningZoom
      } else if (this.split.centerX - this.splitStep.centerX > this.windowWidth / 2 / runningZoom + this.windowWidth * (runningZoom - 1) / runningZoom) {
        this.split.centerX = this.windowWidth * (runningZoom - 0.5) / runningZoom;
      } else {
        this.split.centerX = this.split.centerX - this.splitStep.centerX
      }
      const splitImgRealSizeHeight = this.beforeWhiteBackSize.height / runningZoom
      console.log('---------------')
      const initHeight = this.beforeWhiteBackSize.height / (this.beforeWhiteBackSize.width / this.windowWidth)
      const bottom = (this.windowHeight/ 2  - initHeight * runningZoom) * -1 / runningZoom
      if(initHeight * runningZoom<this.windowHeight){
        this.split.centerY = initHeight/2;
      } else if (this.split.centerY - this.splitStep.centerY < splitImgRealSizeHeight / 2 / this.beforeWhiteBackSize.height * this.windowHeight) {
        this.split.centerY = splitImgRealSizeHeight / 2 / this.beforeWhiteBackSize.height * this.windowHeight
      } else if (this.split.centerY - this.splitStep.centerY > bottom) {
        this.split.centerY = bottom;
      } else {
        this.split.centerY = this.split.centerY - this.splitStep.centerY
      }

      this.splitStep.centerX = 0;
      this.splitStep.centerY = 0;
      this.splitStep.zoom = 1;
    },
    touchend(e) {
      this.superPosition();
      this.moving = false;
      if (e.touches.length !== 0) {
        this.twoFinger = false;
        // 抬起了一根手指，还剩一根
        this.finger1Begin = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        if (e.touches.length > 1) {
          this.finger2Begin = {
            x: e.touches[1].clientX,
            y: e.touches[1].clientY,
          }
        } else {
          this.finger2Begin = null
        }
      }
    },
  },
  computed: {
    beforeSplitImgStyle() {
      let transform = '';
      transform += ' scale(' + (this.split.zoom * this.splitStep.zoom) + ')';
      transform += ' translateX(' + parseInt(this.windowWidth / 2 - this.split.centerX + this.splitStep.centerX) + 'px)'
      transform += ' translateY(' + parseInt(this.beforeWhiteBackSize.height / this.beforeWhiteBackSize.width * this.windowWidth / 2 - this.split.centerY + this.splitStep.centerY) + 'px)'
      return {transform}
    }
  },
}
</script>

<style lang="less" scoped>
.picturePreview {
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.previewImg {
  width: 100%;
}
.moving {
  transition: transform 0.3s;
}
</style>

<template>
  <div ref="scrollRoot" class="scrollRoot" :class="{isiOS}" @scroll="scrollIOS" @touchend="fnEndIOS">
    <slot name="pulling"></slot>
    <div
      class="outer"
      ref="outer"
      :class="{isiOS}"
      @touchstart="touchStart"
      @touchmove="fnMove"
      @touchend="fnEnd"
    >
      <div
        class="innerElement"
        :class="{ showPulling }"
        ref="Element"
      >
        <slot name="default"></slot>
      </div>
    </div>
    <slot name="loading"></slot>
  </div>
</template>
<script>
export default {
  props: {
    pulling: Function,
    dragging: Function,
    pull: Function,
    load: Function,
    pullLength: Number,// 下拉触发的长度
    loadLength: Number,// 上拉触发的长度
  },
  data() {
    return {
      isiOS: navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad'),
      scrollTopStart: 0,
      endScrollY: 0,// 手指最终滚动高度
      toTopHeightStart: 0,// 开始前距离底部距离
      toBottomHeightStart: 0,// 开始前距离底部距离
      showPulling: false,
      showLoading: false,
    }
  },
  methods: {
    touchStart(ev) {
      if(this.isiOS) {
        return;
      }
      // console.log(this.$refs["Element"].offsetTop)
      this.scrollTopStart = ev.changedTouches[0].pageY;
      const height = this.$refs.outer.clientHeight
      const scrollTop = this.$refs.outer.scrollTop
      const innerHeight = this.$refs.Element.clientHeight;
      // console.log(innerHeight, scrollTop, height, innerHeight - scrollTop - height)
      this.toTopHeightStart = scrollTop;
      this.toBottomHeightStart = innerHeight - scrollTop - height;
  
      // document.ontouchmove = this.fnmove.bind(this);
      // document.ontouchend = this.fnEnd.bind(this);
      // ev.preventDefault && ev.preventDefault();
    },
    fnMove(ev) {
      if(this.isiOS) {
        return;
      }
      const T = ev.changedTouches[0].pageY - this.scrollTopStart;
      this.endScrollY = T;
      window.aaa = this.$refs.outer;
      const height = this.$refs.scrollRoot.clientHeight
      const scrollTop = this.$refs.outer.scrollTop
      const innerHeight = this.$refs.Element.clientHeight;
      // console.log(height,innerHeight,innerHeight - scrollTop)
      this.showPulling = false;
      this.showLoading = false;
      // console.log(T, innerHeight, scrollTop, height)
      if (T > 0) {// 向上滑动
        this.pulling && this.pulling()
        if(scrollTop === 0) {
          // console.log(this.toTopHeightStart)
          this.showPulling = true;
          this.$refs["scrollRoot"].style.paddingTop = Math.pow( parseInt(T-this.toTopHeightStart), 0.8 ) + "px";
          this.$refs["scrollRoot"].style.paddingBottom = 0;
        }
      } else {
        // console.log('底部', innerHeight, scrollTop, innerHeight - scrollTop, height,"|||",T,Math.pow( parseInt(T*-1-this.toBottomHeightStart), 0.8 ))
        if(innerHeight - scrollTop -1 <= height) {
          this.showLoading = true;
          this.$refs["scrollRoot"].style.paddingTop = 0;
          this.$refs["scrollRoot"].style.paddingBottom = Math.pow( parseInt(T*-1-this.toBottomHeightStart), 0.8 ) + "px";
          // console.log(this.$refs.outer.clientHeight,this.$refs.outer.clientHeight,this.$refs.outer.clientHeight,this.$refs.outer.clientHeight)
          this.$refs.outer.scrollTop = this.$refs.Element.clientHeight;// 滚到底部
        }
      }
    },
    fnEnd(ev) {
      if(this.isiOS) {
        return;
      }
      // console.log(this)
      const height = this.$refs.outer.clientHeight
      const scrollTop = this.$refs.outer.scrollTop
      const innerHeight = this.$refs.Element.clientHeight;


      if(this.endScrollY > 0) {
        const then = () => {
          this.$refs["scrollRoot"].style.paddingTop = 0;
          this.$refs["scrollRoot"].style.paddingBottom = 0;
          this.$refs["scrollRoot"].style.transition = ".3s ease all";
          this.$refs["scrollRoot"].addEventListener("transitionend", () => {
            this.$refs["scrollRoot"].style.transition = null;
          });
          this.showPulling = false;
        }
        if (this.pull) {
          this.pull().then(() => {
            then()
          })
        } else {
          then()
        }
      } else {
        const then = () => {
          this.$refs["scrollRoot"].style.paddingTop = 0;
          this.$refs["scrollRoot"].style.paddingBottom = 0;
          this.$refs["scrollRoot"].style.transition = ".3s ease all";
          this.$refs["scrollRoot"].addEventListener("transitionend", () => {
            this.$refs["scrollRoot"].style.transition = null;
          });
          this.showLoading = false;
        }
        if (parseInt(this.$refs["scrollRoot"].style.paddingBottom)> 30) {
          console.log(1,this.load)
          if(this.load) {
            this.load().then(() => {
              then()
            })
          } else {
            then()
          }
        } else {
          console.log(2, innerHeight, scrollTop, innerHeight - scrollTop -1, height)
        }
      }
    },
    scrollIOS(e) {
      if(this.isiOS) {
        const lengthToBottom = this.$refs.scrollRoot.children[1].offsetHeight - this.$refs.scrollRoot.scrollTop - this.$refs.scrollRoot.offsetHeight;
        if(this.$refs.scrollRoot.scrollTop < 0) {
          this.$refs.scrollRoot.children[0].style.top = this.$refs.scrollRoot.children[0].offsetHeight * -1 - this.$refs.scrollRoot.scrollTop + 'px'
          if(this.$refs.scrollRoot.scrollTop < (this.pullLength * -1 || -100) ) {
            this.pulling && this.pulling(true)
          } else {
            this.pulling && this.pulling(false)
          }
        } else if(lengthToBottom < 0) {
          console.log(lengthToBottom)
          // this.$refs.scrollRoot.children[2].style.height = lengthToBottom * -1 + 'px'
          if(lengthToBottom < (this.loadLength || 100) * -1) {
            this.dragging && this.dragging(true)
          } else {
            this.dragging && this.dragging(false)
          }
        } else {
          // this.$refs.scrollRoot.children[2].style.height = '0';
          this.$refs.scrollRoot.children[0].style.top = this.$refs.scrollRoot.children[0].offsetHeight * -1 + 'px'
        }
      }
    },
    fnEndIOS() {
      console.log('scrollTop', this.$refs.scrollRoot.scrollTop)
      const lengthToBottom = this.$refs.scrollRoot.children[1].offsetHeight - this.$refs.scrollRoot.scrollTop - this.$refs.scrollRoot.offsetHeight;
      if (this.$refs.scrollRoot.scrollTop < 0 ) {
        if((this.pullLength * -1 || -100)) {
          const then = () => {
            this.showPulling = false;
          }
          if (this.pull) {
            this.pull().then(() => {
              then()
            })
          } else {
            then()
          }
        }
      } else if (lengthToBottom < 0) {
        if((this.loadLength || 100) * -1) {
          const then = () => {
            this.showLoading = false;
            // this.$refs.scrollRoot.children[2].style.height = '0';
          }
          if(this.load) {
            this.load().then(() => {
              then()
            })
          } else {
            then()
          }
        } else {
          // this.$refs.scrollRoot.children[2].style.height = '0';
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.scrollRoot {
  overflow: hidden;
  box-sizing: border-box;
  &.isiOS {
    overflow: auto!important;
  }
}
.outer {
  overflow: auto;
  position: relative;
  height: 100%;
  width: 100%;
  &.isiOS {
    height: auto;
  }
}
.innerElement {
  width: 100%;
  // &.showPulling {
  //   :deep(.refresh) {
  //     display: inline-block;
  //   }
  // }
  // &.showLoading {
  //   :deep(.loading) {
  //     display: inline-block;
  //   }
  // }
}
:deep(.refresh) {
  position: absolute;
  z-index: 1;
}
:deep(.loading) {
  position: relative;
}
</style>

<template>
  <teleport to="#teleport">
    <div class="dialogContent" v-if="show" :class="{show: showInner}">
      <div class="background" @click="close"></div>
      <div class="popInner">
        <div v-if="title" class="title">
          <div class="left"></div>
          <div class="titleText">{{title}}</div>
          <div class="close" @click="close">
            <Icon src="close" :height="40"></Icon>
          </div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script>
import Icon from './icon.vue'

const transitionTime = 300
export default {
  name: "Popup",
  props: {
    title: String,
    show: Boolean,
  },
  data(){
    return {
      showInner: this.show,
    }
  },
  watch: {
    show(val) {
      if(val){
        setTimeout(() => {
          this.showInner = true;
        },10)
      } else {
        // setTimeout(() => {
        //   this.showInner = false;
        // },10)
      }
    }
  },
  methods: {
    close() {
      this.$emit('beforeClose')
      this.showInner = false;
      setTimeout(()=>{
        this.$emit('close')
      }, transitionTime)
    }
  },
  components: {
    Icon
  }
}
</script>

<style scoped lang="less">
.dialogContent {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.background {
  background-color: rgba(0, 0, 0, 0.36);
  position: absolute;
  transition: opacity 0.3s;
  opacity: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.show {
  .background {
    display: block;
    opacity: 1;
  }
  .popInner {
    opacity: 1;
  }
}
.popInner {
  background-color: white;
  position: absolute;
  opacity: 0;
  transition: bottom 0.3s,opacity 0.3s;
  width: 90%;
  border-radius: 20px;
  overflow: hidden;
  .title {
    height: 88px;
    line-height: 88px;
    padding-right: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    .left {
      width: 88px;
    }
    .titleText {
      flex-grow: 1;
      font-size: 36px;
      color: #333;
    }
    .close {
      width: 88px;
      height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
  }
  .content {
    min-height: 200px;
    max-height: 80vh;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
  }
}
</style>
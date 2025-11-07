<template>
  <teleport to="#teleport">
    <div class="popContent" v-if="show" :class="{ show: showInner }" :style="{ zIndex: zIndex || 1 }">
      <div class="background" @click="close"></div>
      <div class="popInner">
        <div v-if="title" class="title">
          <div class="left"></div>
          <div class="titleText">{{ title }}</div>
          <div class="close" @click="close">
            <img src="../icons/close.png">
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
import Icon from '../components/icon.vue'

const transitionTime = 300
export default {
  name: "Popup",
  props: {
    title: String,
    show: Boolean,
    zIndex: Number,
  },
  data() {
    return {
      showInner: this.show,
    }
  },
  watch: {
    show(val) {
      if (val) {
        setTimeout(() => {
          this.showInner = true;
        }, 10)
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
      setTimeout(() => {
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
.popContent {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.background {
  background-color: rgba(0, 0, 0, 0.26);
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
    bottom: 0;
  }
}

.popInner {
  background-color: white;
  position: absolute;
  opacity: 0;
  transition: bottom 0.3s, opacity 0.3s;
  bottom: -70px;
  width: 100%;
  border-radius: 20px 20px 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

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

      >img {
        height: 40px;
      }
    }
  }

  .content {
    min-height: 200px;
    overflow: auto;
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
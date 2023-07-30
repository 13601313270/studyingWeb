<template>
  <img :src="showUrl" :style="style"/>
</template>
<script>
import { getAllIcons } from '../plugin/allIcons'

export default {
  props: {
    src: String,
    width: [Number,String],
    height:  [Number,String]
  },
  async created() {
    try {
      const allIcons = await getAllIcons();
      this.allIcons = allIcons;
    } catch(e) {
    }
    this.initFinish = true;
    
  },
  data() {
    return {
      initFinish: false,
      allIcons: []
    }
  },
  computed: {
    style() {
      if(this.showUrl) {
        return "width: " + this.width/7.5 +'vw;height:'+this.height/7.5+'vw';
      } else {
        return 'display:none'
      }
    },
    showUrl() {
      if(this.initFinish === false){
        return ''
      }
      if(this.allIcons && this.allIcons[this.src]) {
        return this.allIcons[this.src].path;
        // this.showUrl = allIcons[this.src].path;
      } else {
        return this.src;
        // this.showUrl = this.src;
      }
    }
  }
}
</script>

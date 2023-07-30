<template>
  <div class="wrapper" v-if="isTokenInit">
    <Index/>
  </div>
</template>
<script>
import { computed, ref } from 'vue'
import { mapActions } from 'vuex';
import Index from './views/app.vue'

export default {
  created() {
    const token = localStorage.getItem('token');
    if(token) {
      this.setToken(token)
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        this.setUserInfo(JSON.parse(userInfo));
      }
    }
    this.isTokenInit = true;
  },
  data() {
    return {
      isTokenInit: false
    }
  },
  methods: {
    ...mapActions('main', ['setToken', 'setUserInfo'])
  },
  components: {Index}
}
</script>
<style lang="less">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login {
  position: fixed;
  width: 750px;
  background-color: white;
  top: 0;
  bottom: 0;
  z-index: 999;
}
</style>
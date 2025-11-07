<template>
  <div class="wrapper" v-if="isTokenInit">
    <Index />
  </div>
  <Alert />
</template>
<script>
import { computed, ref } from 'vue'
import { mapActions } from 'vuex';
import request from '@/plugin/request'
import Index from './views/app.vue'
import Alert from './components/Alert.vue'

export default {
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setToken(token)
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const userInfoObj = JSON.parse(userInfo)
        // 接口判断下token是否失效，token还有效的话，再写入setUserInfo
        request.get('/login/getInfo?email=' + userInfoObj.account + '&token=' + token).then(res2 => {
          if (res2.code === 200) {
            this.setUserInfo(res2.info);
          }
        });
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
  components: {
    Index,
    Alert,
  }
}
</script>
<style lang="less">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
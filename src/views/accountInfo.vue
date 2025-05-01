<template>
  <div style="display: flex;flex-direction: column;">
    <div v-if="userInfo2">
      <div class="header">
        <pic v-if="userInfo2.icon" class="icon" @click="showImgDetail(userInfo2.icon.replace('http://', 'https://'))"
          :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
          :width="80" />
        <text class="name">账号:</text>
        <text class="header_value">{{ userInfo2.account }}</text>
        <!--                <text class="name">金币:</text>-->
        <!--                <text class="header_value">{{userInfo2.coin}}</text>-->
        <!--                <text class="tips">学习圈获取:1:每日5题，2:问答发表优质回答</text>-->
      </div>
    </div>
    <div class="moreAction">
      <Button text="注销账号" error @click="showDelete = true"></Button>
      <div style="flex-grow: 1;"></div>
      <Button @click="gotoDevelop" v-if="userInfo2 && userInfo2.account === '12345678'" text="开发(测试账号特有功能)"></Button>
    </div>
    <Dialog :show="showDelete" title="是否确定注销账户" @close="showDelete = false">
      <div style="margin-bottom: 20px;overflow: auto;">
        <div>注销后，您发送的学习圈信息，将被删除，即使您再次注册，也无法找回。</div>
        <div>注销后，您的用户基本信息，将被清空。</div>
        <div>注销后，软件方不会保留您的任何信息，用于商业目的。</div>
      </div>
      <div style="display:flex;justify-content: space-around;">
        <Button text="取消" style="width: 40%" @click="showDelete = false"></Button>
        <Button text="确定" style="width: 40%" error @click="deleteAccount"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import {WxcCell} from 'weex-ui';
// import Nat from 'natjs';
import pic from '../components/icon';
// import wxcSelect from '../components/select'
import Button from '../components/Button.vue'
import Input from '../components/Input.vue'
import Popup from '../components/Popup.vue'
import Select from '@/components/Select.vue'
import request from '../plugin/request'
import Message from '../components/Message.vue'
import Camera from '@/components/Camera.vue'
import Icon from '@/components/icon.vue';
import Dialog from '@/components/Dialog.vue';


// import { WxcCity, WxcPopup} from 'weex-ui';

// var modal = weex.requireModule('modal');
// const localStorage = weex.requireModule('storage');

export default {
  name: 'userInformation',
  created() {
    const userInfoText = localStorage.getItem('userInfo')
    this.userInfo2 = JSON.parse(userInfoText)
    request.get('/user/getInfo').then(res => {
      this.userInfo2 = res;
    });
  },
  data() {
    return {
      userInfo2: {},
      showDelete: false,
    }
  },
  methods: {
    ...mapActions('main', ['setPath', 'setToken', 'setUserInfo']),
    async deleteAccount() {
      await request.delete('/cancellation/user')
      this.loginOut()
    },
    loginOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      this.setToken('');
      this.setUserInfo({});
      this.$router.replace({ path: '/mine' });
    },
    gotoDevelop() {
      this.$router.push({ path: '/develop' });
    }
  },
  components: {
    pic,
    Button,
    Input,
    Message,
    Popup,
    Select,
    Camera,
    Icon,
    Dialog
  }
}
</script>
<style scoped lang="less">
.header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom-style: solid;
  border-bottom-color: #f2f2f2;
  border-bottom-width: 20px;
  padding: 10px 20px 10px 50px;
  height: 230px;

  .icon {
    border-radius: 30px;
    margin-right: 30px;
  }

  .name {
    font-size: 32px;
    margin-right: 70px;
    color: #343434;
  }
}

.header_value {
  font-size: 36px;
  color: #5d5d5d;
}

.moreAction {
  margin-top: 32px;
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  >* {
    margin-top: 8px;
  }
}
</style>

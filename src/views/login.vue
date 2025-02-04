<template>
  <div class="login_content">
    <div class="login_content_close" @click="back">
      <icon src="close" width="50" height="50" />
    </div>
    <div class="login_content_inner">
      <div class="icon">
        <icon src="icon_green" width="200" height="200" />
      </div>
      <!--<text style="color: #ff736b">{{wrong}}</text>-->
      <div class="form" :model="ruleForm" :rules="rules">
        <div class="el-form-item" label="账号" prop="username">
          <text style="color:rgb(0,40,31);">手机号</text>
          <div class="loginInput">
            <input v-model="ruleForm.username" />
          </div>
        </div>
        <div class="el-form-item" label="密码" prop="password" style="margin-top: 20px">
          <text style="color:rgb(0,40,31);">验证码</text>
          <div style="display: flex;">
            <div class="loginInput passport">
              <input v-model="ruleForm.password" />
            </div>
            <div v-if="nextCodeTime > 0" class="instead_button">
              <text style="color: grey;">{{ nextCodeTime }}s</text>
            </div>
            <Button v-else class="tmpCodeButton" @click="getTempCode" text="验证码"></Button>
          </div>
        </div>
        <div class="el-form-item">
          <Button class="action_button loginButton" @click="login" primary text="登录/注册"></Button>
        </div>
      </div>
      <div v-if="isInstalledWeChat" class="otherLogin">
        <text class="title">或通过以下方式登录</text>
        <div class="list">
          <div @click="weChatLogin">
            <icon src="wechat" width="120" />
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 30px">
      </div>
      <div class="tempCodeBack" v-if="showTempCode">
        <div class="tempCode">
          <div @click="showTempCode = false" class="close">
            <icon src="close" width="40" />
          </div>
          <div style="display: flex;align-items: flex-end;">
            <icon width="400" height="200"
              :src="'https://api.studying1v1.com/register/checkImg/' + phone + '?rand=' + random" />
            <Button class="changeOne" @click="getTempCode" text="换一张"></Button>
          </div>
          <div class="tempInputText">请输入上面图片中的数字</div>
          <div class="tempInput">
            <input v-model="tempCode">
          </div>
          <Button class="tempSendButton" @click="getPhoneCode('login')" primary text="发送"></Button>
        </div>
      </div>
    </div>
    <div class="checkContent">
      <Check :value="isSelectRule" @check="wxcCheckBoxItemChecked" />
      <div>
        我已同意<span class="agree" @click="showAgreement">《服务协议》</span>与<span class="agree"
          @click="showAgreement">《隐私条款》</span>
      </div>
    </div>
    <div class="argument" @click="showAgreement">
      <text class="argument_link">服务协议</text>
      <text class="argument_split">｜</text>
      <text class="argument_link">隐私政策</text>
    </div>
    <div style="height: 200px;"></div>
    <Popup :title="agreementInfo.title" :show="showRuleContent" :zIndex="1000" @close="showRuleContent = false">
      <div style="height: 100%;overflow:auto;font-size: 14px;">
        <div>{{ agreementInfo.content }}</div>
      </div>
    </Popup>
    <Popup title="绑定手机号" :show="showBindPhone" :zIndex="1000" @close="back">
      <div class="form">
        <div class="el-form-item">
          <div class="text">手机号</div>
          <div class="loginInput">
            <input v-model="bindRuleForm.username" />
          </div>
        </div>
        <div class="el-form-item">
          <div class="text">验证码</div>
          <div style="display: flex;flex-direction: row">
            <div class="loginInput passport" style="flex-grow: 1;">
              <input v-model="bindRuleForm.password">
            </div>
            <div v-if="nextCodeTime > 0" class="instead_button">
              <text style="color: grey;">{{ nextCodeTime }}s</text>
            </div>
            <Button v-else class="tmpCodeButton" @click="getTempCodeBind" text="验证码"></Button>
          </div>
        </div>
        <div class="el-form-item">
          <Button class="action_button loginButton" @click="registerWeChat" text="绑定" primary></Button>
        </div>
      </div>
      <div class="tempCodeBack" v-if="showTempCodeBind">
        <div class="tempCode">
          <div class="tools">
            <icon src="close" width="60" @click="showTempCodeBind = false" />
          </div>
          <div style="display: flex;align-items: flex-end;">
            <icon width="400" height="200"
              :src="'https://api.studying1v1.com/register/checkImg/' + phone + '?rand=' + random" />
            <Button class="changeOne" @click="getTempCodeBind" text="换一张"></Button>
          </div>
          <div class="tempInputText">请输入上面图片中的数字</div>
          <div class="tempInput">
            <input v-model="tempCodeBind">
          </div>
          <Button class="tempSendButton" @click="getPhoneCode('bind')" primary text="发送"></Button>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
// import {WxcPopup, WxcCheckbox, WxcDialog} from 'weex-ui';
import Button from '../components/Button.vue'
import { mapActions } from 'vuex';
import icon from '../components/icon';
import Agreement from "@/views/agreement";
import request from '@/plugin/request'
import Check from '@/components/Check.vue'
import Dialog from '@/components/Dialog.vue'
import Popup from '@/components/Popup.vue'
import WeChat from '@/plugin/WeChat';
// const modal = {};// weex.requireModule('modal');

export default {
  name: 'login',
  created() {
    WeChat.isInstalled().then((isInstalled) => {
      this.isInstalledWeChat = isInstalled;
    })
  },
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      bindRuleForm: {
        username: '',
        password: '',
      },
      wrong: 'wrong01',
      nextCodeTime: 0,
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      nameRules: [
        v => !!v || '必填',
        v => v.length <= 30 || 'Name must be less than 10 characters'
      ],
      isIpx: navigator.userAgent.includes('iPhone'),
      phone: null,
      tempCode: null,
      tempCodeBind: null,
      showTempCode: false,
      showTempCodeBind: false,
      random: 1,
      isSelectRule: false,
      showRuleContent: false,
      showBindPhone: false,
      codeBak: '',
      isInstalledWeChat: false,
      agreementInfo: {
        content: '',
        title: ''
      }
    }
  },
  methods: {
    ...mapActions('main', ['setToken', 'setUserInfo', 'setShowLogin']),
    login() {
      if (this.isSelectRule === false) {
        alert('请先阅读服务协议与隐私政策并同意')
        return;
      }
      if (this.ruleForm.username === '') {
        alert('请输入手机号')
        return;
      }
      // weex.requireModule('MyModule').alertMe(JSON.stringify(this.ruleForm));
      request.post('/login/phoneLogin', {
        phone: this.ruleForm.username,
        code: this.ruleForm.password
      }).then(res => {
        if (res.result === true) {
          localStorage.setItem('token', res.token);
          this.setToken(res.token);
          request.get('/login/getInfo?email=' + this.ruleForm.username + '&token=' + res.token).then(res2 => {
            if (res2.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res2.info));
              this.setUserInfo(res2.info);
              this.setShowLogin(false)
              setTimeout(() => {
                this.$router.back();
              }, 3000)
              // this.$router.replace('/source');
            }
          });
        } else {
          alert(res.msg);
        }
      });
    },
    back() {
      this.setShowLogin(false)
      this.$router.back();
    },
    getTempCode() {
      this.phone = this.ruleForm.username;
      if (!this.phone) {
        alert('请输入账号')
        return;
      }
      if (this.phone && (this.phone.length < 3 || this.phone.length > 30)) {
        alert('长度在 3 到 30 个字符')
        return;
      }
      this.random = Math.random()
      this.$nextTick(() => {
        this.showTempCode = true;
      })
    },
    getTempCodeBind() {
      this.phone = this.bindRuleForm.username;
      this.random = Math.random()
      this.$nextTick(() => {
        this.showTempCodeBind = true;
      })
    },
    getPhoneCode(type) {
      request.get('/register/sentPhoneCode/' + parseInt(this.phone) + '/' + (type === 'login' ? this.tempCode : this.tempCodeBind)).then(res => {
        if (res.result === true) {
          if (type === 'login') {
            this.showTempCode = false;
          } else {
            this.showTempCodeBind = false;
          }
          this.nextCodeTime = 60;
          let interval = setInterval(() => {
            this.nextCodeTime--;
            if (this.nextCodeTime === 0) {
              clearInterval(interval);
            }
          }, 1000);
        } else {
          alert(res.msg)
        }
      }).catch(res => {
        weex.requireModule('MyModule').alertMe('请检查手机号' + '/register/sentPhoneCode/' + parseInt(this.phone) + '/' + (type === 'login' ? this.tempCode : this.tempCodeBind));
      });
    },
    wxcCheckBoxItemChecked(val) {
      this.isSelectRule = !this.isSelectRule
    },
    weChatLogin() {
      if (this.isSelectRule === false) {
        alert('请先阅读服务协议与隐私政策并同意')
        return;
      }
      // // 虚拟机没有微信，测试代码
      // this.codeBak = 'asfadsfdasfads';
      // this.showBindPhone = true;
      // return;

      WeChat.login().then((res) => {
        if (res.result === true) {
          alert('微信登录成功')
          localStorage.setItem('token', res.token);
          this.setToken(res.token);
          request.get('/login/getInfo?email=' + res.account + '&token=' + res.token).then(res2 => {
            if (res2.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res2.info));
              this.setUserInfo(res2.info);
              this.setShowLogin(false)
              setTimeout(() => {
                this.$router.back();
              }, 100)
            }
          });
        } else if (res.type === 'code_error') {
          alert('微信服务器授权失败')
        } else if (res.type === 'not_account') {
          this.codeBak = res.code;
          this.showBindPhone = true;
        }
      })
    },
    registerWeChat() {
      request.post('/weChat/register', {
        code: this.codeBak,
        phone: this.bindRuleForm.username,
        phoneCode: this.bindRuleForm.password,
      }).then(res => {
        if (res.result) {
          alert('登录成功')
          localStorage.setItem('token', res.token);
          this.setToken(res.token);
          request.get('/login/getInfo?email=' + res.account + '&token=' + res.token).then(res2 => {
            if (res2.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res2.info));
              this.setUserInfo(res2.info);
              this.setShowLogin(false)
              setTimeout(() => {
                this.$router.back();
              }, 100)
            }
          });
        } else {
          alert('登录失败：' + res.msg)
          // modal.toast({
          //   'message': '登录失败：' + res.msg,
          //   'duration': 2.0
          // })
        }
      }).catch(() => {
        alert('登录失败：')
        // modal.toast({
        //   'message': '登录失败',
        //   'duration': 2.0
        // })
      })
    },
    async showAgreement() {
      const agreementInfo = await request.get('/agreement')
      console.log(agreementInfo);
      this.agreementInfo = agreementInfo;
      this.showRuleContent = true
    }
  },
  components: { Button, icon, Agreement, Check, Popup },//  WxcPopup, WxcCheckbox, WxcDialog
}
</script>
<style scoped lang="less">
.login_content {
  width: 750px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;

  &_close {
    position: absolute;
    left: 30px;
    top: calc(env(safe-area-inset-top) + 20px);
  }
}

.login_content_inner {
  padding-top: env(safe-area-inset-top);

  .icon {
    text-align: center;
  }

  .otherLogin {
    margin: 50px 25px 0;
    padding: 25px;
    border: solid 1px rgb(214, 214, 214);
    border-radius: 16px;

    .title {
      text-align: center;
      font-size: 30px;
      color: grey;
      margin-top: 40px;
    }

    .list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 40px;
    }
  }

  .passport {
    width: 480px;
    height: 100px;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(0, 77, 59, 0.87);
    border-radius: 5px;
  }
}

.checkContent {
  width: 100%;
  margin-left: 25px;
  margin-right: 25px;
  display: flex;
  align-items: center;

  .Check {
    margin-right: 16px;
  }

  .agree {
    color: #24248f;
  }
}

.instead_button {
  border-style: solid;
  border-width: 1px;
  border-color: grey;
  flex: 1;
  height: 100px;
  width: 200px;
  margin-left: 20px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: grey;
}

.tempCodeBack {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);

  .tempCode {
    position: fixed;
    box-sizing: border-box;
    top: 300px;
    left: 50px;
    width: 650px;
    padding: 30px;
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    .tools {
      display: flex;
      justify-content: end;

      .close {}

      .tempInputText {
        margin-top: 100px;
      }
    }

    .tempInput {
      height: 80px;
      border-style: solid;
      border-width: 2px;
      border-color: rgba(0, 77, 59, 0.87);
      border-radius: 5px;
      margin-top: 12px;

      input {
        padding-left: 12px;
        color: #0e270e;
        width: 100%;
        height: 100%;
        font-size: 36px;
        box-sizing: border-box;
        border: none;
      }
    }

    .changeOne {
      margin-left: 20px;
    }

    .tempSendButton {
      margin-top: 20px;
    }
  }

}

.argument {
  display: flex;
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
  margin-bottom: 36px;

  &_split {
    font-size: 28px;
    color: #688590;
  }

  &_link {
    font-size: 28px;
    color: #7c8690;
  }

}

.form {
  margin: 25px;

  .el-form-item {
    margin-bottom: 24px;

    .text {
      color: rgb(0, 40, 31);
      margin-bottom: 12px;
    }

    .loginInput {
      height: 100px;
      border-style: solid;
      border-width: 2px;
      border-color: rgba(0, 77, 59, 0.87);
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;

      input {
        height: 96px;
        width: 100%;
        font-size: 36px;
        padding-left: 10px;
        color: #0e270e;
        box-sizing: border-box;
        border: none;
      }
    }

    .action_button {
      width: 100%;
      margin: 50px 0 0 0;
    }

    .action_button {
      margin-top: 20px;
      width: 30%;
    }

    .loginButton {
      width: 100%;
      height: 120px;
      box-sizing: border-box;
      margin-top: 50px;
    }

    .tmpCodeButton {
      height: 100px;
      width: 200px;
      margin-left: 20px;
      font-size: 24px;
    }
  }
}
</style>

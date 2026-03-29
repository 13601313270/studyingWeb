<template>
  <div class="login_content">
    <div class="close" @click="back">
      <img src="../icons/close.png" />
    </div>
    <div class="login_content_inner">
      <div class="icon">
        <img src="../icons/icon_green.png" />
      </div>
      <!--<text style="color: #ff736b">{{wrong}}</text>-->
      <div class="form" :model="ruleForm" :rules="rules">
        <div class="el-form-item" label="账号" prop="username">
          <text class="text" style="color:rgb(0,40,31);">手机号</text>
          <div class="loginInput">
            <input v-model="ruleForm.username" />
          </div>
        </div>
        <div class="el-form-item" label="密码" prop="password" style="margin-top: 20px">
          <text class="text" style="color:rgb(0,40,31);">验证码</text>
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
          <div @click="weChatLogin" class="item">
            <img src="../icons/wechat.png" />
          </div>
        </div>
      </div>
      <div style="text-align: center;margin-top: 30px">
      </div>
      <div class="tempCodeBack" v-if="showTempCode">
        <div class="tempCode">
          <div @click="showTempCode = false" class="tools">
            <img src="../icons/close.png" />
          </div>
          <div class="tempCodeImg">
            <img :src="'https://api.studying1v1.com/register/checkImg/' + phone + '?rand=' + random" />
            <Button class="changeOne" @click="getTempCode" text="换一张"></Button>
          </div>
          <div class="tempInputText">请输入上面图片中的4位数字</div>
          <div class="tempInput">
            <input v-model="tempCode">
          </div>
          <Button class="tempSendButton" @click="getPhoneCode('login')" primary text="发送"></Button>
        </div>
      </div>
    </div>
    <div class="checkContent">
      <Check :value="isSelectRule" @check="wxcCheckBoxItemChecked" />
      <div class="desc">
        我已同意<span class="agree" @click="showAgreement">《服务协议》</span>与<span class="agree"
          @click="showAgreement">《隐私条款》</span>
      </div>
    </div>
    <div class="argument" @click="showAgreement">
      <text class="argument_link">服务协议</text>
      <text class="argument_split">｜</text>
      <text class="argument_link">隐私政策</text>
    </div>
    <Popup :title="agreementInfo.title" :show="showRuleContent" :zIndex="1000" @close="showRuleContent = false">
      <div class="agreementInfoPopUp">
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
            <img src="../icons/close.png" @click="showTempCodeBind = false" />
          </div>
          <div class="tempCodeImg">
            <img :src="'https://api.studying1v1.com/register/checkImg/' + phone + '?rand=' + random" />
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

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import icon from '../components/icon.vue';
import Agreement from '@/views/agreement.vue';
import request from '@/plugin/request';
import Check from '@/components/Check.vue';
import Dialog from '@/components/Dialog.vue';
import Popup from '@/components/Popup.vue';
import WeChat from '@/plugin/WeChat';
import { getToken } from '@/plugin/phoneNumber';

// Vuex store and router
const store = useStore();
const router = useRouter();

// Reactive state
const ruleForm = reactive({
  username: '',
  password: '',
});

const bindRuleForm = reactive({
  username: '',
  password: '',
});

const wrong = ref('wrong01');
const nextCodeTime = ref(0);
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const isIpx = ref(navigator.userAgent.includes('iPhone'));
const phone = ref<string | null>(null);
const tempCode = ref<string | null>(null);
const tempCodeBind = ref<string | null>(null);
const showTempCode = ref(false);
const showTempCodeBind = ref(false);
const random = ref(1);
const isSelectRule = ref(false);
const showRuleContent = ref(false);
const showBindPhone = ref(false);
const codeBak = ref('');
const isInstalledWeChat = ref(false);
const agreementInfo = reactive({
  content: '',
  title: '',
});

async function getAuth() {
  const token = await getToken()
  console.log('===2===', token)
  console.log('token', token);

  const phoneInfo = await request.get("https://api.studying1v1.com/login/getPhoneWithToken?token=" + token) as any;
  console.log('=====phoneInfo=====', phoneInfo);
  if (phoneInfo.result === true) {
    localStorage.setItem('token', phoneInfo.token);
    store.dispatch('main/setToken', phoneInfo.token);
    request
      .get(`/login/getInfo?email=${phoneInfo.phone}&token=${phoneInfo.token}`)
      .then((res2: any) => {
        if (res2.code === 200) {
          localStorage.setItem('userInfo', JSON.stringify(res2.info));
          store.dispatch('main/setUserInfo', res2.info);
          store.dispatch('main/setShowLogin', false);
          setTimeout(() => {
            router.back();
          }, 100);
        }
      });
  } else {
    alert(phoneInfo.msg);
  }
}
// Methods
const login = () => {
  if (!isSelectRule.value) {
    alert('请先阅读服务协议与隐私政策并同意');
    return;
  }
  if (!ruleForm.username) {
    alert('请输入手机号');
    return;
  }
  request
    .post('/login/phoneLogin', {
      phone: ruleForm.username,
      code: ruleForm.password,
    })
    .then((res: any) => {
      if (res.result === true) {
        localStorage.setItem('token', res.token);
        store.dispatch('main/setToken', res.token);
        request
          .get(`/login/getInfo?email=${ruleForm.username}&token=${res.token}`)
          .then((res2: any) => {
            if (res2.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res2.info));
              store.dispatch('main/setUserInfo', res2.info);
              store.dispatch('main/setShowLogin', false);
            }
          });
      } else {
        alert(res.msg);
      }
    });
};

const back = () => {
  store.dispatch('main/setShowLogin', false);
  router.back();
};

const getTempCode = () => {
  phone.value = ruleForm.username;
  if (!phone.value) {
    alert('请输入账号');
    return;
  }
  if (phone.value.length < 3 || phone.value.length > 30) {
    alert('长度在 3 到 30 个字符');
    return;
  }
  random.value = Math.random();
  showTempCode.value = true;
};

const getTempCodeBind = () => {
  phone.value = bindRuleForm.username;
  random.value = Math.random();
  showTempCodeBind.value = true;
};

const getPhoneCode = (type: string) => {
  request
    .get(
      `/register/sentPhoneCode/${parseInt(phone.value || '')}/${type === 'login' ? tempCode.value : tempCodeBind.value
      }`
    )
    .then((res: any) => {
      if (res.result === true) {
        if (type === 'login') {
          showTempCode.value = false;
        } else {
          showTempCodeBind.value = false;
        }
        nextCodeTime.value = 60;
        const interval = setInterval(() => {
          nextCodeTime.value--;
          if (nextCodeTime.value === 0) {
            clearInterval(interval);
          }
        }, 1000);
      } else {
        alert(res.msg);
      }
    })
    .catch(() => {
      alert('请检查手机号');
    });
};

const wxcCheckBoxItemChecked = () => {
  isSelectRule.value = !isSelectRule.value;
};

const weChatLogin = () => {
  if (!isSelectRule.value) {
    alert('请先阅读服务协议与隐私政策并同意');
    return;
  }
  WeChat.login().then((res) => {
    if (res.result === true) {
      alert('微信登录成功');
      localStorage.setItem('token', res.token);
      store.dispatch('main/setToken', res.token);
      request
        .get(`/login/getInfo?email=${res.account}&token=${res.token}`)
        .then((res2: any) => {
          if (res2.code === 200) {
            localStorage.setItem('userInfo', JSON.stringify(res2.info));
            store.dispatch('main/setUserInfo', res2.info);
            store.dispatch('main/setShowLogin', false);
            setTimeout(() => {
              router.back();
            }, 100);
          }
        });
    } else if (res.type === 'code_error') {
      alert('微信服务器授权失败');
    } else if (res.type === 'not_account') {
      codeBak.value = res.code;
      showBindPhone.value = true;
    }
  });
};

const registerWeChat = () => {
  request
    .post('/weChat/register', {
      code: codeBak.value,
      phone: bindRuleForm.username,
      phoneCode: bindRuleForm.password,
    })
    .then((res: any) => {
      if (res.result) {
        alert('登录成功');
        localStorage.setItem('token', res.token);
        store.dispatch('main/setToken', res.token);
        request
          .get(`/login/getInfo?email=${res.account}&token=${res.token}`)
          .then((res2: any) => {
            if (res2.code === 200) {
              localStorage.setItem('userInfo', JSON.stringify(res2.info));
              store.dispatch('main/setUserInfo', res2.info);
              store.dispatch('main/setShowLogin', false);
              setTimeout(() => {
                router.back();
              }, 100);
            }
          });
      } else {
        alert(`登录失败：${res.msg}`);
      }
    })
    .catch(() => {
      alert('登录失败');
    });
};

const showAgreement = async () => {
  const agreement: any = await request.get('/agreement');
  agreementInfo.content = agreement.content;
  agreementInfo.title = agreement.title;
  showRuleContent.value = true;
};

// Lifecycle hook
onMounted(() => {
  WeChat.isInstalled().then((isInstalled) => {
    isInstalledWeChat.value = isInstalled;
  });
  getAuth()
});
</script>

<style scoped lang="less">
.login_content {
  width: 750px;
  max-height: 100vh;
  overflow-y: auto;

  .close {
    position: absolute;
    left: 30px;
    top: 30px;

    >img {
      width: 50px;
      height: 50px;
    }
  }
}

.login_content_inner {
  padding-top: env(safe-area-inset-top);

  .icon {
    text-align: center;

    >img {
      width: 200px;
    }
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

      .item {

        >img {
          height: 120px;
        }
      }
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
  padding-left: 25px;
  padding-right: 25px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .Check {
    margin-right: 16px;
  }

  .agree {
    color: #24248f;
  }

  .desc {
    font-size: 32px;
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
    position: relative;

    .tempCodeImg {
      display: flex;
      align-items: flex-end;
      flex-direction: column;

      >img {
        width: 100%;
      }
    }

    .tools {
      display: flex;
      justify-content: end;

      >img {
        width: 60px;
        height: 60px;
      }
    }

    .tempInputText {
      font-size: 32px;
      margin-top: 32px;
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
      font-size: 32px;
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

.agreementInfoPopUp {
  height: 100%;
  overflow: auto;
  font-size: 32px;
  padding: 16px;
}

@media (min-width: 400px) {
  .login_content {
    .form {
      .el-form-item {
        .loginInput {
          height: 53PX;
          border-width: 2PX;

          :deep(input) {
            height: 49PX;
          }
        }

        .tmpCodeButton {
          height: 53PX;
        }

        .action_button {
          height: 64PX;
        }
      }
    }
  }
}
</style>

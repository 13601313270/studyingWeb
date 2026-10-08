<template>
  <div class="login_content">
    <div class="login_content_inner">
      <div class="login_header">
        <div class="brand">
          <img class="brand_icon" src="../icons/icon_green.png" />
          <text class="brand_name">松鼠学</text>
        </div>
        <div class="close" @click="back">
          <img src="../icons/close.png" />
        </div>
      </div>
      <div class="login_welcome">欢迎回来，继续积累今天的知识</div>
      <div class="form" :model="ruleForm" :rules="rules">
        <div class="el-form-item" label="账号" prop="username">
          <text class="text">手机号</text>
          <div class="loginInput">
            <input v-model="ruleForm.username" placeholder="请输入 11 位手机号" />
          </div>
        </div>
        <div class="el-form-item" label="密码" prop="password">
          <text class="text">验证码</text>
          <div class="codeRow">
            <div class="loginInput">
              <input v-model="ruleForm.password" placeholder="请输入验证码" />
            </div>
            <div v-if="nextCodeTime > 0" class="instead_button">
              <text>{{ nextCodeTime }}s 后重新获取</text>
            </div>
            <div v-else class="tmpCodeButton" @click="getTempCode">获取验证码</div>
          </div>
        </div>
        <div class="el-form-item">
          <Button class="action_button loginButton" @click="login" primary text="登录 / 注册"></Button>
        </div>
      </div>
      <div class="divider"><span>或通过以下方式登录</span></div>
      <div class="weChatLoginBtn" @click="weChatLogin">
        <img src="../icons/wechat.png" />
        <text>微信登录</text>
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
      <div class="checkContent">
        <Check :value="isSelectRule" @check="wxcCheckBoxItemChecked" />
        <div class="desc">
          我已同意<span class="agree" @click="showAgreement">《服务协议》</span>与<span class="agree"
            @click="showAgreement">《隐私条款》</span>
        </div>
      </div>
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
            <input v-model="bindRuleForm.username" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="el-form-item">
          <div class="text">验证码</div>
          <div class="codeRow">
            <div class="loginInput">
              <input v-model="bindRuleForm.password" placeholder="请输入验证码" />
            </div>
            <div v-if="nextCodeTime > 0" class="instead_button">
              <text>{{ nextCodeTime }}s 后重新获取</text>
            </div>
            <div v-else class="tmpCodeButton" @click="getTempCodeBind">获取验证码</div>
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
  width: 100%;
  max-height: calc(100vh - 36px);
  overflow-y: auto;
  background-color: white;
  border-radius: 46px;
  position: relative;
}

.login_content_inner {
  display: flex;
  flex-direction: column;
  padding: 52px 44px 44px;

  .login_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .brand {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;

      .brand_icon {
        width: 78px;
        height: 78px;
      }

      .brand_name {
        font-size: 42px;
        font-weight: 600;
        color: #1a1a1a;
      }
    }

    .close {
      width: 76px;
      height: 76px;
      border-radius: 38px;
      background-color: rgb(241, 243, 241);
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 24px;
      top: 24px;

      >img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .login_welcome {
    font-size: 24px;
    margin-top: 18px;
    margin-bottom: 44px;
    color: #888;
  }
}

.form {
  margin: 0;

  .el-form-item {
    margin-bottom: 32px;
    margin-top: 14px;

    .text {
      display: block;
      font-size: 22px;
      color: #68736d;
      margin-bottom: 14px;
      font-weight: 600;
    }

    .loginInput {
      height: 96px;
      background-color: rgb(247, 248, 246);
      border: 1PX solid rgb(233, 238, 235);
      border-radius: 24px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      align-items: center;

      input {
        height: 100%;
        width: 100%;
        font-size: 28px;
        padding: 0 24px;
        color: #333;
        box-sizing: border-box;
        border: none;
        outline: none;
        background: transparent;

        &::placeholder {
          color: #aaa;
        }
      }
    }

    .loginButton {
      width: 100%;
      height: 48px;
      margin-top: 8px;
      border-radius: 24px;
    }

    .codeRow {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 10px;

      .loginInput {
        flex-grow: 1;
      }

      .instead_button,
      .tmpCodeButton {
        flex: 0 0 auto;
        height: 96px;
        background-color: rgb(240, 242, 240);
        border: none;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        margin: 0;
        width: auto;
        padding: 0 16px;
      }

      .tmpCodeButton {
        width: 204px;
        color: #333;
        cursor: pointer;
        border: 1PX solid rgb(233, 238, 235);
        color: rgb(154, 164, 159);
        box-sizing: border-box;
      }

      .instead_button {
        color: #888;
      }
    }
  }
}

/* Button 组件 primary 浅绿覆盖 */
.form :deep(.button.primary) {
  background: #2f7d5a;
  border: none;
  border-radius: 24px;
  height: 96px;

  .button_text {
    font-size: 28px;
    line-height: 96px;
  }
}

.divider {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: rgb(154, 164, 159);
  margin-top: 22px;
  font-size: 20px;

  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: #e5e5e5;
  }

  span {
    padding: 0 12px;
  }
}

.weChatLoginBtn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 88px;
  background-color: white;
  border: 1PX solid #e5e5e5;
  border-radius: 24px;
  margin-top: 28px;
  cursor: pointer;

  >img {
    // width: 52px;
    height: 52px;
  }

  >text {
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }
}

.checkContent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  gap: 14px;

  :deep(.Check) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1PX solid rgb(203, 211, 206);

    >img {
      width: 26px;
      height: 26px;
    }
  }

  .desc {
    font-size: 20px;
    color: rgb(104, 115, 109);
  }

  .agree {
    color: #2b6cb0;
  }
}

.tempCodeBack {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;

  .tempCode {
    box-sizing: border-box;
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
      border-width: 1PX;
      border-color: rgba(0, 77, 59, 0.87);
      border-radius: 5px;
      margin-top: 12px;
      display: flex;

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

.agreementInfoPopUp {
  height: 100%;
  overflow: auto;
  font-size: 14px;
  padding: 16px;
}

@media (min-width: 1025px) {
  .login_content {
    .form {
      .el-form-item {
        .loginInput {
          height: 44px;
        }

        .codeRow {

          .instead_button,
          .tmpCodeButton {
            height: 44px;
            font-size: 12px;
          }
        }

        .loginButton {
          height: 44px;
        }
      }
    }

    .weChatLoginBtn {
      height: 44px;
    }

    .login_content_inner {
      padding: 62px 28px 20px;
    }
  }
}
</style>

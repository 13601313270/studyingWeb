<template>
  <Page title="用户信息" foot-active="mine">
    <div>
      <div class="header">
        <pic v-if="userInfo2.icon" class="icon" @click="showImgDetail(userInfo2.icon.replace('http://', 'https://'))"
          :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
          :width="80" />
        <text class="name">账号:</text>
        <text class="header_value">{{ userInfo2.account }}</text>
        <div style="flex-grow:1"></div>
        <Icon src="config" :width="52" @click="$router.push('/accountInfo')" />
        <!--                <text class="name">金币:</text>-->
        <!--                <text class="header_value">{{userInfo2.coin}}</text>-->
        <!--                <text class="tips">学习圈获取:1:每日5题，2:问答发表优质回答</text>-->
      </div>
    </div>
    <div class="actions">
      <div class="item" @click="nameInput = userInfo2.name, namePopShow = true">
        <text class="name">昵称:</text>
        {{ userInfo2.name }}
      </div>
      <div class="item">
        <text class="name">头像:</text>
        <input type="file" single ref="inputFile" accept="image/*" style="display:none" @change="uploadImg" />
        <div @click="selectUploadImg" v-if="userInfo2.icon" class="userIcon">
          <pic :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
            :width="100" />
        </div>
        <div v-else>
          <Button @click="selectUploadImg" style="width: 100px;" type="white" text="上传"></Button>
        </div>
        <Select :show="imgSelectShow" title="选择上传方式" @close="imgSelectShow = false" :list="[
          // {
          //   key: 'camera',
          //   title: '照相机'
          // },
          {
            key: 'gallery',
            title: '相册'
          }
        ]" @select="selectImgSelectShow">
        </Select>
      </div>
      <div class="item" @click="isBottomShow = true">
        <text class="name">性别:</text>
        <text class="value">{{ userInfo2.sex === 1 ? '女' : '男' }}</text>
        <pic src="right_black" width="40" />
      </div>
      <div class="item" @click="cityShow = true">
        <text class="name">城市:</text>
        <text class="value">{{ userInfo2.city ? userInfo2.city : '未设置' }}</text>
        <pic src="right_black" width="40" />
      </div>
      <div class="item" @click="isBottomGroundShow = true">
        <text class="name">年级:</text>
        <text class="value">{{ grandText }}</text>
        <pic src="right_black" width="40" />
      </div>
    </div>
    <Popup title="修改姓名" :show="namePopShow" @close="namePopShow = false">
      <div class="namePopContent">
        原名称：{{ userInfo2.name }}
        <Input v-model="nameInput" class="input" />
        <div>
          <Button text="保存" primary @click="saveName(nameInput)"></Button>
        </div>
      </div>
    </Popup>
    <Popup title="性别选择" :show="isBottomShow" @close="isBottomShow = false">
      <div class="sex">
        <div class="option" :class="{ active: userInfo2.sex === 0 }" @click="changeSex(0)">
          <text style="line-height: 100px;text-align: center">男</text>
        </div>
        <div class="option" :class="{ active: userInfo2.sex === 1 }" @click="changeSex(1)">
          <text style="line-height: 100px;text-align: center">女</text>
        </div>
      </div>
    </Popup>
    <Popup title="城市选择" :show="cityShow" @close="cityShow = false">
      <div class="cityPopContent">
        <div class="citySelect">
          <div class="title">直辖市 & 热门城市</div>
          <div class="hotCityList">
            <div class="cityItem" :class="{ active: userInfo2.city === city.cityName }" v-for="city in cityList.hotCity"
              :key="city.cityName" @click="citySelect(city.cityName)">
              {{ city.cityName }}
            </div>
          </div>
        </div>
        <div class="citySelect" v-for="groupKey in Object.keys(groupCity)" :key="groupKey">
          <div class="title">{{ groupKey.toUpperCase() }}</div>
          <div class="hotCityList">
            <div class="cityItem" :class="{ active: userInfo2.city === city.cityName }" v-for="city in groupCity[groupKey]"
              :key="city.cityName" @click="citySelect(city.cityName)">
              {{ city.cityName }}
            </div>
          </div>
        </div>
      </div>
    </Popup>
    <Popup title="选择年级" :show="isBottomGroundShow" @close="isBottomGroundShow = false">
      <div class="groundPop">
        <div class="option" :class="{ active: userInfo2.grand === 1 }" @click="changeGround(1)">
          <text>高一</text>
        </div>
        <div class="option" :class="{ active: userInfo2.grand === 2 }" @click="changeGround(2)">
          <text>高二</text>
        </div>
        <div class="option" :class="{ active: userInfo2.grand === 3 }" @click="changeGround(3)">
          <text>高三</text>
        </div>
      </div>
    </Popup>
    <Camera v-if="showCamera" @save="saveImg" @close="close" :proportion="1" />
  </Page>
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
import city from '../plugin/city'
import toast from '../plugin/toast'
import Message from '../components/Message.vue'
import { showImg } from '../plugin/imagePreview'
import Camera from '@/components/Camera.vue'
import Icon from '@/components/icon.vue';
import Page from '@/components/Page.vue';

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
    this.setPath([{ name: '用户信息' }]);
  },
  data() {
    const groupCity = {};
    city.cities.forEach(city => {
      const firstWord = city.pinYin[0]
      if (!groupCity[firstWord]) {
        groupCity[firstWord] = []
      }
      groupCity[firstWord].push(city)
    })
    return {
      userInfo2: {},
      cityList: city,
      groupCity: groupCity,
      isBottomShow: false,
      cityShow: false,
      namePopShow: false,
      isBottomGroundShow: false,
      nameInput: '',
      imgSelectShow: false,
      showCamera: false,
    }
  },
  computed: {
    ...mapGetters('main', ['userInfo', 'token']),
    grandText() {
      if (this.userInfo2.grand === 1) {
        return '高一'
      } else if (this.userInfo2.grand === 2) {
        return '高二'
      } else if (this.userInfo2.grand === 3) {
        return '高三'
      }
    }
  },
  methods: {
    ...mapActions('main', ['setPath']),
    update() {
      request.get('/user/getInfo').then(res => {
        this.userInfo2 = res;
      });
      // this.logAction('mine');
    },
    selectUploadImg() {
      this.imgSelectShow = true;
    },
    async uploadImg(e) {
      if (!this.userInfo) {
        return;
      }
      const fileData = e.target.files[0]
      let formData = new FormData()
      formData.append('file', fileData)
      formData.append('token', this.userInfo.account + '@@' + this.token)
      await request.postForm('/userIcon', formData)
      this.update()
    },
    changeInfo() {
      request.post('/user/setInfo', {
        name: this.userInfo2.name,
        sex: this.userInfo2.sex,
        city: this.userInfo2.city,
        grand: this.userInfo2.grand
      }).then(res => {
        toast({
          'message': '已修改',
          'duration': 1000
        })
        this.update();
      });
    },
    changeSex(sex) {
      this.userInfo2.sex = sex;
      this.changeInfo()
      this.isBottomShow = false;
    },
    changeGround(grand) {
      this.userInfo2.grand = grand;
      this.changeInfo()
      this.isBottomGroundShow = false;
    },
    citySelect(name) {
      this.userInfo2.city = name;
      this.changeInfo()
      this.cityShow = false;
    },
    saveName(newVal) {
      this.userInfo2.name = newVal;
      this.changeInfo()
      this.namePopShow = false
    },
    showImgDetail(img) {
      showImg(img)
    },
    selectImgSelectShow(type) {
      this.imgSelectShow = false;
      if (type.key === 'camera') {
        this.showCamera = true;
      } else if (type.key === 'gallery') {
        console.log(this.$refs.inputFile)
        // camera();
        this.$refs.inputFile.click()
      }
    },
    async saveImg(url) {
      function base64toBlob(dataurl, filename) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      }
      // const fileData = e.target.files[0]
      let formData = new FormData()
      formData.append('file', base64toBlob(url))
      formData.append('token', this.userInfo.account + '@@' + this.token)
      await request.postForm('/userIcon', formData)
      this.update()


      this.showCamera = false;
    },
    close() {
      this.showCamera = false;
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
    Page
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
  box-sizing: border-box;
  height: 230px;
  color: white;

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

.actions {
  .item {
    display: flex;
    flex-direction: row;
    font-size: 32px;
    justify-content: space-between;
    align-items: center;
    border-bottom-style: solid;
    border-bottom-color: #d8d8d8;
    border-bottom-width: 1px;
    padding: 10px 20px 10px 50px;
    height: 110px;

    .name {
      width: 200px;
    }

    .value {
      flex: 1;
      text-align: right;
      margin-right: 30px;
    }

    .userIcon {
      border-radius: 20px;
      width: 100px;
      height: 100px;
      border: solid 1px rgb(228, 228, 228);
      overflow: hidden;
    }
  }
}

.moreAction {
  margin-top: 32px;
  padding: 24px;
}

.tips {
  position: absolute;
  right: 10px;
  bottom: 20px;
  font-size: 24px;
  color: #a6a6a6;
}

.sex {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .option {
    width: 300px;
    height: 200px;
    line-height: 200px;
    font-size: 40px;
    color: #999;
    text-align: center;
    border-radius: 20px;
    border: solid 1px #b4b4b4;
    box-sizing: border-box;

    &.active {
      border: solid 10px #33713a;
      line-height: 180px;
      color: #33713a;
      font-size: 50px;
      font-weight: bold;
    }
  }
}

.cityPopContent {
  max-height: 80vh;
  overflow: auto;
  background-color: rgb(239, 239, 239);
}

.citySelect {
  .title {
    font-size: 38px;
    margin: 30px 0 10px 0;
    padding-left: 40px;
  }

  .hotCityList {
    display: flex;
    flex-wrap: wrap;

    .cityItem {
      height: 88px;
      line-height: 88px;
      margin-left: 40px;
      text-align: center;
      width: 200px;
      margin-bottom: 20px;
      font-size: 24px;
      border: solid 1px rgb(217, 217, 217);
      border-radius: 10px;
      background-color: white;

      &.active {
        background: #00795c;
        color: white;
      }
    }
  }
}

.namePopContent {
  padding: 20px;

  .input {
    margin-top: 30px;
    margin-bottom: 30px;
    width: 100%;
  }
}

.groundPop {
  display: flex;
  justify-content: space-evenly;
  padding: 100px 0;

  .option {
    width: 200px;
    height: 140px;
    line-height: 150px;
    font-size: 40px;
    color: #999;
    text-align: center;
    border-radius: 20px;
    border: solid 1px #b4b4b4;
    box-sizing: border-box;

    &.active {
      border: solid 10px #33713a;
      line-height: 120px;
      color: #33713a;
      font-size: 50px;
      font-weight: bold;
    }
  }
}
</style>

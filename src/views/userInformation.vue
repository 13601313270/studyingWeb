<template>
  <Page title="用户信息" foot-active="mine">
    <div class="page-bg">
      <!-- 顶部资料卡片 -->
      <div class="profile-card">
        <div class="avatar-circle" :class="{ 'has-img': userInfo2.icon }">
          <img
            v-if="userInfo2.icon"
            class="avatar-img"
            :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_200,w_200'"
            @click="showImgDetail(userInfo2.icon.replace('http://', 'https://'))"
          />
          <span v-else class="avatar-text">{{ avatarInitial }}</span>
        </div>
        <div class="profile-info">
          <div class="profile-name">{{ userInfo2.name || '未设置昵称' }}</div>
          <div class="profile-sub">完善资料，让推荐更适合你</div>
        </div>
        <div class="profile-progress">
          <span class="progress-num">{{ profilePercent }}</span>
          <span class="progress-unit">%</span>
        </div>
      </div>

      <!-- 信息列表卡片 -->
      <div class="info-card">
        <div class="info-item" @click="nameInput = userInfo2.name, namePopShow = true">
          <div class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#00795c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22" stroke="#00795c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="item-label">昵称</div>
          <div class="item-value">{{ userInfo2.name || '未设置' }}</div>
          <div class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="info-item" @click="selectUploadImg">
          <div class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.9 8.6L22 9.3L16.5 14.1L18.2 21.2L12 17.5L5.8 21.2L7.5 14.1L2 9.3L9.1 8.6L12 2Z" stroke="#00795c" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="item-label">头像</div>
          <div class="item-value avatar-value">
            <div class="avatar-thumb" :class="{ 'has-img': userInfo2.icon }">
              <img
                v-if="userInfo2.icon"
                :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
              />
              <span v-else>{{ avatarInitial }}</span>
            </div>
          </div>
          <div class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="info-item" @click="isBottomShow = true">
          <div class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3" stroke="#00795c" stroke-width="1.5"/>
              <path d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21" stroke="#00795c" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M8 13C8.5 11.5 10 11 12 11C14 11 15.5 11.5 16 13" stroke="#00795c" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="item-label">性别</div>
          <div class="item-value">{{ userInfo2.sex === 1 ? '女' : '男' }}</div>
          <div class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="info-item" @click="cityShow = true">
          <div class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 20 14.5 20 8.5C20 4.36 16.42 1 12 1C7.58 1 4 4.36 4 8.5C4 14.5 12 22 12 22Z" stroke="#00795c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="8.5" r="2.5" stroke="#00795c" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="item-label">城市</div>
          <div class="item-value">{{ userInfo2.city || '未设置' }}</div>
          <div class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="info-item last" @click="isBottomGroundShow = true">
          <div class="item-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10L12 5L21 10L12 15L3 10Z" stroke="#00795c" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>
              <path d="M7 12V17C7 18.1 8.8 19 12 19C15.2 19 17 18.1 17 17V12" stroke="#00795c" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="item-label">年级</div>
          <div class="item-value">{{ grandText }}</div>
          <div class="item-arrow">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 保持原有隐藏的上传组件 -->
    <input type="file" single ref="inputFile" accept="image/*" style="display:none" @change="uploadImg" />
    <Select :show="imgSelectShow" title="选择上传方式" @close="imgSelectShow = false" :list="[
      {
        key: 'gallery',
        title: '相册'
      }
    ]" @select="selectImgSelectShow">
    </Select>

    <Popup :show="namePopShow" @close="namePopShow = false">
      <div class="sex-sheet name-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title-wrap">
            <div class="sheet-subtitle">快速编辑</div>
            <div class="sheet-title">修改昵称</div>
          </div>
          <div class="sheet-close" @click="namePopShow = false">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="name-body">
          <div class="name-field">
            <div class="name-label">昵称</div>
            <input v-model="nameInput" class="name-input" :placeholder="userInfo2.name" maxlength="20" />
          </div>
          <div class="name-save-btn" :class="{ disabled: !nameInput || nameInput.trim() === '' }" @click="saveName(nameInput)">
            保存
          </div>
        </div>
      </div>
    </Popup>

    <Popup :show="isBottomShow" @close="isBottomShow = false">
      <div class="sex-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title-wrap">
            <div class="sheet-subtitle">快速选择</div>
            <div class="sheet-title">性别选择</div>
          </div>
          <div class="sheet-close" @click="isBottomShow = false">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="sex-options">
          <div class="sex-card" :class="{ active: userInfo2.sex === 0 }" @click="changeSex(0)">
            <text class="sex-text">男</text>
            <div class="sex-check">
              <svg v-if="userInfo2.sex === 0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="sex-circle"></div>
            </div>
          </div>
          <div class="sex-card" :class="{ active: userInfo2.sex === 1 }" @click="changeSex(1)">
            <text class="sex-text">女</text>
            <div class="sex-check">
              <svg v-if="userInfo2.sex === 1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="sex-circle"></div>
            </div>
          </div>
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

    <Popup :show="isBottomGroundShow" @close="isBottomGroundShow = false">
      <div class="sex-sheet grade-sheet">
        <div class="sheet-handle"></div>
        <div class="sheet-header">
          <div class="sheet-title-wrap">
            <div class="sheet-subtitle">快速选择</div>
            <div class="sheet-title">选择年级</div>
          </div>
          <div class="sheet-close" @click="isBottomGroundShow = false">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="grade-options">
          <div class="grade-card" :class="{ active: userInfo2.grand === 1 }" @click="changeGround(1)">
            <text class="grade-text">高一</text>
            <div class="grade-check">
              <svg v-if="userInfo2.grand === 1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="grade-circle"></div>
            </div>
          </div>
          <div class="grade-card" :class="{ active: userInfo2.grand === 2 }" @click="changeGround(2)">
            <text class="grade-text">高二</text>
            <div class="grade-check">
              <svg v-if="userInfo2.grand === 2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="grade-circle"></div>
            </div>
          </div>
          <div class="grade-card" :class="{ active: userInfo2.grand === 3 }" @click="changeGround(3)">
            <text class="grade-text">高三</text>
            <div class="grade-check">
              <svg v-if="userInfo2.grand === 3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L19 8" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-else class="grade-circle"></div>
            </div>
          </div>
        </div>
      </div>
    </Popup>

    <Camera v-if="showCamera" @save="saveImg" @close="close" :proportion="1" />
  </Page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import pic from '../components/icon';
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
      return '未设置'
    },
    avatarInitial() {
      const name = this.userInfo2.name || this.userInfo2.account || '?'
      return name.charAt(0)
    },
    profilePercent() {
      let filled = 0
      if (this.userInfo2.name) filled++
      if (this.userInfo2.icon) filled++
      if (this.userInfo2.sex !== undefined && this.userInfo2.sex !== null) filled++
      if (this.userInfo2.city) filled++
      if (this.userInfo2.grand) filled++
      return Math.round((filled / 5) * 100)
    }
  },
  methods: {
    ...mapActions('main', ['setPath']),
    update() {
      request.get('/user/getInfo').then(res => {
        this.userInfo2 = res;
      });
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
.page-bg {
  min-height: 100vh;
  background-color: #f5f6f5;
  padding: 24px;
  box-sizing: border-box;
}

.profile-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  border-radius: 24px;
  padding: 36px 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #00795c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    margin-right: 24px;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .avatar-text {
      color: #ffffff;
      font-size: 52px;
      font-weight: 600;
      font-family: PingFangSC-Medium, sans-serif;
    }
  }

  .profile-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;

    .profile-name {
      font-size: 40px;
      font-weight: 600;
      color: #17211c;
      line-height: 1.3;
      font-family: PingFangSC-Medium, sans-serif;
    }

    .profile-sub {
      font-size: 26px;
      color: #8a9a92;
      margin-top: 6px;
      line-height: 1.4;
    }
  }

  .profile-progress {
    flex-shrink: 0;
    text-align: right;

    .progress-num {
      font-size: 44px;
      font-weight: 600;
      color: #00795c;
      font-family: PingFangSC-Medium, sans-serif;
    }

    .progress-unit {
      font-size: 24px;
      color: #00795c;
      margin-left: 2px;
    }
  }
}

.info-card {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .info-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 32px;
    border-bottom: 1px solid #f0f2f1;

    &:last-child {
      border-bottom: none;
    }

    .item-icon {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      margin-right: 20px;

      svg {
        width: 100%;
        height: 100%;
      }
    }

    .item-label {
      font-size: 30px;
      color: #17211c;
      flex-shrink: 0;
      width: 120px;
      font-family: PingFangSC-Regular, sans-serif;
    }

    .item-value {
      flex: 1;
      text-align: right;
      font-size: 30px;
      color: #333;
      margin-right: 16px;
      font-family: PingFangSC-Regular, sans-serif;

      &.avatar-value {
        display: flex;
        justify-content: flex-end;
      }
    }

    .item-arrow {
      width: 36px;
      height: 36px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.avatar-thumb {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #00795c;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  span {
    color: #ffffff;
    font-size: 32px;
    font-weight: 600;
    font-family: PingFangSC-Medium, sans-serif;
  }
}

/* ===== 以下为原有弹窗样式，保持不变 ===== */
.sex-sheet {
  padding: 0 32px 48px 32px;

  .sheet-handle {
    width: 80px;
    height: 8px;
    border-radius: 4px;
    background-color: #e0e0e0;
    margin: 16px auto 32px auto;
  }

  .sheet-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;

    .sheet-title-wrap {
      display: flex;
      flex-direction: column;

      .sheet-subtitle {
        font-size: 26px;
        color: #00795c;
        font-weight: 500;
        font-family: PingFangSC-Regular, sans-serif;
        margin-bottom: 4px;
      }

      .sheet-title {
        font-size: 40px;
        color: #17211c;
        font-weight: 600;
        font-family: PingFangSC-Medium, sans-serif;
      }
    }

    .sheet-close {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        width: 40px;
        height: 40px;
      }
    }
  }

  .sex-options {
    display: flex;
    flex-direction: row;
    gap: 24px;

    .sex-card {
      flex: 1;
      height: 140px;
      border-radius: 20px;
      border: solid 2px #e0e0e0;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      transition: all 0.2s;

      .sex-text {
        font-size: 36px;
        color: #666;
        font-weight: 500;
        font-family: PingFangSC-Medium, sans-serif;
      }

      .sex-check {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;

        svg {
          width: 100%;
          height: 100%;
        }

        .sex-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: solid 2px #ccc;
          box-sizing: border-box;
        }
      }

      &.active {
        background-color: #eaf5ef;
        border: solid 2px #00795c;

        .sex-text {
          color: #00795c;
          font-weight: 600;
        }

        .sex-check {
          width: 44px;
          height: 44px;

          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
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

.name-sheet {
  .name-body {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .name-field {
    margin-bottom: 40px;

    .name-label {
      font-size: 28px;
      color: #999;
      margin-bottom: 16px;
      font-family: PingFangSC-Regular, sans-serif;
    }

    .name-input {
      width: 100%;
      height: 96px;
      border: solid 2px #e0e0e0;
      border-radius: 16px;
      padding: 0 28px;
      font-size: 32px;
      color: #17211c;
      background-color: #fafafa;
      box-sizing: border-box;
      font-family: PingFangSC-Regular, sans-serif;
      outline: none;

      &:focus {
        border-color: #00795c;
        background-color: #ffffff;
      }
    }
  }

  .name-save-btn {
    height: 96px;
    border-radius: 48px;
    background-color: #00795c;
    color: #ffffff;
    font-size: 32px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFangSC-Medium, sans-serif;

    &.disabled {
      background-color: #ccc;
      pointer-events: none;
    }
  }
}

.grade-sheet {
  .grade-options {
    display: flex;
    flex-direction: row;
    gap: 20px;

    .grade-card {
      flex: 1;
      height: 140px;
      border-radius: 20px;
      border: solid 2px #e0e0e0;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      .grade-text {
        font-size: 32px;
        color: #666;
        font-weight: 500;
        font-family: PingFangSC-Medium, sans-serif;
      }

      .grade-check {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;

        svg {
          width: 100%;
          height: 100%;
        }

        .grade-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: solid 2px #ccc;
          box-sizing: border-box;
        }
      }

      &.active {
        background-color: #eaf5ef;
        border: solid 2px #00795c;

        .grade-text {
          color: #00795c;
          font-weight: 600;
        }

        .grade-check {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>

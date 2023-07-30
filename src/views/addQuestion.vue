<template>
  <scroller class="addQuestion">
    <text class="desc">提出你最近学习中遇到的问题，将会收到专业的回答。</text>
    <textarea class="content" v-model="content" placeholder="请输入问题"></textarea>
    <div class="count" v-if="maxCount>1">
      <div style="text-align: right;">{{imgs.length}} / {{maxCount}}</div>
    </div>
    <div class="imgs">
      <input type="file" ref="inputFile" style="display:none" @change="uploadImg"/>
      <div class="img" v-for="(url,index) in imgs" :key="url">
        <img :src="url+'?x-oss-process=image/resize,m_fill,h_300,w_300'"/>
        <div class="close" @click="imgs.splice(index,1)">
          <Icon src="close" :width="40" :height="40" />
        </div>
      </div>
      <div class="img" @click="showUploadImg" v-if="imgs.length<maxCount">
        <div class="imgAddImgText">添加图片</div>
      </div>
    </div>
    <text class="desc">信息发布后，系统会进行简短的审核，审核后会出现在学习圈中</text>
    <Select
      :show="imgSelectShow"
      title="选择上传方式"
      @close="imgSelectShow=false"
      :list="[
        // {
        //   key: 'camera',
        //   title: '照相机'
        // },
        {
          key: 'gallery',
          title: '相册'
        }
      ]"
      @select="selectImgSelectShow"
    >
    </Select>
    <Camera
      v-if="showCamera"
      @save="saveImg"
      @close="close"
      :proportion="1"
    />
  </scroller>
</template>

<script>
  import event from '../plugin/event';
  // import Nat from "natjs";
  import Icon from "@/components/icon";
  import Select from '@/components/Select.vue'
  import Camera from '@/components/Camera.vue'
  import request from '@/plugin/request'
  import { mapActions, mapGetters } from "vuex";

  // var modal = weex.requireModule('modal');

  export default {
    name: "addQuestion",
    components: { Icon, Select, Camera },
    data() {
      return {
        content: '',
        imgs: [],
        maxCount: 9,
        imgSelectShow: false,
        showCamera: false,
        sss: ''
      }
    },
    created() {
      event.on('add', () => {
        this.showInsert = true;
        if (!this.content) {
          // modal.toast({
          //     'message': '请填写问题内容',
          //     'duration': 2.0
          // })
        } else {
          request.post('/zhidao/insertV2', {
            content: this.content,
            imgs: JSON.stringify(this.imgs)
          }).then(res => {
            if (res.result) {
              // modal.toast({
              //     'message': '发布成功',
              //     'duration': 2.0
              // })
              setTimeout(() => {
                  this.$router.back();
              }, 500)
            } else {
              // modal.toast({
              //     'message': res.msg,
              //     'duration': 2.0
              // })
            }
          })
        }
      });
      this.setRightButton([])
    },
    methods: {
      ...mapActions('main', ['setToken', 'setUserInfo', 'setShowLogin']),
      showUploadImg() {
        this.imgSelectShow = true;
          // Nat.image.pick({
          //     limit: 1,
          //     showCamera: false
          // }, (err, ret) => {
          //     const uploadFile = ret.paths[0];
          //     Nat.image.info(uploadFile, (err, ret) => {
          //         let type;
          //         if (ret) {
          //             type = ret.type;
          //         } else {
          //             type = 'jpg';
          //         }
          //         if (!['png', 'jpeg', 'jpg'].includes(type)) {
          //             modal.toast({
          //                 'message': '请使用png、jpg类型图片',
          //                 'duration': 2.0
          //             })
          //             return;
          //         }
          //         const token = Vue.prototype.vuex.main.userInfo ? (Vue.prototype.vuex.main.userInfo.account + '@@' + Vue.prototype.vuex.main.token) : '';
          //         Nat.upload('http://api.studying1v1.com/appImg', {
          //             path: uploadFile,
          //             method: 'POST',
          //             formData: {
          //                 token: token
          //             }
          //         }, (err, ret) => {
          //             if (ret === null) {
          //                 modal.toast({
          //                     'message': '未登录',
          //                     'duration': 2.0
          //                 })
          //                 this.setShowLogin(true)
          //             } else {
          //                 const data = ret.data;
          //                 const result = JSON.parse(data);
          //                 this.imgs.push(result.url);
          //             }

          //             console.log(ret)
          //         })
          //     })
          // })
      },
      selectImgSelectShow(type) {
        this.imgSelectShow = false;
        if (type.key === 'camera') {
          this.showCamera = true;
        } else if(type.key === 'gallery') {
          console.log(this.$refs.inputFile)
          this.$refs.inputFile.click()
        }
      },
      async uploadImg(e) {
        const fileData = e.target.files[0]
        let formData = new FormData()
        formData.append('file', fileData)
        formData.append('token',this.userInfo.account + '@@' + this.token)
        const data = await request.postForm('/appImg', formData)
        this.imgs.push(data.url)
      },
      async saveImg(url) {
        function  base64toBlob(dataurl, filename) {
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
        formData.append('token',this.userInfo.account + '@@' + this.token)
        const data = await request.postForm('/appImg', formData)
        this.imgs.push(data.url)
        this.showCamera = false;
      },
      close() {
        this.showCamera = false;
      }
    },
    computed: {
      ...mapGetters('main', ['userInfo', 'token']),
    }
  }
</script>

<style scoped lang="less">
  .addQuestion {
    width: 750px;
  }

  .content {
    border-style: solid;
    border-width: 4px;
    width: 700px;
    height: 600px;
    margin-left: 25px;
    border-color: #7f8b8e;
    font-size: 36px;
    border-radius: 12px;
    padding: 10px;
    box-sizing: border-box;
  }

  .title {
    text-align: center;
    font-size: 42px;
    color: #142422;
    margin: 20px 0 20px 0;
  }
  .count {
    margin-right: 25px;
    margin-top: 25px;
    font-size: 28px;
  }

  .desc {
    margin: 25px;
    font-size: 26px;
    color: #919191;
  }

  .imgs {
      width: 725px;
      margin-top: 25px;
      margin-left: 25px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }

  .img {
    width: 214px;
    height: 214px;
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    position: relative;
    > img {
      width: 214px;
      height: 214px;
    }
  }

  .imgAddImgText {
    text-align: center;
    color: grey;
    line-height: 220px;
    font-size: 32px;
  }

  .close {
      position: absolute;
      top: 0;
      right: 0;
      padding: 5px;
      background-color: #ffa09e;
  }
</style>

<template>
  <div>
      <div style="display: flex;justify-content: center;align-items: center">
          <text class="title">{{info.title}}</text>
      </div>
      <div>
          <div class="content">{{info.content}}</div>
      </div>
      <!-- <div
          style="width:100%;height:200px;"
          @click="add"
      ></div> -->
      <!-- <div v-if="showBindDevelopPhone>=30" style="border-top-color:#000;">
          <text style="font-size: 50px;text-align: center">开启开发功能</text>
          <text style="font-size: 26px;color: grey;">当前：{{codeInfo?codeInfo.title:''}}</text>
          <text style="font-size: 26px;color: grey;" v-if="codeInfo">{{versionUrl}}</text>
          <div style="display: flex;flex-direction: row;margin-top: 10px;">
              <Button text="绑定" @click="bind" style="width: 100px;"/>
              <Button text="实验室功能" @click="selectPre" style="width: 230px;margin-left: 25px;"/>
              <Button text="清空" @click="unbind" style="width: 100px;margin-left: 25px;"/>
          </div>
          <div style="margin-top: 30px;">
              <text style="width: 300px;color:#696969;">目前已有实验室功能</text>
              <div
                  v-for="item in preList"
                  style="display: flex;flex-direction: row;align-items: center;margin-bottom: 10px;"
              >
                  <text style="width: 300px">{{item.title}}</text>
                  <Button text="选择" @click="bindPreBranch(item.url)"
                             style="width: 100px;height: 60px;"/>
              </div>
          </div>
      </div> -->
  </div>
</template>

<script>
import Button from '../components/Button.vue'
import toast from '../plugin/toast'
import request from '../plugin/request'

export default {
  name: 'mine',
  data() {
    return {
      info: {
        title: '',
        content: ''
      },
      secret: '',
      versionUrl: '',
      showBindDevelopPhone: 0,
      codeInfo: null,
      preList: [],
    }
  },
  created() {
    request.get('/aboutUs.html').then(res => {
      this.info = res;
    });
  },
  methods: {
    // bind() {
    //   const ScanCode = weex.requireModule('ScanCode')
    //   ScanCode.scan((res) => {
    //     toast({
    //       'message': JSON.stringify(res),
    //       'duration': 2.0
    //     })
    //     if (res.indexOf("studying1v1Test") === 0) {
    //       const DevVersion = weex.requireModule('DevVersion');
    //       DevVersion.bind(res.replace("studying1v1Test", ""))
    //     }
    //   });
    // },
    // bindPreBranch(url) {
    //   const DevVersion = weex.requireModule('DevVersion');
    //   DevVersion.bind(url)
    // },
    // unbind() {
    //     const DevVersion = weex.requireModule('DevVersion');
    //     DevVersion.bind("")
    // },
    // add() {
    //     this.showBindDevelopPhone = this.showBindDevelopPhone + 1;
    //     if (this.showBindDevelopPhone >= 30) {
    //         const DevVersion = weex.requireModule('DevVersion');
    //         DevVersion.get((res) => {
    //             this.versionUrl = res;
    //             request.get('/app/versionInfoByUrl?url=' + this.versionUrl).then(res => {
    //                 this.codeInfo = res;
    //             });
    //         })
    //     }
    // },
    // selectPre() {
    //     weex.requireModule('DeviceInfo').info(res => {
    //       request.get('/app/versionCode/ios/pre/' + res.version).then(res => {
    //             this.preList = res;
    //         });
    //     });
    // }
  },
  components: { Button },
}
</script>

<style scoped lang="less">
.title {
  font-size: 50px;
  margin-top: 50px;
  margin-bottom: 20px;
}
.content {
  font-size: 34px;
  padding: 30px;
  text-indent: 68px;
}
</style>

<template>
    <div>
        <div style="display: flex;justify-content: center;align-items: center">
            <text class="title">{{info.title}}</text>
        </div>
        <div class="content">
            <div v-html="info.content"></div>
        </div>
    </div>
</template>

<script>
    import request from '../plugin/request'
export default {
    name: 'mine',
    data() {
        return {
            info: {
                title: '',
                content: ''
            }
        }
    },
    created() {
        request.get('/agreement').then(res => {
            this.info = res;
        });
    }
}
</script>

<style scoped lang="less">
.title {
  font-size: 50px;
  margin-top: 50px;
  margin-bottom: 20px;
}
.content {
  font-size: 28px;
  padding: 30px;
  text-indent: 56px;
  color: rgb(154, 154, 154);
}
</style>

<template>
    <!-- <friendList /> -->
    <bbs />
</template>
<script>
import pic from '../components/icon';
import bbs from './bbs'
import friendList from './friendList'

export default {
    name: 'friend',
    created() {
    },
    data() {
        return {
            active: 0,
            showInsert: false
        }
    },
    computed: {},
    components: { pic, bbs, friendList },
    watch: {
        active(val) {
            // localStorage.setItem('friendChooseType', val)
        }
    }
}
</script>

<style scoped lang="less">
.tabContent {
    position: fixed;
    top: 10px;
    left: 100px;
    right: 100px;
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &Inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    &Item {
        width: 200px;
        height: 60px;
        color: white;
        text-align: center;

        &Active {
            border-bottom-style: solid;
            border-bottom-width: 6px;
            border-bottom-color: white;
        }
    }
}
</style>

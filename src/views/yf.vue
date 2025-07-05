<template>
    <div>asdfdasf</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore<any>()
onMounted(()=>{
    store.dispatch('main/setPath', [{ name: '语法' }])
})
</script>
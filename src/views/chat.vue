<template>
  <div>
    fas
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

onMounted(() => {
  // alert(route.params.id)
})

</script>
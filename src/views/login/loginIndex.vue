<template>
  <login v-if="loginStatus"></login>
  <no-login v-else />
</template>
<script lang="ts">
import login from "./login.vue";
import noLogin from "./noLogin.vue";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  components: { login, noLogin },
  setup() {
    const store = useStore();
    const loginStatus = computed(() => store.state.loginStatus);
    return {
      loginStatus,
    };
  },
});
</script>
<style lang="less" scoped></style>

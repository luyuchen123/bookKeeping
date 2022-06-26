<template>
  <list-header :active="activeTabName" v-if="hasListHeader"></list-header>
  <div class="list-body" v-if="hasListHeader">
    <component :is="listName"></component>
  </div>

  <van-icon
    name="plus"
    color="#1989fa"
    class="add-icon"
    @click="handlerAdd"
    v-if="hasListHeader"
  />
  <login v-if="!hasListHeader"></login>
  <van-tabbar v-model="activeTabName">
    <van-tabbar-item icon="home-o" name="bookKeeping"> 记账 </van-tabbar-item>
    <van-tabbar-item icon="search" name="stockControl">
      库存管理
    </van-tabbar-item>
    <van-tabbar-item icon="friends-o" name="mine">我的</van-tabbar-item>
  </van-tabbar>
</template>
<script lang="ts">
const defaultTabName = "bookKeeping";
import { computed, defineComponent, ref, watch } from "vue";
import listHeader from "@/components/ListHeader.vue";
import login from "@/views/login/loginIndex.vue";
import router from "@/router";
import bookKeepingList from "@/views/bookKeeping/bookKeeepingList.vue";
import stockList from "@/views/stock/stockList.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import Storage from "@/util/storage";
import { get } from "vant/lib/utils";
const listMap = new Map([
  ["bookKeeping", "bookKeepingList"],
  ["stockControl", "stockList"],
]);
export default defineComponent({
  name: "Index",
  components: {
    listHeader,
    login,
    bookKeepingList,
    stockList,
  },
  setup() {
    const store = useStore();

    //当前在哪个tab
    const activeTabName = computed({
      set(val: string) {
        Storage.set("activeTab", val);
        store.commit("setTabActive", val);
      },
      get() {
        return String(
          store.state.activeTab ||
            useRoute()?.params?.addType ||
            Storage.get("activeTab") ||
            defaultTabName
        );
      },
    });
    console.log(useRoute()?.params);
    //是否有头部
    const hasListHeader = computed(() => {
      const hasArray = ["bookKeeping", "stockControl"];
      return hasArray.includes(activeTabName.value);
    });
    //列表渲染哪个组件
    const listName = computed(() => listMap.get(activeTabName.value));
    //点击加号跳转
    const handlerAdd = () => {
      const addMap = new Map([
        ["bookKeeping", "/add"],
        ["stockControl", "/add/stockAdd"],
      ]);
      store.commit("setEditorItemId", { id: "" });
      router.push({
        path: addMap.get(activeTabName.value),
        query: { addType: activeTabName.value },
      });
    };
    return {
      activeTabName,
      hasListHeader,
      listName,
      handlerAdd,
    };
  },
});
</script>

<style lang="less" scoped>
.list-body {
  height: calc(90vh - 1.2rem);
  height: calc(var(--vh) * 90 - 1.2rem);
  // overflow: auto;
  // height: 70vh;
  overflow: auto;
}
.add-icon {
  position: fixed;
  top: 80%;
  right: 0;
  transform: translateX(-10px);
  border: 1px solid #1989fa;
  border-radius: 50%;
}
/deep/.van-tabbar {
  height: 5vh !important;
}
</style>

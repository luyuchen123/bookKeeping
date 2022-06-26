<template>
  <lazy-component>
    <van-grid :column-num="columnNum" class="grid">
      <template v-for="item in list" :key="item._id">
        <div class="item" @click="typeClick(item._id)">
          <van-grid-item
            :icon="/^el-icon-.*/.test(item.iconClass) ? 'fail' : item.iconClass"
            :text="item.name"
            :class="[item._id === nowIconId ? 'editor' : '']"
          />
          <van-icon
            v-if="/^el-icon-.*/.test(item.iconClass)"
            class="button iconfont"
            :class="[item.iconClass, item._id === nowIconId ? 'editor' : '']"
          ></van-icon>
        </div>
      </template>
    </van-grid>
  </lazy-component>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    columnNum: {
      type: Number,
      default: 3,
    },
    list: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const typeClick = (_id: string) => {
      emit("type-click", _id);
    };
    const nowIconId = computed(() => store.state.nowIconId);
    return {
      typeClick,
      nowIconId,
    };
  },
});
</script>
<style lang="less" scoped>
.editor {
  /deep/ .van-grid-item__content {
    background-color: rgb(225, 225, 225, 0.5);
  }
}
/deep/ [class*="van-hairline"]:after {
  border: none;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
}
.item {
  position: relative;
  height: 90px;
  width: 90px;
}
.button {
  position: absolute;
  top: 16px;
  height: 24px;
  width: 100%;
  transform: translateX(-50%);
  background: white;
  z-index: 22;
  font-size: 24px;
}
.button.editor {
  background-color: rgb(225, 225, 225, 0.5);
}
</style>

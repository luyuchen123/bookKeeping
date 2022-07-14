<template>
  <lazy-component>
    <van-grid :column-num="columnNum" class="grid" @scroll="handlScroll">
      <template v-for="item in list" :key="item._id">
        <div
          class="item"
          :class="shapeId === item._id ? 'shape' : ''"
          @touchstart="touchStart(item._id)"
          @touchend.prevent="judgeStatus(item._id, $event)"
        >
          <van-grid-item
            :icon="/^el-icon-.*/.test(item.iconClass) ? 'fail' : item.iconClass"
            style="pointer-events: none"
            :text="item.name"
            :class="[item._id === nowIconId ? 'editor' : '']"
          />
          <van-icon
            v-if="/^el-icon-.*/.test(item.iconClass)"
            class="button iconfont"
            :class="[item.iconClass, item._id === nowIconId ? 'editor' : '']"
          ></van-icon>
          <van-icon
            name="edit"
            size="18"
            class="editIcon"
            v-show="typeEditId === item._id"
          />
          <van-icon
            name="cross"
            size="18"
            class="delIcon"
            v-show="typeEditId === item._id"
          />
        </div>
      </template>
    </van-grid>
  </lazy-component>
</template>
<script lang="ts">
import { ref, computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { handlerLongPress } from "@/mixins/event";
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
    const typeEditId = ref(""); //修改类型id
    const shapeId = ref(""); //动画修改类型id

    let scrollFlag = false;
    let scrollTime: any = null;
    //滚动时不触发点击
    const handlScroll = () => {
      scrollFlag = true;
      if (scrollTime) {
        clearTimeout(scrollTime);
        scrollTime = null;
      }
      scrollTime = setTimeout(() => {
        clearTimeout(scrollTime);
        scrollTime = null;
        scrollFlag = false;
      }, 500);
    };
    const { touchStart, touchEnd } = handlerLongPress();

    const judgeFuncMap = new Map([
      [
        "click",
        (_id: string) => {
          typeEditId.value = "";
          emit("type-click", _id);
        },
      ],
      [
        "delIcon",
        (id: string) => {
          typeEditId.value = "";
          emit("type-del", id);
        },
      ],
      [
        "editIcon",
        (id: string) => {
          typeEditId.value = "";
          const list = props.list.filter((item: any) => item._id === id);
          emit("type-edit", list?.length ? list[0] : {});
        },
      ],
      [
        "longPress",
        (id: string) => {
          shapeId.value = id;
          typeEditId.value = id;
          let timer = setTimeout(() => {
            clearTimeout(timer);
            shapeId.value = "";
          }, 1000);
        },
      ],
    ]);
    const judgeStatus = (id: string, ev: TouchEvent) => {
      const status = touchEnd(id, ev);
      if (scrollFlag) {
        ev.preventDefault();
        return false;
      }
      judgeFuncMap.get(status) && (judgeFuncMap as any).get(status)(id);
    };

    const nowIconId = computed(() => store.state.nowIconId); //编辑type id
    return {
      touchStart,
      judgeStatus,
      handlScroll,
      shapeId,
      typeEditId,
      nowIconId,
    };
  },
});
</script>
<style lang="less" scoped>
@keyframes shake-slow {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(+2px, 0, 0);
  }

  30%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(+4px, 0, 0);
  }

  50% {
    transform: translate3d(-4px, 0, 0);
  }
}

.editor {
  /deep/ .van-grid-item__content {
    background-color: rgb(225, 225, 225, 0.5);
  }
}
/deep/ [class*="van-hairline"]:after {
  border: none;
}
.grid {
  max-height: 90vh;
  max-height: calc(var(--vh) * 90 - 10px);
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(auto-fill, 2rem);
  align-items: center;
  justify-items: center;
}
.item {
  position: relative;
  height: 90px;
  width: 90px;
  user-select: none;
}
.item.shape {
  animation: shake-slow 1s infinite ease-in-out;
}
.delIcon {
  color: red;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;
}
.editIcon {
  position: absolute;
  left: 0;
  top: 0;
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

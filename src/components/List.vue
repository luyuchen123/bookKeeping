<template>
  <form action="/">
    <van-search
      v-model="searchValue"
      show-action
      placeholder="请输入搜索关键词"
      @search="onRefresh"
      @cancel="onRefresh"
    />
  </form>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <template v-for="(item, key) in list" :key="key">
        <div class="item" v-if="item.REList && item.REList.length">
          <div class="item-header">
            <div class="time">{{ format(item._id) }}</div>
            <div class="value">
              <p>{{ `收入: ${item.income.toFixed(2)}` }}</p>
              <p>{{ `支出: ${item.pay.toFixed(2)}` }}</p>
            </div>
          </div>
          <div class="item-list">
            <template v-for="(re, index) in item.REList" :key="index">
              <van-swipe-cell>
                <div class="item-list-show">
                  <lazy-component>
                    <van-icon
                      v-if="/^el-icon-.*/.test(re.icon.iconClass)"
                      class="iconfont"
                      :class="re.icon.iconClass"
                      size="24"
                      style="transform: translateY(-4px)"
                      @click="changeType(re)"
                    ></van-icon>
                    <van-image
                      v-else
                      :src="getTypeIcon(re.icon.iconClass)"
                      round
                      @click="changeType(re)"
                    />
                  </lazy-component>

                  <div
                    class="remakrs"
                    @click="changeNumAndRemark(re, item._id)"
                  >
                    {{
                      re.icon.name && re.remarks
                        ? `${re.icon.name} (${re.remarks})`
                        : re.remarks || re.icon.name
                    }}
                  </div>
                  <div
                    class="amount"
                    :class="
                      (re._type === 0 ? -1 : 1) * re.amount >= 0
                        ? 'red'
                        : 'green'
                    "
                    @click="changeNumAndRemark(re, item._id)"
                  >
                    {{ (re._type === 0 ? -1 : 1) * re.amount }}
                  </div>
                </div>
                <template #right>
                  <van-button
                    class="button"
                    square
                    type="primary"
                    color="red"
                    @click="handleDel(re._id)"
                    >删除</van-button
                  >
                </template>
              </van-swipe-cell>

              <!-- <transition name="fade"> -->

              <!-- </transition> -->
            </template>
          </div>
        </div>
      </template>
    </van-list>
  </van-pull-refresh>
  <van-popup
    v-model:show="popShow"
    round
    position="bottom"
    :style="{ height: '7rem' }"
  >
    <cal
      v-if="popShow"
      :editParams="editParams"
      @add-bookkeeping="ajaxEditBookKeepingItem"
    />
  </van-popup>
</template>
<script lang="ts">
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRaw,
} from "vue";
import cal from "@/components/myCal.vue";
import moment from "moment";
import eventBus from "@/util/eventBus";
import { useStore } from "vuex";
import router from "@/router";
import service from "@/service/bookKeeping";
import getImage from "@/mixins/getImage";
import { Dialog } from "vant";
export default defineComponent({
  components: { cal },
  props: {
    getList: {
      type: Function,
      default: () => {
        return Promise.resolve();
      },
    },
    pageSize: {
      type: Number,
      default: 20,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const finished = ref(false);
    const refreshing = ref(false);
    const list = ref<IList[]>([]);
    let pageIndex = 0;
    //下拉刷新
    const onRefresh = () => {
      pageIndex = 0;
      refreshing.value = true;
      list.value = [];
      onLoad();
    };
    //加载事件 滑动超过自动加载
    const onLoad = async () => {
      loading.value = true;
      refreshing.value = false;
      try {
        const res = await props.getList(
          pageIndex++,
          props.pageSize,
          searchValue.value
        );
        list.value = [...list.value, ...(res?.list ?? [])];
        loading.value = false;
        finished.value = !!res?.finished;
        store.commit("setCount", {
          income: res.income,
          pay: res.pay,
        });
      } catch (error) {}
    };
    //格式化日期
    const format = (date?: string): string => {
      return moment(date).locale("zh-cn").format("M月D日 dddd");
    };
    //监听时间变化
    onMounted(() => {
      eventBus.on("time-change", onRefresh);
    });
    onBeforeUnmount(() => {
      eventBus.off("time-change", onRefresh);
    });

    //点击图标切换类型
    const changeType = (query: IreList) => {
      router.push({
        path: "/add",
        query: { type: query.type, _id: query._id, iconId: query.iconId },
      });
    };

    //点击备注或金额编辑
    const popShow = ref(false);
    const editParams = reactive({
      remarks: "",
      amount: 0,
      timestap: new Date(),
    });
    const resetEditParams = () => {
      editParams.remarks = "";
      editParams.amount = 0;
      editParams.timestap = new Date();
    };
    const changeNumAndRemark = (item: IreList, time: string) => {
      popShow.value = true;
      store.commit("setEditorItemId", { id: item._id });
      editParams.remarks = item.remarks;
      editParams.amount = item.amount;
      editParams.timestap = new Date(time);
    };
    const ajaxEditBookKeepingItem = (args: Ical) => {
      service.editItem(
        {
          _id: store.state.nowItemId,
          ...args,
        },
        () => {
          popShow.value = false;
          resetEditParams();
          onRefresh();
          store.commit("setEditorItemId", { id: "" });
          // router.push("/");
        }
      );
    };

    const handleDel = (id: string) => {
      Dialog.confirm({
        title: "是否删除?",
      })
        .then(() => {
          service.deleteItem(id, (err) => {
            if (!err) {
              onRefresh();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    };

    const searchValue = ref(""); //搜索相关
    return {
      list,
      loading,
      finished,
      refreshing,
      popShow,
      editParams,
      searchValue,
      getTypeIcon: getImage().getTypeIcon,
      format,
      handleDel,
      onRefresh,
      onLoad,
      changeType,
      changeNumAndRemark,
      ajaxEditBookKeepingItem,
    };
  },
});
</script>
<style lang="less" scoped>
.item {
  &-header {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1rem;
    grid-column: 10px;
    border-bottom: 1px solid #ccc;
    .time {
      padding-left: 5px;
      text-align: left;
      line-height: 1rem;
      font-size: 15px;
      color: rgba(217, 219, 213, 0.903);
    }
    .value {
      display: grid;
      grid-template-columns: repeat(2, 50%);
      justify-content: right;
      align-items: center;
      p {
        font-size: 18px;
      }
    }
  }
  &-list {
    /deep/ .van-cell__left-icon {
      font-size: 24px;
    }
    /deep/ .van-swipe-cell__right {
      top: -24px;
    }
    &-show {
      padding: 0px 5px;
      display: grid;
      grid-template-columns: 50px 1fr 1fr;
      grid-template-rows: 40px;
      grid-column-gap: 5px;
      align-items: center;
      // justify-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // /deep/ .van-swipe-cell {
      //   width: 100vw;
      // }
      /deep/ .van-image {
        height: 32px;
        width: 32px;
      }
      /deep/ .van-button {
        height: 40px;
      }
      .remakrs {
        font-size: 14px;
        color: rgba(24, 24, 24, 0.547);
        text-align: left;
      }
      .amount {
        font-size: 18px;
        color: rgba(24, 24, 24, 0.547);
        text-align: right;
      }
      .amount.red {
        color: rgb(205, 61, 61);
      }
      .amount.green {
        color: rgba(69, 245, 0, 0.982);
      }
      .button {
        // transition: opacity 0.5s;
      }
    }
    &-show.hasDel {
      grid-template-columns: 50px 1fr 1fr 50px;
    }
  }
}
// .fade-enter-from,
// .fade-leave-t0 {
//   opacity: 0;
// }

// .fade-enter-to,
// .fade-leave-from {
//   opacity: 1;
// }

// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 1s;
// }
</style>

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
      <div class="item" v-for="(item, key) in list" :key="key">
        <div
          class="item-header"
          :class="!item.stockCount || !item.profitCount ? 'thirdPart' : ''"
        >
          <lazy-component>
            <van-icon
              v-if="/^el-icon-.*/.test(item.stockItemIconClass)"
              class="iconfont"
              :class="item.stockItemIconClass"
              size="24"
              style="transform: translateY(-4px)"
            ></van-icon>
            <van-image round :src="item.stockItemIconClass" v-else />
          </lazy-component>
          <p class="name">{{ item.stockItemName }}</p>
          <div class="value" v-show="item.stockCount">
            <van-icon class-prefix="iconfont el-icon-book_qian" />
            <p>{{ item.stockCount }}</p>
          </div>
          <div
            class="value"
            v-show="item.profitCount"
            :class="item.profitCount > 0 ? 'red' : 'green'"
          >
            <p>{{ `盈利: ${item.profitCount}` }}</p>
            <van-icon
              class-prefix="iconfont el-icon-book_shangjiantou"
              v-if="item.profitCount > 0"
            />
            <van-icon
              class-prefix="iconfont el-icon-book_xiangxiajiantou"
              v-else
            />
          </div>
        </div>
        <div class="item-list">
          <template
            :class="{ isSell: re.sellPrice }"
            v-for="(re, index) in item.stockItems"
            :_id="re._id"
            :key="`stock_${index}`"
          >
            <swieCell
              :re="re"
              @editStock="editStock"
              @editStockItem="editStockItem"
              @deleteStock="deleteStock"
            />
          </template>

          <van-collapse
            v-model="item.showFLag"
            v-show="item.historyItems.length"
          >
            <van-collapse-item
              :title="`历史库存记录(${item.stockItemName})`"
              name="1"
            >
              <template
                :class="{ isSell: re.sellPrice }"
                v-for="(re, index) in item.historyItems"
                :_id="re._id"
                :key="`stock_${index}`"
              >
                <swieCell
                  :re="re"
                  @editStock="editStock"
                  @editStockItem="editStockItem"
                  @deleteStock="deleteStock"
                />
              </template>
            </van-collapse-item>
          </van-collapse>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
  <van-popup
    v-model:show="popShow"
    round
    position="bottom"
    :style="{ height: popShowType === 2 ? '9rem' : '7rem' }"
  >
    <warehousing
      v-if="popShow"
      :isExwarehouse="popShowType"
      :editParams="editParams"
      @wareHousing="ajaxWareHousing"
    />
  </van-popup>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import warehousing from "@/components/warehousing.vue";
import swieCell from "@/components/swipeCell.vue";
import { useStore } from "vuex";
import service from "@/service/stock";
import getImage from "@/mixins/getImage";
import { Dialog } from "vant";
export default defineComponent({
  components: { warehousing, swieCell },
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
    const searchValue = ref("");
    let pageIndex = 0;
    const getList = (pageIndex: number, pageSize: number) => {
      return new Promise((resolve) => {
        const callback: ICallBack = (errStatus, res) => {
          if (!errStatus) {
            if (Array.isArray(res?.stockResponse.list)) {
              const { getTypeIcon } = getImage();
              Promise.all(
                res.stockResponse.list.map(
                  (item: { stockItemIconClass: string }) =>
                    getTypeIcon(item.stockItemIconClass)
                )
              ).then((iconArr) => {
                iconArr.forEach((icon, index) => {
                  res.stockResponse.list[index].stockItemIconClass = icon;
                });
                return resolve(res?.stockResponse ?? {});
              });
            }
          } else {
            resolve({ finished: true });
          }
        };
        service.getList(
          { pageIndex, pageSize, searchValue: searchValue.value },
          callback
        );
      });
    };
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
        const res: any = await getList(pageIndex++, props.pageSize);
        list.value = [...list.value, ...(res?.list ?? [])];
        loading.value = false;
        finished.value = !!res?.finished;
        store.commit("setCount", {
          Inwarehouse: res.Inwarehouse,
          profit: res.profit,
        });
      } catch (error) {}
    };

    const popShow = ref(false);
    watch(
      () => popShow.value,
      (val) => {
        !val && store.commit("setEditorItemId", { id: "" });
      }
    );
    const popShowType = ref(0); //0编辑库存 1出库
    const editParams = reactive({
      buyingPrice: 0,
      sellPrice: 0,
      num: 0,
      timestap: "",
      remarks: "",
      sellTimestap: "",
    });
    //编辑库存信息
    const editStock = (item: IStockEditDetail) => {
      editParams.buyingPrice = item.buyingPrice || 0;
      editParams.remarks = item.remarks || "";
      editParams.num = item._stockNum;
      editParams.timestap = item.timestap;
      popShow.value = true;
      popShowType.value = 0;
      store.commit("setEditorItemId", { id: item._id });
    };
    //出库或编辑出库的信息
    const editStockItem = ([item, type]: [any, 1 | 2]) => {
      store.commit("setEditorItemId", { id: item._id });
      popShow.value = true;
      popShowType.value = type; //1 ==> 出库   2===> 编辑
      if (type === 2) {
        editParams.buyingPrice = item.buyingPrice || 0;
        editParams.remarks = item.remarks || "";
        editParams.num = item._stockNum;
        editParams.timestap = item.timestap;
        editParams.sellPrice = item.sellPrice || 0;
        editParams.sellTimestap = item.sellTimestap || "";
      }
    };
    const ajaxWareHousing = (args: IStockDetail) => {
      service.editItem(
        {
          _id: store.state.nowItemId,
          ...args,
        },
        () => {
          popShow.value = false;
          onRefresh();
          store.commit("setEditorItemId", { id: "" });
          // router.push("/");
        }
      );
    };

    const deleteStock = (id: string) => {
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

    return {
      list,
      loading,
      finished,
      refreshing,
      popShow,
      popShowType,
      editParams,
      searchValue,
      deleteStock,
      onRefresh,
      onLoad,
      editStock,
      ajaxWareHousing,
      editStockItem,
    };
  },
});
</script>
<style lang="less" scoped>
@defaultColor: rgb(214, 206, 206);
@red: rgba(239, 67, 55, 0.784);
@green: rgba(19, 142, 0, 0.784);
.item {
  &-header {
    display: grid;
    grid-template-columns: 40px repeat(3, 1fr);
    grid-template-rows: 40px;
    border-bottom: 1px solid #ccc;
    align-items: center;
    justify-items: center;
    background-image: linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%);
    /deep/ .van-image {
      height: 32px;
      width: 32px;
    }
    .name {
      text-align: center;
      font-size: 24px;
      color: rgba(64, 64, 62, 0.903);
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 5px;
      p {
        margin-left: 5px !important;
        font-size: 18px;
      }
    }
    .value.red {
      color: @red;
    }
    .value.green {
      color: @green;
    }
  }
  &-header.thirdPart {
    grid-template-columns: 40px repeat(2, 1fr);
  }
  /deep/ .van-swipe-cell__right {
    display: flex;
    align-items: center;
  }
}
</style>

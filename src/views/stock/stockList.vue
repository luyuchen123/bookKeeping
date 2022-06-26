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
            :key="index"
          >
            <van-swipe-cell>
              <div class="item-list-show">
                <div
                  class="icon"
                  :style="
                    !re.sellPrice
                      ? ''
                      : re.sellPrice - re.buyingPrice > 0
                      ? 'background: red'
                      : 'background: green'
                  "
                ></div>
                <!-- <div class="line" v-if="index !== item.stockItems.length - 1"></div> -->
                <div class="buy">
                  买入:
                  <span @click="editStock(re)" v-show="!re.sellPrice">{{
                    re.buyingPrice
                  }}</span>
                  <span v-show="re.sellPrice" class="disEdit">{{
                    re.buyingPrice
                  }}</span>
                </div>
                <div class="sell">
                  <div class="sellPrive" v-if="re.sellPrice">
                    {{ `卖出: ${re.sellPrice}` }}
                  </div>
                  <div class="num" v-else>
                    <p>库存:</p>
                    <van-icon
                      class-prefix="iconfont el-icon-book_kucun"
                      :badge="re._stockNum"
                      @click="editStock(re)"
                    />
                  </div>
                </div>
                <div
                  class="detail"
                  :class="[
                    re.remarks ? '' : 'noRemarks',
                    re.sellPrice ? 'isSell' : '',
                  ]"
                >
                  <div class="time">
                    {{ !re.sellPrice ? re.timestap : `数量：${re._stockNum}` }}
                  </div>
                  <div class="remarks" :title="re.remarks">
                    {{ re.remarks }}
                  </div>
                  <van-icon
                    class="button iconfont"
                    :class="
                      !re.sellPrice
                        ? 'el-icon-book_cangpeitubiao_chukuhuanhuochuku'
                        : 'el-icon-book_shezhi'
                    "
                    plain
                    hairline
                    @click="editStockItem(re, !re.sellPrice ? 1 : 2)"
                    >{{ !re.sellPrice ? "出库" : "编辑" }}</van-icon
                  >
                </div>
              </div>
              <template #right>
                <van-button
                  class="delBtn"
                  type="danger"
                  @click="deleteStock(re._id)"
                  >删除</van-button
                >
              </template>
            </van-swipe-cell>
          </template>
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
import { useStore } from "vuex";
import service from "@/service/stock";
import getImage from "@/mixins/getImage";
import { Dialog } from "vant";
export default defineComponent({
  components: { warehousing },
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
    const editStockItem = (item: any, type: number) => {
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
    top: -10px;
  }
  &-list-show {
    position: relative;
    display: grid;
    grid-template-columns: 10px repeat(2, 1fr) 45%;
    grid-column-gap: 5px;
    align-items: center;
    // justify-items: flex-start;
    height: 36px;
    padding: 10px;
    margin: 10px 0;
    font-size: 18px;
    .icon {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: @defaultColor;
    }
    .line {
      position: absolute;
      height: 100%;
      border-left: 1px solid @defaultColor;
      top: 50%;
      left: 15px;
      transform: translateY(5px);
    }
    .buy {
      text-align: left;
      span {
        color: rgb(35, 163, 209);
        font-style: oblique;
        text-decoration: underline;
      }
      .disEdit {
        color: #000;
        text-decoration: none;
      }
    }
    .sell {
      .num {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .detail {
      display: grid;
      grid-template-columns: 1fr 50px;
      grid-template-rows: 18px 18px;
      align-items: center;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      font-size: 16px;
      color: rgb(193, 190, 190);
      .time {
        font-style: oblique;
      }
      .remarks {
        grid-row-start: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .button {
        color: #23a3d1;
        grid-column-start: 2;
        grid-row-start: 1;
        transform: translateY(50%);
      }
    }
    .detail.noRemarks {
      grid-template-rows: 100%;
      .button {
        transform: translateY(0);
      }
    }
    .detail.isSell {
      // grid-template-columns: 100%;
    }
    .delBtn {
      display: none;
    }
  }

  &-list-show.isSell {
    grid-template-columns: 10px repeat(3, 1fr);
  }
  &-list-show.hasDel {
    .detail {
      display: none;
    }
    .delBtn {
      height: 36px;
      display: inline-block;
    }
  }
}
</style>

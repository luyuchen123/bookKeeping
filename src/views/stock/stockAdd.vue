<template>
  <van-search v-model="searchVal" placeholder="请输入搜索关键词" />
  <typeList
    :list="typeList"
    @type-click="typeClick"
    @type-del="deleteIconType($event, typeCallBack)"
    @type-edit="editClick"
  ></typeList>
  <van-dialog
    v-model:show="overLayShow"
    show-cancel-button
    class="dialog"
    @confirm="handlerAdd"
    @cancel="overLayShow = false"
  >
    <basic-form ref="formRef" :edit-params="editIconObj"></basic-form>
  </van-dialog>
  <van-popup
    v-model:show="show"
    round
    position="bottom"
    :style="{ height: '7rem' }"
  >
    <warehousing v-if="show" @wareHousing="ajaxWareHousing" />
  </van-popup>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import typeList from "@/components/typeList.vue";
import warehousing from "@/components/warehousing.vue";
import service from "@/service/bookKeeping";
import stockService from "@/service/stock";
import BasicForm from "@/components/basicForm.vue";
import { useStore } from "vuex";
import getImage from "@/mixins/getImage";
import { Dialog, Notify } from "vant";
import router from "@/router";
import typeOpt from "@/mixins/type";
export default defineComponent({
  components: {
    typeList,
    warehousing,
    BasicForm,
  },
  setup() {
    const store = useStore();
    const searchVal = ref("");
    const emptyTypeItem: ItypeList = {
      _id: "-1",
      iconClass: "plus",
      name: "点击添加",
    };
    //类别列表
    const typeList = ref<ItypeList[]>([]);
    //协议返回类别列表
    const getTypeList = (val: string = "") => {
      const callback: ICallBack = (
        errStatus,
        res: { typeResponse: { list: ItypeList[] } }
      ) => {
        if (!errStatus) {
          typeList.value = res?.typeResponse?.list ?? [];

          typeList.value.forEach((item) => {
            item.iconClass = getImage().getTypeIcon(item.iconClass);
          });

          typeList.value.unshift(emptyTypeItem);
          formRef.value?.clear();
        } else {
          typeList.value.push(emptyTypeItem);
        }
      };
      service.getTypeList({ search: val, type: store.state.nowType }, callback);
    };
    watch(
      () => store.state.nowType,
      () => {
        searchVal.value = "";
        getTypeList();
      }
    );
    onMounted(() => {
      getTypeList();
    });
    let timer: any = null; //节流
    watch(
      () => searchVal.value,
      (val) => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
          timer = setTimeout(() => {
            getTypeList(val);
          }, 500);
        } else {
          timer = setTimeout(() => {
            getTypeList(val);
          }, 500);
        }
      }
    );

    const nowClickId = ref<string>("");
    const typeClick = (_id: string) => {
      //增加类别
      if (_id === "-1") {
        overLayShow.value = true;
        return;
      }
      //编辑状态 相当于切换类别
      if (store.state.nowItemId) {
        Dialog.confirm({
          title: "是否修改类别?",
        })
          .then(() => {
            service.editItem(
              {
                _bookkeepingType: _id,
                _id: store.state.nowItemId,
              },
              () => {
                store.commit("setEditorItemId", { id: "" });
                router.push("/");
              }
            );
            // on confirm
          })
          .catch(() => {
            // on cancel
          });
        return;
      }
      nowClickId.value = _id;
      store.commit("setEditorIconId", { class: _id });
      show.value = true;
    };

    //编辑类别
    const editIconObj = ref();
    const editClick = (params: Iicon) => {
      editIconObj.value = params;
      overLayShow.value = true;
    };

    //删除类别
    const { deleteIconType } = typeOpt;
    const typeCallBack = (errStatus: boolean) => {
      if (!errStatus) {
        Notify({ type: "success", message: "删除成功" });
        getTypeList();
      }
    };

    //增添类别的显示
    const overLayShow = ref<boolean>(false);
    const formRef = ref();
    const handlerAdd = async () => {
      const { valid, data } = await formRef.value.onSubmit();
      if (valid) {
        if (editIconObj.value._id) {
          const callback: ICallBack = (errStatus) => {
            !errStatus && Notify({ type: "success", message: "修改类别成功" });
            editIconObj.value = {};
            overLayShow.value = false;
            getTypeList();
          };
          service.editType(data, callback);
          return;
        }
        const callback: ICallBack = (errStatus) => {
          !errStatus && Notify({ type: "success", message: "新增类别成功" });
          overLayShow.value = false;
          getTypeList();
        };
        service.addType(data, callback);
        return;
      }
      overLayShow.value = true;
    };
    //添加popover显示
    const show = ref(false);
    watch(
      () => show.value,
      (val) => {
        !val && store.commit("setEditorIconId", { id: "" });
      }
    );
    const ajaxWareHousing = (args: IStockDetail) => {
      const params: IStockItem = {
        _id: "",
        _stockType: nowClickId.value,
        ...args,
      };
      const callback = (errStatus: boolean, res: any) => {
        if (!errStatus) {
          show.value = false;
          store.commit("setEditorIconId", { class: "" }); //当前编辑的置位空
          Notify({ type: "success", message: "新增库存成功" });
        }
      };
      stockService.addItem(params, callback);
    };
    return {
      show,
      overLayShow,
      searchVal,
      typeList,
      formRef,
      editIconObj,
      editClick,
      deleteIconType,
      typeCallBack,
      handlerAdd,
      typeClick,
      ajaxWareHousing,
    };
  },
});
</script>
<style lang="less" scoped></style>

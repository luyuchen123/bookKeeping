<template>
  <div class="form">
    <van-form ref="form">
      <van-cell-group inset>
        <van-field
          v-model="name"
          name="类别名称"
          label="类别名称"
          placeholder="类别名称"
          :rules="[{ required: true, message: '请填写类别名称' }]"
        />
        <van-field name="uploader" label="上传图标">
          <template #input>
            <van-uploader v-model="fileList" :max-count="1" />
            <!-- :after-read="afterRead" -->
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  props: ["editParams"],
  setup(props) {
    const store = useStore();
    const form = ref();
    const name = ref("");
    const fileList = ref([]);
    const onSubmit = () => {
      return new Promise((resolve) => {
        if (form.value?.validate() && fileList.value.length) {
          const file: any = fileList.value[0];
          const formdata = new FormData();
          file.file && formdata.append("file", file.file, file.file.name);
          props?.editParams?._id &&
            formdata.append("iconId", props.editParams._id); //编辑字段
          formdata.append("name", name.value);
          formdata.append("type", store.state.nowType);
          return resolve({
            valid: true,
            data: formdata,
          });
        }
        resolve({
          valid: false,
        });
      });
    };

    const clear = () => {
      name.value = "";
      fileList.value = [];
    };

    watch(
      () => props.editParams,
      (val: Iicon) => {
        console.log(val);
        if (val?._id) {
          name.value = val.name;
          (fileList.value as any) = [{ url: val.iconClass, isImage: true }];
        } else {
          clear();
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );
    return {
      form,
      name,
      fileList,
      onSubmit,
      clear,
    };
  },
});
</script>
<style lang="less" scoped>
.form {
  /deep/ .van-form {
    margin: 15px;
  }
}
</style>

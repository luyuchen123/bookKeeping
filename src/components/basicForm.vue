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
import { defineComponent, nextTick, ref } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  setup() {
    const store = useStore();
    const form = ref();
    const name = ref("");
    const fileList = ref([]);
    const onSubmit = () => {
      return new Promise((resolve) => {
        if (form.value?.validate() && fileList.value.length) {
          const file: any = fileList.value[0];
          console.log(file);
          const formdata = new FormData();
          formdata.append("file", file.file, file.file.name);
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
      console.warn("clear");
      name.value = "";
      fileList.value = [];
    };
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

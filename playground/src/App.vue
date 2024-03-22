<script setup lang="ts">
import { toBase64 } from 'lazy-js-utils'
import img from '../public/3.png'
import img2 from '../public/2.jpg'
const fontWeight = ref(3)

const fileEl = ref<HTMLInputElement>()
const uploadImage = ref('')

const loading = ref(false)
async function fileChange() {
  loading.value = true
  if (!fileEl.value)
    return

  const file = fileEl.value.files![0]
  const base64 = await toBase64(file)
  uploadImage.value = base64 as string
}
</script>

<template>
  <main font-sans p=" y-10" text="center gray-700 dark:gray-200">
    <dot-text text="Dot Image" color="grey" font-size="30" font-weight="10" ma m-y-10 />
    <DotImage :src="img" bg-color="transparent" :font-weight="fontWeight" w-20 />
    <DotImage direction="vertical" :src="img2" :onload="onload1" :font-weight="fontWeight" ma h-80 p-l-10 />
    <input ref="fileEl" type="file" hidden accept="image/*" @change="fileChange">
    <div>
      <button btn m-y-5 @click="fileEl.click()">
        上传图片
      </button>
      <DotImage :src="uploadImage" font-weight="10" ma />
    </div>
    <Footer />
  </main>
</template>

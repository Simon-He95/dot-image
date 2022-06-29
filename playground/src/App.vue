<script setup lang="ts">
import { randomRgb, toBase64 } from 'simon-js-tool'
import { DotImageCanvas } from '../../src/DotImageCanvas.ts'
import img from '../public/3.png'
import img1 from '../public/1.jpg'
const el = ref(null)
const fontWeight = ref(1)
const color = ref(randomRgb())
let start = null
function update(timestamp) {
  if (start === null)
    start = timestamp
  const progress = timestamp - start
  if (progress > 1000) {
    start = timestamp
    if (fontWeight.value > 9)
      fontWeight.value = 1
    else fontWeight.value++
    color.value = randomRgb()
  }
  requestAnimationFrame(update)
}
requestAnimationFrame(update)
const fileEl = ref(null)
const uploadImage = ref('')

const loading = ref(false)
async function fileChange() {
  loading.value = true
  const file = fileEl.value.files[0]
  const base64 = await toBase64(file, 'file')
  uploadImage.value = base64
}
function onload({ status }) {
  loading.value = false
}
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <vivid-typing content="Dot Image" text-3xl m-b-10 />
    <DotImage :src="img" :color="color" :font-weight="fontWeight" w-20 />
    <DotImage :src="img1" :font-weight="fontWeight" ma />
    <input ref="fileEl" type="file" hidden accept="image/*" @change="fileChange">
    <div>
      <button btn m-y-5 @click="fileEl.click()">
        上传图片
      </button>
      <div relative>
        <div v-if="loading" absolute top="50%" left="50%" translate="-50%" text-2xl z-99>
          Loading.......
        </div>
        <DotImage :src="uploadImage" :onload="onload" font-weight="10" ma />
      </div>
    </div>
    <Footer />
  </main>
</template>

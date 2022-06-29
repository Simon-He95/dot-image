<script setup lang="ts">
import { randomRgb } from 'simon-js-tool'
import { DotImageCanvas } from '../../src/DotImageCanvas.ts'
import img from '../public/3.png'
import img1 from '../public/1.jpg'
const el = ref(null)
const fontWeight = ref(1)
const color1 = ref(randomRgb())
const color2 = ref(randomRgb())
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
    color1.value = randomRgb()
    color2.value = randomRgb()
  }
  requestAnimationFrame(update)
}
requestAnimationFrame(update)
</script>

<template>
  <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <vivid-typing content="Dot Image" text-3xl m-b-10 />
    <DotImage :src="img" :color="color1" :font-weight="fontWeight" w-20 />
    <DotImage :src="img1" :color="color2" :font-weight="fontWeight" ma w-70 />
    <Footer />
  </main>
</template>

import type { DefineComponent } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { useRaf } from 'lazy-js-utils'
import { DotImageCanvas } from './DotImageCanvas'
import type { DotImageType } from './types'

export const DotImage = defineComponent({
  name: 'DotImage',
  props: {
    src: {
      type: String,
      required: true,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    fontWeight: {
      type: [Number, String],
      default: 5,
    },
    clear: {
      type: Function,
      default: () => { },
    },
    onload: {
      type: Function,
      default: () => { },
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
  },
  setup(props) {
    const dotImage = new DotImageCanvas(props.src, props.color, +props.fontWeight, props.bgColor)
    const dotImageEl = ref<HTMLElement>()
    onMounted(() => {
      update(dotImageEl.value!, dotImage.canvas!)
      const stop = useRaf(() => {
        if (dotImage.status === 'success') {
          stop()
          props.onload({ status: dotImage.status })
        }
      }, 100)
    })
    watch(props, async () => {
      const newDotImage = await dotImage.repaint(props.src, props.color, +props.fontWeight)
      update(dotImageEl.value!, newDotImage.canvas!)
      props.clear(newDotImage.clearCanvas.bind(newDotImage))
      const stop = useRaf(() => {
        if (dotImage.status === 'success') {
          stop()
          props?.onload({ status: dotImage.status })
        }
      }, 100)
    })
    props.clear(dotImage.clearCanvas.bind(dotImage))
    return () => h('div', { ref: dotImageEl })
  },
}) as DefineComponent<DotImageType>

function update(dotTextEl: HTMLElement, canvas: HTMLCanvasElement) {
  const attributes = dotTextEl.attributes
  Object.values(attributes).forEach((key) => {
    if (key.name === 'width' || key.name === 'height')
      return
    canvas.setAttribute(key.name, key.value)
  })
  const child = dotTextEl.childNodes[0]
  if (child)
    dotTextEl.replaceChild(canvas, child)
  else
    dotTextEl.appendChild(canvas)
}

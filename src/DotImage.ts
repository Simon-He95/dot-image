import type { DefineComponent, PropType } from 'vue'
import { defineComponent, h, onMounted, ref, watch } from 'vue'
import { useRaf } from 'lazy-js-utils'
import { DotImageCanvas } from './DotImageCanvas'
import type { Direction, DotImageType } from './types'

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
    onload: {
      type: Function,
      default: () => { },
    },
    bgColor: {
      type: String,
      default: '#fff',
    },
    direction: {
      type: String as PropType<Direction>,
      default: 'horizontal',
    },
  },
  setup(props) {
    const dotImage = new DotImageCanvas(props.src, props.color, +props.fontWeight, props.bgColor, props.direction)
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
      const stop = useRaf(() => {
        if (dotImage.status === 'success') {
          stop()
          props?.onload({ status: dotImage.status })
        }
      }, 100)
    })
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

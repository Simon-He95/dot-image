## Dot Image
[live demo](https://dot-image.netlify.app)
可以从本地上传图片,查看效果

## 介绍
将一个图片转换为点图

## 安装
```bash
npm i dot-image
```

## Props
- src 图片地址
- color 图片颜色 默认原始图片的像素颜色
- fontWeight 像素大小
- direction 控制绘制的方向 默认为纵向

## 使用说明
- main.ts

```js
import { DotImage } from 'dot-image'
app.component('DotImage', DotImage)
```

- vue script
```js
import img from '../public/3.png'
```
- vue template
```html
<DotImage :src="img" color="red" font-weight="5" w-20 ma ></DotImage>
```

- JS
```js
const dotImage1 = new DotImageCanvas(kb, '', 3, 'transparent')
dotImage1.append('.dotImage')
```
- html
```html
<span class="dotImage" />
```

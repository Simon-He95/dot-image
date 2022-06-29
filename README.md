## Dot Image
[live demo](http://dot-image.hejian.club/)

## 介绍
将一个图片转换为点图

## 安装
```bash
npm i dot-image
```

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

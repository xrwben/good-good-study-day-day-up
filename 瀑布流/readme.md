### 瀑布流Waterfall

#### 情形

1、图片定宽高 + 文本高度不定

2、图片宽高已知 + 文本高度不定

3、图片宽高已知 + 文本高度固定（最简单）

4、图片高度未知 + 文本高度固定

5、图片高度未知 + 文本高度不定（最复杂）


#### 数据来源

```js
// 文本 https://api.shadiao.pro/chp
const getRandomTxt = async () => {
	const response = await fetch('https://api.shadiao.pro/chp')
	const result = await response.json()
	// console.log(result)
	return result.data.text
}

// 图片 https://picsum.photos/
const getRandomImage = async () => {
	const response = await fetch(`https://picsum.photos/v2/list?page=${pageSize.value}&limit=10`);
	const result = await response.json()
	return result
}
```
## 更新日志

**2020-4-26**：为避免疏忽，将原本放在`App.vue`的`$rpxToPxFactor`调整到组件内部，并更名为`rpxToPxFactor  `，内部将会调用一次`uni.getSystemInfo`。

## 简介

宫格菜单导航，实现：

1. n行n列
2. 带指示条横行滚动
3. 图标自定义尺寸
4. 文本颜色设置
5. 灵活设置数据的key

## 适用端

**适用于`js`项目**

|端|支持|
|---|---|
|Web|√|
|微信小程序|√|

## 依赖

因涉及到计算，依赖于`numeral.js`，直接安装：

```bash
npm i -S-d numeral
```

## rpx和px的比例

这是一个保证准确的前置条件，按照小程序文档的指示：

|设备|rpx换算px (屏幕宽度/750)|px换算rpx (750/屏幕宽度)|
|---|---|---|
|iPhone5|1rpx = 0.42px|1px = 2.34rpx|
|iPhone6|1rpx = 0.5px|1px = 2rpx|
|iPhone6 Plus|1rpx = 0.552px|1px = 1.81rpx|

已更新像素比例设置位置，查看顶部到[更新日志](##更新日)。

**注意**：如果不设置，默认会直接取iphone,也就是0.5

## 调用

```html
<ju-navigator-grid element-id="navigatorMenu" :list="menu"/>
```

## 属性

|属性|类型|必填|默认|可选|说明|
|:---:|:---:|:---:|:---:|---|---|
|element-id|String|√|navigatorMenu|-|菜单的id，用于设置内部元素当绝对宽高，建议一个页面多个菜单时必填且唯一|
|list|Array|√|[]|-|菜单列表|
|show-name|Boolean|-|true|-|是否显示菜单名称|
|name-field-name|String|-|title|-|显示菜单名称的key|
|base-icon-font|String|-|-|-|字体图标的前置class，对应自己的字体图标库，如果存在不现实图片|
|icon-field-name|String|-|icon|-|图标的key，对应自己的字体图标库|
|url-field-name|String|-|url|-|跳转链接的key|
|color|String|-|#666|-|文本颜色，如果有字体图标会一起设置|
|row-count|String\|Number|-|2|-|总行数|
|col-count|String\|Number|-|4|-|总列数|
|size|String|-|60rpx|-|图标宽高，如果是字体图标，设置为其`font-size`，推荐`rpx`单位|
|click-feedback|Boolean|-|true|-|点击反，点击时会有灰色背景指示|
|show-scroll-bar|Boolean|-|true|-|当出现横向滚动时，是否显示指示条|


## 结尾

之前需要这方面的导航，就制作了一个小组件，当前可能还存在不少问题，写的不是很好，请多包涵，如有优化方案，欢迎指教，跪谢。

**fixme**：目前已知地步的指示滚动条在web端没有小程序端流畅。


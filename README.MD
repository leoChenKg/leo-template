## leo-Template
<p >
  <a href="https://www.npmjs.com/package/leo-template"><img src="https://img.shields.io/npm/v/leo-template" /></a>
</p>
> 一个功能简单的模板引擎



## 使用

### 模板语法

`<%  %>` ：用来包裹 javascript 代码。

`<%= >`：用来解析表达式的值。

```html
<div>
	<% arr.forEach((item) => { %>
	<a href="<%= item.url%>" ><%= item.label %></a>
	<% }) %>
</div>
```

还在跟新更多语法中 ...



### `renderTemplate` 函数

此函数可以接受三个参数，参数一 `templatePath` 为模板的路径，参数二 `data` 为渲染模板时需要的数据，参数三 `options` 是配置选项。
参数一的路径是一个相对路径，他是相对于 `options.contentBase` ，这个值可以在这里单独指定，也可以不在这里指定去全局指定 :arrow_right: [configs](#anchor)。
这个函数返回一个 `promise` 。

```javascript
const { renderTemplate } = require('leo-template')
let arr1 = [ { label: "列表项1",  url: "/link1" } ]
let arr2 = [ { label: "列表项2",  url: "/link2" } ]


renderTemplate('./template.html', { arr1 }, { useCache: true })
    .then((temp) => {
        console.log(temp)
    })

renderTemplate('./template.html', { arr2 }, 
               {
    				useCache: true ,
    			  //contentBase:path.resolve(__dirname,"./src/template")
				}).then((temp) => {
        			console.log(temp)
    			})

```

`renderTemplate` 第一次与第二次调用的相继运行，第二次就会使用第一次的缓存。



### `compile` 函数

此函数可以接受三个参数。参数一为模板字符串 `templateStr`，参数二为模板渲染所需的数据 `data`，参数三为配置项。

该函数返回一个渲染函数 `render` 该函数有一个可选参数 `data` ， 为模板渲染的数据，该函数的返回值为以 `templateStr` 为模板的编译结果。这样可以重复使用，提高效率。 

```js
const { complie } = require('leo-template')

let render = complie("<a><%=data%></a>", { data: 234 }, { useCache: true })

console.log(render()) //<a>456</a>
```

在开启缓存后，这样相继调用也会缓存，根据传入的 `templateStr` 来做缓存（摘要）。

```js
console.log(complie("<a><%=data%></a>", { data: 234 })()) // 没有缓存可用
console.log(complie("<a><%=data%></a>", { data: 456 })()) // 使用第上一次的缓存

console.log(complie("<p><%=data%></p>", { data: 789 })()) // 没有缓存可用
console.log(complie("<p><%=data%></p>", { data: 123 })()) // 使用第上一次的缓存
```



### 全局配置

<span id="anchor"></span>

| 名称          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| `contentBase` | 统一放置模板的的目录，设置此项后续使用相关方法是时，传入相对于此的相对路径即可。**注意：如果全局和使用相关方法时都不配置此项，则会从项目开始查找名为 template 的目录作为模板存放根目录，如果没找到就会报错。** |
| `useCache`    | 是否开启缓存。 默认为 `false`                                |

```js
const path = require('path')
const leoTemp = require('leo-template')

leoTemp.setConfig({
    contentBase: path.resolve(__dirname, 'template'),
    useCache: false
})
```

配置的优先级 ：相关方法的配置项优先级 > 全局配置 。

```js
const { renderTemplate, complie } = require('./src')
const path = require('path')
const leoTemp = require('./src')

leoTemp.setConfig({
    contentBase: path.resolve(__dirname, 'template'),
    useCache: false
})

let arr = [{ label: "列表项1", url: "/link1" }]

// 单独配置项优先级高
renderTemplate('./template.html', { arr }, { useCache: true, contentBase: path.join(__dirname, '/src/template'), })
    .then((temp) => {
        console.log(temp)
    })

renderTemplate('./template.html', { arr }, { useCache: true })
    .then((temp) => {
        console.log(temp)
    })

console.log(complie("<div><%= data %></div>", { data: 123 }, { useCache: true })())
console.log(complie("<p><%= data %></p>", { data: 345 }, { useCache: true })())
```






















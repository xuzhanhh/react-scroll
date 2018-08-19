# two sets of scrollbar
1. (use scroll event) -- ScrollBarOrigin
2. (use wheel event & disabled scroll event) -- ScrollBar
## props

```
ScrollBar.propTypes = {
    /*
        是否渲染并使用水平滚动条 默认为true
    */
    horizontal: PropTypes.bool,
    /*
        是否渲染并使用垂直滚动条 默认为true
    */
    vertical: PropTypes.bool,
    /*
        传给scrollbar wrapper
    */
    className: PropTypes.string,
    /*
        传给scrollbar wrapper
    */
    style: PropTypes.object,
    /*
        试验功能 允许scrollbar内嵌套系统滚动条
    */
    allowNesting: PropTypes.bool
}
```

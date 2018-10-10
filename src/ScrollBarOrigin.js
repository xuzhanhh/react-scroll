import React, { Component } from 'react'
// import './ScrollBarOrigin.css'
// import './ScrollBar.css'
import cx from 'classnames'
import css from 'dom-css'
import PropTypes from 'prop-types'
import { getTransformString } from './utils'
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    function(fn) {
        return setTimeout(fn, 1000 / 60)
    }
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout

let ticking = false
export default class ScrollBar extends Component {
    constructor(props) {
        super(props)

        this.scroll = React.createRef()
        this.showArea = React.createRef()
        this.verticalSlider = React.createRef()
        this.verticalScrollBar = React.createRef()
        this.horizontalSlider = React.createRef()
        this.horizontalScrollBar = React.createRef()
        this.state = {
            mouseIn: false,
            showYslider: true,
            showXslider: true,
            mouseInYSlider: false,
            mouseInXSlider: false,
            clickScrollBar: false,
            horizontal:
                typeof props.horizontal === 'boolean' ? props.horizontal : true,
            // false,
            vertical:
                typeof props.vertical === 'boolean' ? props.vertical : true
        }
        this.innerSystemScrollElement = []
        this.innerDontSystemScrollElement = []
    }
    componentDidMount() {
        this._initCanvas()
        this._addListeners()
    }
    componentDidUpdate() {
        if (this.props.allowNesting) {
            this.innerSystemScrollElement = []
            this.innerDontSystemScrollElement = []
        }
        this._initCanvas()
    }

    _addListeners = () => {}

    // _reCalSliderHeight = () => {
    //     const {
    //         height: scrollHeight,
    //         width: scrollWidth
    //     } = this.scroll.current.getBoundingClientRect()
    //     const showAreaHeight = this.showArea.current.scrollHeight
    //     this.verticalScrollBar.current.style.height = scrollHeight + 'px'

    //     this.verticalSlider.current.style.height =
    //         scrollHeight * (scrollHeight / showAreaHeight) + 'px'
    // }

    _initCanvas = callback => {
        //存state
        const { mouseIn, horizontal, vertical } = this.state
        // const {
        //     height: scrollHeight,
        //     width: scrollWidth
        // } = this.scroll.current.getBoundingClientRect()

        const scrollHeight = this.scroll.current.offsetHeight
        const scrollWidth = this.scroll.current.offsetWidth
        const showAreaHeight = this.showArea.current.scrollHeight - 17

        const showAreaWidth = this.showArea.current.scrollWidth - 17
        if (showAreaHeight <= scrollHeight && this.state.showYslider) {
            this.setState(() => {
                return {
                    showYslider: false
                }
            })
            //重置transform
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            this.showArea.current.style.transform = `translate3d(${preX}px,${0}px, 0px)`
        } else if (showAreaHeight > scrollHeight && !this.state.showYslider) {
            this.setState(() => {
                return {
                    showYslider: true
                }
            })
        }
        if (showAreaWidth <= scrollWidth && this.state.showXslider) {
            this.setState(() => {
                return {
                    showXslider: false
                }
            })
            //重置transform

            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            this.showArea.current.style.transform = `translate3d(${0}px,${preY}px, 0px)`
        } else if (showAreaWidth > scrollWidth && !this.state.showXslider) {
            this.setState(() => {
                return {
                    showXslider: true
                }
            })
        } else {
            if (vertical && this.state.showYslider) {
                this.verticalScrollBar.current.style.height =
                    scrollHeight + 'px'
                this.verticalSlider.current.style.height =
                    scrollHeight * (scrollHeight / showAreaHeight) + 'px'
                this.sliderHeight =
                    scrollHeight -
                    scrollHeight * (scrollHeight / showAreaHeight)
                this.sliderScrollableHeight = scrollHeight - this.sliderHeight
                this.contentScrollableHeight = showAreaHeight - scrollHeight
                this.scaleY = this.contentScrollableHeight / this.sliderHeight
                this.scrollHeight = scrollHeight
                this.showAreaHeight = showAreaHeight
            }
            if (horizontal && this.state.showXslider) {
                this.horizontalScrollBar.current.style.width =
                    scrollWidth + 'px'
                this.horizontalSlider.current.style.width =
                    scrollWidth * (scrollWidth / showAreaWidth) + 'px'
                this.sliderWidth =
                    scrollWidth - scrollWidth * (scrollWidth / showAreaWidth)

                this.sliderScrollableWidth = scrollWidth - this.sliderWidth
                this.contentScrollableWidth = showAreaWidth - scrollWidth
                this.scaleX = this.contentScrollableWidth / this.sliderWidth
                this.scrollWidth = scrollWidth
                this.showAreaWidth = showAreaWidth
            }
        }
    }
    scrollTop = top => {
        const { showYslider } = this.state
        if (showYslider && top !== 0) {
            if (top < 0) {
                top = 0
            }
            if (top > this.showAreaHeight - this.scrollHeight) {
                top = this.showAreaHeight - this.scrollHeight
            }
            let contentHeigh = top
            this.showArea.current.scrollTop = contentHeigh

            this._changeElementTransform(
                this.verticalSlider,
                0,
                contentHeigh / this.scaleY
            )
        }
    }

    scrollLeft = left => {
        const { showXslider } = this.state
        if (showXslider && left !== 0) {
            if (left < 0) {
                left = 0
            } else if (left > this.showAreaWidth - this.scrollWidth) {
                left = this.showAreaWidth - this.scrollWidth
            }
            let contentWidth = left
            this.showArea.current.scrollLeft = contentWidth
            this._changeElementTransform(
                this.horizontalSlider,
                contentWidth / this.scaleX,
                0
            )
        }
    }

    render() {
        const {
            mouseIn,
            showYslider,
            showXslider,
            mouseInYSlider,
            mouseInXSlider,
            draggingX,
            draggingY,
            clickScrollBar,
            horizontal,
            vertical
        } = this.state
        const {
            height,
            width,
            style,
            className
            // horizontal,
            // vertical
        } = this.props
        let vs = cx({
            [`vertical-scroll`]: true,
            [`invisible`]: !mouseIn || !draggingY,
            [`visible`]: mouseIn && !draggingX,
            [`mousein`]: mouseInYSlider || draggingY,
            [`scrollbar__click`]: clickScrollBar
        })
        let ps = cx({
            [`horizontal-scroll`]: true,
            [`invisible`]: !mouseIn || !draggingX,
            [`visible`]: mouseIn && !draggingY,
            [`mousein`]: mouseInXSlider || draggingX,
            [`scrollbar__click`]: clickScrollBar
        })
        let innerClass = cx({
            [`inner__origin`]: true,
            [className]: className
        })
        let showAreaClass = cx({
            [`showArea`]: true,
            [`showArea__origin`]: true,
            [`scrollbar__click`]: clickScrollBar,
            [`showArea__disable--x`]: !horizontal,
            [`showArea__disable--y`]: !vertical
        })

        this.scroll.current && css(this.scroll.current, { height, width })
        return (
            <div
                style={style}
                className={innerClass}
                ref={this.scroll}
                onMouseEnter={() => {
                    this.setState({
                        mouseIn: true
                    })
                }}
                onMouseLeave={() => {
                    this.setState({
                        mouseIn: false
                    })
                }}
                // onWheel={this._controlScroll}
                onScroll={this._controlScrollOrigin}>
                <div className={showAreaClass} ref={this.showArea}>
                    {this.props.children}
                </div>
                {vertical &&
                    showYslider && (
                        <div
                            className={vs}
                            ref={this.verticalScrollBar}
                            onMouseEnter={() => {
                                this.setState({
                                    mouseInYSlider: true
                                })
                            }}
                            onMouseLeave={() => {
                                this.setState({
                                    mouseInYSlider: false
                                })
                            }}
                            onMouseDown={e =>
                                this._handleVerticalScrollBarMouseDown(e, this)
                            }>
                            <div
                                className="slider__vertical"
                                ref={this.verticalSlider}
                                onMouseDown={
                                    this._handleVerticalSliderMouseDown
                                }
                            />
                        </div>
                    )}
                {horizontal &&
                    showXslider && (
                        <div
                            className={ps}
                            ref={this.horizontalScrollBar}
                            onMouseEnter={() => {
                                this.setState({
                                    mouseInXSlider: true
                                })
                            }}
                            onMouseLeave={() => {
                                this.setState({
                                    mouseInXSlider: false
                                })
                            }}
                            onMouseDown={e =>
                                this._handleHorizontalScrollBarMouseDown(
                                    e,
                                    this
                                )
                            }>
                            <div
                                className="slider__horizontal"
                                ref={this.horizontalSlider}
                                onMouseDown={
                                    this._handleHorizontalSliderMouseDown
                                }
                            />
                        </div>
                    )}
            </div>
        )
    }

    _closeTransiton = () => {
        setTimeout(() => {
            this.setState({
                clickScrollBar: false
            })
        }, 200)
    }
    _handleHorizontalScrollBarMouseDown = (event, that) => {
        event.preventDefault()
        const { target, clientX } = event
        const {
            left: trackLeft
        } = this.horizontalScrollBar.current.getBoundingClientRect()
        this.setState(
            {
                clickScrollBar: true
            },
            () => {
                const sliderXWidth = this._getPixelFromTransform(
                    this.horizontalSlider
                )[0]
                const showAreaTransform = this._getPixelFromTransform(
                    this.showArea
                )
                const offset = clientX - trackLeft
                if (offset <= sliderXWidth) {
                    this._UpdateSlider(offset * this.scaleX, 'horizontal', that)
                } else {
                    this._UpdateSlider(
                        (offset -
                            parseFloat(
                                this.horizontalSlider.current.style.width
                            )) *
                            this.scaleX,
                        'horizontal',
                        that
                    )
                }
                this._closeTransiton()
            }
        )
    }

    _handleVerticalScrollBarMouseDown = (event, that) => {
        event.preventDefault()
        const { target, clientY } = event
        const {
            top: trackTop
        } = this.verticalScrollBar.current.getBoundingClientRect()
        this.setState(
            {
                clickScrollBar: true
            },
            () => {
                const sliderYHeight = this._getPixelFromTransform(
                    this.verticalSlider
                )[1]
                const showAreaTransform = this._getPixelFromTransform(
                    this.showArea
                )
                const offset = clientY - trackTop
                if (offset <= sliderYHeight) {
                    this._UpdateSlider(offset * this.scaleY, 'vertical', that)
                } else {
                    this._UpdateSlider(
                        (offset -
                            parseFloat(
                                this.verticalSlider.current.style.height
                            )) *
                            this.scaleY,
                        'vertical',
                        that
                    )
                }
                this._closeTransiton()
            }
        )
    }
    _UpdateSlider(target, position, that, origin) {
        let slider = null
        switch (position) {
            case 'vertical':
                slider = that.showArea.current.scrollTop
                break
            case 'horizontal':
                slider = that.showArea.current.scrollLeft
        }
        let current = slider
        let step =
            Math.abs((origin ? origin : current) - target) / 7 > 15
                ? Math.abs((origin ? origin : current) - target) / 7
                : 15
        if (Math.abs(current - target) > step) {
            that.globalID = window.requestAnimationFrame(() =>
                that._UpdateSlider(
                    target,
                    position,
                    that,
                    origin ? origin : current
                )
            )
            switch (position) {
                case 'vertical':
                    that.showArea.current.scrollTop =
                        current + (target > current ? step : -step)
                    break
                case 'horizontal':
                    that.showArea.current.scrollLeft =
                        current + (target > current ? step : -step)
                    break
            }
        } else {
            window.cancelAnimationFrame(that.globalID)
            // slider = target
            switch (position) {
                case 'vertical':
                    that.showArea.current.scrollTop = target
                    break
                case 'horizontal':
                    that.showArea.current.scrollLeft = target
                    break
            }
        }
    }

    _handleVerticalSliderMouseDown = event => {
        // this.draggingY = true
        this.setState({
            draggingY: true
        })
        event.preventDefault()
        event.stopPropagation()
        this._handleDragStart(event)
        const { target, clientY } = event
        const { offsetHeight } = target
        const { top } = target.getBoundingClientRect()
        this.prevPageY = offsetHeight - (clientY - top)
    }
    _handleHorizontalSliderMouseDown = event => {
        // this.draggingX = true;
        this.setState({
            draggingX: true
        })
        event.preventDefault()
        event.stopPropagation()
        this._handleDragStart(event)
        const { target, clientX } = event
        const { offsetWidth } = target
        const { left } = target.getBoundingClientRect()
        this.prevPageX = offsetWidth - (clientX - left)
    }

    _handleDragStart = event => {
        this._setupDragging()
    }
    _setupDragging = () => {
        css(document.body, {
            userSelect: 'none'
        })
        document.addEventListener('mousemove', this._handleDrag)
        document.addEventListener('mouseup', this._handleDragEnd)
        document.onselectstart = () => false
    }
    _teardownDragging = () => {
        css(document.body, {
            userSelect: ''
        })
        document.removeEventListener('mousemove', this._handleDrag)
        document.removeEventListener('mouseup', this._handleDragEnd)
        document.onselectstart = undefined
    }

    _handleDrag = event => {
        if (this.prevPageX) {
            const { clientX } = event
            const {
                left: trackLeft2
            } = this.horizontalScrollBar.current.getBoundingClientRect()

            const horizontalSliderTransformArr = this._getPixelFromTransform(
                this.horizontalSlider.current
            )
            const showAreaTransformArr = this._getPixelFromTransform(
                this.showArea
            )
            const trackLeft = horizontalSliderTransformArr[0]
            const sliderXWidth = parseFloat(
                this.horizontalSlider.current.style.width
            )
            const clickPosition = sliderXWidth - this.prevPageX
            const offset = -trackLeft + clientX - clickPosition - trackLeft2
            let horizontalSliderLeft = trackLeft
            if (
                horizontalSliderLeft + offset >= 0 &&
                sliderXWidth + horizontalSliderLeft + offset < this.scrollWidth
            ) {
                this._changeElementTransform(
                    this.horizontalSlider,
                    horizontalSliderLeft + offset,
                    0
                )

                this.showArea.current.scrollLeft =
                    horizontalSliderLeft * this.scaleX
            }
            if (horizontalSliderLeft + offset < 0) {
                this._changeElementTransform(this.horizontalSlider, 0, 0)
                this.showArea.current.scrollLeft = 0
            }
            if (
                sliderXWidth + horizontalSliderLeft + offset >=
                this.scrollWidth
            ) {
                this._changeElementTransform(
                    this.horizontalSlider,
                    this.scrollWidth - sliderXWidth,
                    0
                )
                this.showArea.current.scrollLeft =
                    (this.scrollWidth - sliderXWidth) * this.scaleX
            }
        }
        if (this.prevPageY) {
            const { clientY } = event
            const {
                top: trackTop2
            } = this.verticalScrollBar.current.getBoundingClientRect()

            const verticalSliderTransformArr = this._getPixelFromTransform(
                this.verticalSlider.current
            )
            const showAreaTransformArr = this._getPixelFromTransform(
                this.showArea
            )
            let trackTop = verticalSliderTransformArr[1]

            const sliderYHeight = parseFloat(
                this.verticalSlider.current.style.height
            )
            const clickPosition = sliderYHeight - this.prevPageY
            const offset = -trackTop + clientY - clickPosition - trackTop2
            let verticalSliderTop = trackTop
            // this.showArea.current.scrollTop = (verticalSliderTop * this.scaleY)
            //中间
            if (
                verticalSliderTop + offset >= 0 &&
                sliderYHeight + verticalSliderTop + offset < this.scrollHeight
            ) {
                this._changeElementTransform(
                    this.verticalSlider,
                    0,
                    verticalSliderTop + offset
                )

                this.showArea.current.scrollTop =
                    verticalSliderTop * this.scaleY
            }
            //上边界
            if (verticalSliderTop + offset < 0) {
                this._changeElementTransform(this.verticalSlider, 0, 0)

                this.showArea.current.scrollTop = 0
            }
            //下边界
            if (
                sliderYHeight + verticalSliderTop + offset >=
                this.scrollHeight
            ) {
                this._changeElementTransform(
                    this.verticalSlider,
                    0,
                    this.scrollHeight - sliderYHeight
                )

                this.showArea.current.scrollTop =
                    (this.scrollHeight - sliderYHeight) * this.scaleY
            }
        }
        return false
    }
    _changeElementTransform = (element, x, y) => {
        let el = element.current ? element.current : element
        el.style.transform = getTransformString(x, y)
    }

    _handleDragEnd = () => {
        this.setState({
            draggingY: false,
            draggingX: false
        })
        this.prevPageX = this.prevPageY = 0
        this._teardownDragging()
    }
    _controlScrollOrigin = event => {
        const {
            showYslider,
            showXslider,
            horizontal,
            vertical,
            draggingY,
            draggingX
        } = this.state
        const { scrollTop, scrollLeft } = this.showArea.current
        if (vertical && !draggingY && showYslider) {
            let preY = this._getPixelFromTransform(this.verticalSlider)[1]
            if (preY !== parseInt(scrollTop / this.scaleY)) {
                //输入事件和动画帧以大约相同的速率触发，因此下面的优化通常是没有必要的
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // setTimeout(() => {
                        this._changeElementTransform(
                            this.verticalSlider,
                            0,
                            scrollTop / this.scaleY
                        )
                        ticking = false
                    })
                }
                ticking = true
            }
        }
        if (horizontal && !draggingX && showXslider) {
            let preX = this._getPixelFromTransform(this.horizontalSlider)[0]
            if (preX !== parseInt(scrollLeft / this.scaleX)) {
                window.requestAnimationFrame(() =>
                    this._changeElementTransform(
                        this.horizontalSlider,
                        scrollLeft / this.scaleX,
                        0
                    )
                )
            }
        }
    }
    _getPixelFromTransform = transformEl => {
        const el = transformEl.current ? transformEl.current : transformEl
        let arr = this.getComputedTranslateXY(el)
        return arr
    }

    getComputedTranslateXY = obj => {
        const transArr = []
        if (!window.getComputedStyle) return
        const style = getComputedStyle(obj),
            transform =
                style.transform || style.webkitTransform || style.mozTransform
        let mat = transform.match(/^matrix3d\((.+)\)$/)
        if (mat) return parseFloat(mat[1].split(', ')[13])
        mat = transform.match(/^matrix\((.+)\)$/)
        mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : 0
        mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : 0
        return transArr
    }
}

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
        试验功能 允许scrollbar内嵌套系统滚动条 性能待优化
    */
    allowNesting: PropTypes.bool
}
/*
暴露两个外部方法供调用 scrollTop和scrollLeft 通过ref调用
const viewportScrollBar = this.refs.viewportScrollBar
viewportScrollBar.scrollTop(top - spaceBuffer)
*/

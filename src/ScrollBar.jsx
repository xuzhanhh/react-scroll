import React, { Component } from 'react'
import './ScrollBar.styl'
import cx from 'classnames'
import css from 'dom-css'
import { setTimeout } from 'timers'
import PropTypes from 'prop-types'
import { getTransformString } from './utils'
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    function(fn) {
        return setTimeout(fn, 1000 / 60)
    }
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout
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
        // console.log('componentDidUpdate')
        if (this.props.allowNesting) {
            // console.log('refresh')
            this.innerSystemScrollElement = []
            this.innerDontSystemScrollElement = []
        }
        this._initCanvas()
    }
    // componentWillUpdate(){
    //     this._initCanvas()
    // }
    _addListeners = () => {
        // this.scroll.current.addEventListener('scroll', this._controlScroll)
        // window.addEventListener('scroll', this._controlScroll)

        this.scroll.current.addEventListener(
            'wheel',
            this._controlScroll,
            false
        )
        this.showArea.current.addEventListener('wheel', e => {
            // e.stopPropagation()
            // console.log(e)
        })
    }

    _initCanvas = callback => {
        const { mouseIn, horizontal, vertical } = this.state
        const {
            height: scrollHeight,
            width: scrollWidth
        } = this.scroll.current.getBoundingClientRect()
        // const { height: showAreaHeight, width: showAreaWidth } = this.showArea.current.getBoundingClientRect()
        const showAreaHeight = this.showArea.current.scrollHeight
        // this.setState({
        //     showAreaHeight
        // })
        const showAreaWidth = this.showArea.current.scrollWidth

        if (showAreaHeight <= scrollHeight && this.state.showYslider) {
            // debugger
            this.setState(() => {
                return {
                    showYslider: false
                }
            })
            //重置transform
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            this.showArea.current.style.transform = `translate(${preX}px,${0}px)`
        } else if (showAreaHeight > scrollHeight && !this.state.showYslider) {
            this.setState(() => {
                return {
                    showYslider: true
                }
            })
        } else if (showAreaWidth <= scrollWidth && this.state.showXslider) {
            this.setState(() => {
                return {
                    showXslider: false
                }
            })
            //重置transform

            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            this.showArea.current.style.transform = `translate(${0}px,${preY}px)`
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

                let pre = this._getPixelFromTransform(this.showArea.current)
                let [preX, preY] = pre
                let contentHeigh = null
                if (preY > 0) {
                    contentHeigh = 0
                } else if (preY < -(this.showAreaHeight - this.scrollHeight)) {
                    contentHeigh = -(this.showAreaHeight - this.scrollHeight)
                } else {
                    contentHeigh = preY
                }
                if (typeof this.nextTickShowAreaHeight === 'number') {
                    // let test = contentHeigh / ( this.showAreaHeight - this.scrollHeight ) * (this.scrollHeight)
                    // this.currentTickShowAreaHeight = (this.nextTickShowAreaHeight - preY) / (this.showAreaHeight - this.scrollHeight) * this.sliderHeight
                    // this.currentTickShowAreaHeight = (this.nextTickShowAreaHeight - preY) / 2
                    this.preY = preY
                    this.currentTickShowAreaHeight =
                        (this.nextTickShowAreaHeight - this.preY) / 5
                    // console.log(this.currentTickShowAreaHeight)
                    contentHeigh =
                        Math.abs(
                            Math.abs(preY + this.currentTickShowAreaHeight) -
                                Math.abs(this.nextTickShowAreaHeight)
                        ) < 10
                            ? this.nextTickShowAreaHeight
                            : preY + this.currentTickShowAreaHeight
                }
                this.showArea.current.style.transform = getTransformString(
                    preX,
                    contentHeigh
                )
                this.verticalSlider.current.style.transform = getTransformString(
                    0,
                    -contentHeigh / this.scaleY
                )
                if (Math.abs(this.nextTickShowAreaHeight - contentHeigh) > 10) {
                    this.globalID = window.requestAnimationFrame(
                        this._initCanvas
                    )
                } else {
                    this.nextTickShowAreaHeight = undefined
                    window.cancelAnimationFrame(this.globalID)
                }
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

                let pre = this._getPixelFromTransform(this.showArea.current)
                let [preX, preY] = pre
                let contentWidth = null
                if (preX > 0) {
                    contentWidth = 0
                } else if (preX < -(this.showAreaWidth - this.scrollWidth)) {
                    contentWidth = -(this.showAreaWidth - this.scrollWidth)
                } else {
                    contentWidth = preX
                }
                // this.showArea.current.style.transform = `translate(${contentWidth}px,${preY}px)`
                // this.horizontalSlider.current.style.transform = `translate(${-contentWidth /
                //     this.scaleX}px,${0}px)`
                this.showArea.current.style.transform = getTransformString(
                    contentWidth,
                    preY
                )
                this.horizontalSlider.current.style.transform = getTransformString(
                    -contentWidth / this.scaleX,
                    0
                )
            }
        }

        // if(this.nextTickShowAreaHeight !== this.currentTickShowAreaHeight ){
        //     setInterval(this._initCanvas,100)
        // }
    }
    scrollTop = top => {
        const { showYslider } = this.state
        if (showYslider && top !== 0) {
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            if (top < 0) {
                top = 0
            }
            if (top > this.showAreaHeight - this.scrollHeight) {
                top = this.showAreaHeight - this.scrollHeight
            }
            let contentHeigh = -top
            // this.showArea.current.style.transform = `translate(${preX}px,${contentHeigh}px)`
            // this.verticalSlider.current.style.transform = `translate(${0}px,${-contentHeigh /
            //     this.scaleY}px)`
            this.showArea.current.style.transform = getTransformString(
                preX,
                contentHeigh
            )
            this.verticalSlider.current.style.transform = getTransformString(
                0,
                -contentHeigh / this.scaleY
            )
        }
    }

    scrollLeft = left => {
        const { showXslider } = this.state
        if (showXslider && left !== 0) {
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            // let contentWidth = null
            if (left < 0) {
                left = 0
            } else if (left > this.showAreaWidth - this.scrollWidth) {
                left = this.showAreaWidth - this.scrollWidth
            }
            let contentWidth = -left
            this.showArea.current.style.transform = `translate(${contentWidth}px,${preY}px)`
            this.horizontalSlider.current.style.transform = `translate(${-contentWidth /
                this.scaleX}px,${0}px)`
        }
    }

    raf = callback => {
        if (this.requestFrame) raf.cancel(this.requestFrame)
        this.requestFrame = raf(() => {
            this.requestFrame = undefined
            callback()
        })
    }

    update = callback => {
        this.raf(() => this._initCanvas(callback))
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
            [`inner`]: true,
            [className]: className
        })
        let showAreaClass = cx({
            [`showArea`]: true,
            [`scrollbar__click`]: clickScrollBar
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
            >
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
                            onMouseDown={
                                this._handleVerticalScrollBarMouseDown
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
                            onMouseDown={
                                this._handleHorizontalScrollBarMouseDown
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
    _handleHorizontalScrollBarMouseDown = event => {
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
                    this._changeElementTransform(
                        this.horizontalSlider,
                        offset,
                        0
                    )
                    this._changeElementTransform(
                        this.showArea,
                        -(offset * this.scaleX),
                        showAreaTransform[1]
                    )
                } else {
                    this._changeElementTransform(
                        this.horizontalSlider,
                        offset -
                            parseFloat(
                                this.horizontalSlider.current.style.width
                            ),
                        0
                    )
                    this._changeElementTransform(
                        this.showArea,
                        -(
                            (offset -
                                parseFloat(
                                    this.horizontalSlider.current.style.width
                                )) *
                            this.scaleX
                        ),
                        showAreaTransform[1]
                    )
                }
                this._closeTransiton()
            }
        )
    }

    _handleVerticalScrollBarMouseDown = event => {
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
                    this._changeElementTransform(this.verticalSlider, 0, offset)
                    this._changeElementTransform(
                        this.showArea,
                        showAreaTransform[0],
                        -(offset * this.scaleY)
                    )
                } else {
                    this._changeElementTransform(
                        this.verticalSlider,
                        0,
                        offset -
                            parseFloat(this.verticalSlider.current.style.height)
                    )
                    this._changeElementTransform(
                        this.showArea,
                        showAreaTransform[0],
                        -(
                            (offset -
                                parseFloat(
                                    this.verticalSlider.current.style.height
                                )) *
                            this.scaleY
                        )
                    )
                }
                this._closeTransiton()
            }
        )
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
                this._changeElementTransform(
                    this.showArea,
                    -(horizontalSliderLeft * this.scaleX),
                    showAreaTransformArr[1]
                )
            }
            if (horizontalSliderLeft + offset < 0) {
                this._changeElementTransform(this.horizontalSlider, 0, 0)
                this._changeElementTransform(
                    this.showArea,
                    0,
                    showAreaTransformArr[1]
                )
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
                this._changeElementTransform(
                    this.showArea,
                    -((this.scrollWidth - sliderXWidth) * this.scaleX),
                    showAreaTransformArr[1]
                )
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
                this._changeElementTransform(
                    this.showArea,
                    showAreaTransformArr[0],
                    -(verticalSliderTop * this.scaleY)
                )
            }
            //上边界
            if (verticalSliderTop + offset < 0) {
                this._changeElementTransform(this.verticalSlider, 0, 0)
                this._changeElementTransform(
                    this.showArea,
                    showAreaTransformArr[0],
                    0
                )
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
                this._changeElementTransform(
                    this.showArea,
                    showAreaTransformArr[0],
                    -((this.scrollHeight - sliderYHeight) * this.scaleY)
                )
            }
        }
        return false
    }
    _changeElementTransform = (element, x, y) => {
        let el = element.current ? element.current : element
        // el.style.transform = `translate(${x}px,${y}px)`
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

    _controlScroll = event => {
        // console.log('_controlScroll')
        // experimental function 支持ScrollBar嵌系统滚动条
        //todo 缓存 记录ScrollBar组件内会滚动的element
        //todo resize时候需要清空innerSystemScrollElement
        // event.path.forEach((item,index)=>{
        //     console.log(index, item, item.clientHeight, item.scrollHeight)
        // })
        const { showYslider, showXslider, horizontal, vertical } = this.state

        if (this.props.allowNesting) {
            let needFor = true
            if (this.innerSystemScrollElement.indexOf(event.path[0]) >= 0) {
                event.stopPropagation()
                return
            }
            if (this.innerDontSystemScrollElement.indexOf(event.path[0]) >= 0) {
                needFor = false
            }
            if (needFor) {
                for (let i = 0; i < event.path.length; i++) {
                    //遇到系统组件
                    if (
                        event.path[i] !== this.scroll.current &&
                        event.path[i].clientHeight !==
                            event.path[i].scrollHeight
                    ) {
                        // this.innerSystemScrollElement.push(event.path[0])
                        this.innerSystemScrollElement = [
                            ...this.innerDontSystemScrollElement,
                            ...event.path.slice(0, i)
                        ]
                        event.stopPropagation()
                        return
                    }
                    //到scrollBar组件都没有系统组件
                    if (event.path[i] === this.scroll.current) {
                        // console.log('break')
                        //证明这条path的element都不会遇到系统组件
                        this.innerDontSystemScrollElement = [
                            ...this.innerDontSystemScrollElement,
                            ...event.path
                        ]
                        break
                    }
                }
            }
        }
        //向下滚 delta 正 向上 负
        const ua = navigator.userAgent.toLowerCase()
        let deltaY = event.deltaY
        //兼容win版firefox
        if (ua.indexOf('win') >= 0 && ua.indexOf('firefox') > 0) {
            deltaY = event.deltaY * 33
        }
        if (vertical && showYslider && deltaY !== 0) {
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            let contentHeigh = null
            if (preY - deltaY > 0) {
                contentHeigh = 0
                //如果没滚到顶
                if (preY !== 0) {
                    event.stopPropagation()
                }
            } else if (
                preY - deltaY <
                -(this.showAreaHeight - this.scrollHeight)
            ) {
                // console.log(preY, -(this.showAreaHeight - this.scrollHeight))
                contentHeigh = -(this.showAreaHeight - this.scrollHeight)
                //如果没滚到底
                if (preY !== -(this.showAreaHeight - this.scrollHeight)) {
                    event.stopPropagation()
                }
            } else {
                event.stopPropagation()

                contentHeigh = preY - deltaY
            }
            // this.showArea.current.style.transform = `translate(${preX}px,${contentHeigh}px)`
            // this.verticalSlider.current.style.transform = `translate(${0}px,${-contentHeigh / this.scaleY}px)`
            this.nextTickShowAreaHeight = contentHeigh
            // console.log(this.nextTickShowAreaHeight)
            this._initCanvas()
        }
        if (horizontal && showXslider && event.deltaX !== 0) {
            event.stopPropagation()

            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            let contentWidth = null
            if (preX - event.deltaX > 0) {
                contentWidth = 0
            } else if (
                preX - event.deltaX <
                -(this.showAreaWidth - this.scrollWidth)
            ) {
                contentWidth = -(this.showAreaWidth - this.scrollWidth)
            } else {
                event.stopPropagation()

                contentWidth = preX - event.deltaX
            }
            this.showArea.current.style.transform = getTransformString(
                contentWidth,
                preY
            )
            this.horizontalSlider.current.style.transform = getTransformString(
                -contentWidth / this.scaleX,
                0
            )
            // this.showArea.current.style.transform = `translate(${contentWidth}px,${preY}px)`
            // this.horizontalSlider.current.style.transform = `translate(${-contentWidth /
            //     this.scaleX}px,${0}px)`
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

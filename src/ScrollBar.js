import React, { Component } from 'react';
import logo from './logo.svg';
import './ScrollBar.css';
import cx from 'classnames';
import css from 'dom-css';
import raf, { cancel as caf } from 'raf';

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
            clickScrollBar: false
        }
    }
    componentDidMount() {
        this._initCanvas()
    }
    componentDidUpdate() {
        this._initCanvas()
    }
    _initCanvas = () => {
        const { mouseIn } = this.state
        const { height: scrollHeight, width: scrollWidth } = this.scroll.current.getBoundingClientRect()
        // const { height: showAreaHeight, width: showAreaWidth } = this.showArea.current.getBoundingClientRect()
        const showAreaHeight = this.showArea.current.scrollHeight
        const showAreaWidth = this.showArea.current.scrollWidth


        if (showAreaHeight <= scrollHeight && this.state.showYslider) {
            this.setState(() => {
                return {
                    showYslider: false
                }
            })
        }
        if (showAreaHeight > scrollHeight && !this.state.showYslider) {
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
        }
        if (showAreaWidth > scrollWidth && !this.state.showXslider) {
            this.setState(() => {
                return {
                    showXslider: true
                }
            })
        }
        if (this.state.showYslider) {
            this.verticalScrollBar.current.style.height = scrollHeight + 'px'
            this.verticalSlider.current.style.height = scrollHeight * (scrollHeight / showAreaHeight) + "px"
            this.sliderHeight = scrollHeight - scrollHeight * (scrollHeight / showAreaHeight)
            this.sliderScrollableHeight = scrollHeight - this.sliderHeight
            this.contentScrollableHeight = showAreaHeight - scrollHeight
            this.scaleY = this.contentScrollableHeight / this.sliderHeight
            this.scrollHeight = scrollHeight
            this.showAreaHeight = showAreaHeight
        }
        if (this.state.showXslider) {
            this.horizontalScrollBar.current.style.width = scrollWidth + 'px'
            this.horizontalSlider.current.style.width = scrollWidth * (scrollWidth / showAreaWidth) + "px"
            this.sliderWidth = scrollWidth - scrollWidth * (scrollWidth / showAreaWidth)

            this.sliderScrollableWidth = scrollWidth - this.sliderWidth
            this.contentScrollableWidth = showAreaWidth - scrollWidth
            this.scaleX = this.contentScrollableWidth / this.sliderWidth
            this.scrollWidth = scrollWidth
            this.showAreaWidth = showAreaWidth
        }
    }
    render() {
        const { mouseIn, showYslider, showXslider, mouseInYSlider, mouseInXSlider, draggingX, draggingY, clickScrollBar } = this.state
        const { height, width, style, className } = this.props
        let vs = cx({
            [`vertical-scroll`]: true,
            [`invisible`]: !mouseIn || !draggingY,
            [`visible`]: mouseIn && !draggingX,
            [`mousein`]: mouseInYSlider || draggingY,
            [`scrollbar__click`]: clickScrollBar,
        })
        let ps = cx({
            [`horizontal-scroll`]: true,
            [`invisible`]: !mouseIn || !draggingX,
            [`visible`]: mouseIn && !draggingY,
            [`mousein`]: mouseInXSlider || draggingX,
            [`scrollbar__click`]: clickScrollBar,
        })
        let innerClass = cx({
            [`inner`]: true,
            [className]: className
        })
        let showAreaClass = cx({
            [`showArea`]: true,
            [`scrollbar__click`]: clickScrollBar,
        })
        this.scroll.current && css(this.scroll.current, { height, width })
        return (
            <div className={innerClass} ref={this.scroll} onMouseEnter={() => {
                this.setState({
                    mouseIn: true
                })
            }} onMouseLeave={() => {
                this.setState({
                    mouseIn: false
                })
            }} onWheel={this._controlScroll}>
                <div className={showAreaClass} ref={this.showArea}>
                    {this.props.children}
                </div>
                {/* <canvas id="verticalScroll" className="vertical-scroll"></canvas> */}
                {showYslider && <div className={vs} ref={this.verticalScrollBar} onMouseEnter={
                    () => {
                        this.setState({
                            mouseInYSlider: true
                        })
                    }
                } onMouseLeave={
                    () => {
                        this.setState({
                            mouseInYSlider: false
                        })
                    }
                } onMouseDown={this._handleVerticalScrollBarMouseDown}
                >
                    <div className="slider__vertical" ref={this.verticalSlider} onMouseDown={this._handleVerticalSliderMouseDown}
                    >
                    </div>
                </div>}
                {showXslider && <div className={ps} ref={this.horizontalScrollBar} onMouseEnter={
                    () => {
                        this.setState({
                            mouseInXSlider: true
                        })
                    }
                } onMouseLeave={
                    () => {
                        this.setState({
                            mouseInXSlider: false
                        })
                    }
                } onMouseDown={this._handleHorizontalScrollBarMouseDown}>
                    <div className="slider__horizontal" ref={this.horizontalSlider} onMouseDown={this._handleHorizontalSliderMouseDown} >
                    </div>
                </div>}
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
    _handleHorizontalScrollBarMouseDown = (event) => {
        event.preventDefault();
        const { target, clientX } = event;
        const { left: trackLeft } = this.horizontalScrollBar.current.getBoundingClientRect();
        this.setState({
            clickScrollBar: true
        }, () => {

            const sliderXWidth = this._getPixelFromTransform(this.horizontalSlider)[0]
            const showAreaTransform = this._getPixelFromTransform(this.showArea)
            const offset = clientX - trackLeft;
            if (offset <= sliderXWidth) {
                this._changeElementTransform(this.horizontalSlider, offset, 0)
                this._changeElementTransform(this.showArea, -(offset * this.scaleX), showAreaTransform[1])

            } else {
                this._changeElementTransform(this.horizontalSlider, offset - parseFloat(this.horizontalSlider.current.style.width), 0)
                this._changeElementTransform(this.showArea, -((offset - parseFloat(this.horizontalSlider.current.style.width)) * this.scaleX), showAreaTransform[1])
            }
            this._closeTransiton()

        })
    }

    _handleVerticalScrollBarMouseDown = (event) => {
        event.preventDefault();
        const { target, clientY } = event;
        const { top: trackTop } = this.verticalScrollBar.current.getBoundingClientRect();
        this.setState({
            clickScrollBar: true
        }, () => {
            const sliderYHeight = this._getPixelFromTransform(this.verticalSlider)[1]
            const showAreaTransform = this._getPixelFromTransform(this.showArea)
            const offset = clientY - trackTop;
            if (offset <= sliderYHeight) {
                this._changeElementTransform(this.verticalSlider, 0, offset)
                this._changeElementTransform(this.showArea, showAreaTransform[0], -(offset * this.scaleY))

            } else {
                this._changeElementTransform(this.verticalSlider, 0, offset - parseFloat(this.verticalSlider.current.style.height))
                this._changeElementTransform(this.showArea, showAreaTransform[0], -((offset - parseFloat(this.verticalSlider.current.style.height)) * this.scaleY))
            }
            this._closeTransiton()
        })
    }
    _handleVerticalSliderMouseDown = (event) => {
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
    _handleHorizontalSliderMouseDown = (event) => {
        // this.draggingX = true;
        this.setState({
            draggingX: true
        })
        event.preventDefault();
        event.stopPropagation();
        this._handleDragStart(event);
        const { target, clientX } = event;
        const { offsetWidth } = target;
        const { left } = target.getBoundingClientRect();
        this.prevPageX = offsetWidth - (clientX - left);
    }
    // raf = (callback) => {
    //     if (this.requestFrame) raf.cancel(this.requestFrame);
    //     this.requestFrame = raf(() => {
    //         this.requestFrame = undefined;
    //         callback();
    //     });
    // }

    // update = (callback) => {
    //     this.raf(() => this._update(callback));
    // }

    _handleDragStart = (event) => {
        // this.dragging = true;
        // event.stopImmediatePropagation();
        this._setupDragging();
    }
    _setupDragging = () => {
        css(document.body, {
            userSelect: 'none'
        });
        document.addEventListener('mousemove', this._handleDrag);
        document.addEventListener('mouseup', this._handleDragEnd);
        document.onselectstart = () => false;
    }
    _teardownDragging = () => {
        css(document.body, {
            userSelect: ''
        });
        document.removeEventListener('mousemove', this._handleDrag);
        document.removeEventListener('mouseup', this._handleDragEnd);
        document.onselectstart = undefined;
    }

    _handleDrag = (event) => {
        if (this.prevPageX) {
            const { clientX } = event;
            const { left: trackLeft2 } = this.horizontalScrollBar.current.getBoundingClientRect();

            const horizontalSliderTeansformArr = this._getPixelFromTransform(this.horizontalSlider.current)
            const trackLeft = horizontalSliderTeansformArr[0]
            const sliderXWidth = parseFloat(this.horizontalSlider.current.style.width)
            const clickPosition = sliderXWidth - this.prevPageX;
            const offset = -trackLeft + clientX - clickPosition - trackLeft2;
            console.log(trackLeft, trackLeft2)
            let horizontalSliderLeft = trackLeft
            if (horizontalSliderLeft + offset >= 0 && sliderXWidth + horizontalSliderLeft + offset < this.scrollWidth) {
                this._changeElementTransform(this.horizontalSlider, horizontalSliderLeft + offset, 0)
                this._changeElementTransform(this.showArea, -(horizontalSliderLeft * this.scaleX), horizontalSliderTeansformArr[1])
            }
            if (horizontalSliderLeft + offset < 0) {
                this._changeElementTransform(this.horizontalSlider, 0, 0)
                this._changeElementTransform(this.showArea, 0, horizontalSliderTeansformArr[1])
            }
            if (sliderXWidth + horizontalSliderLeft + offset >= this.scrollWidth) {
                this._changeElementTransform(this.horizontalSlider, this.scrollWidth - sliderXWidth, 0)
                this._changeElementTransform(this.showArea, -((this.scrollWidth - sliderXWidth) * this.scaleX), horizontalSliderTeansformArr[1])
            }
        }
        if (this.prevPageY) {
            const { clientY } = event;
            const { top: trackTop2 } = this.verticalScrollBar.current.getBoundingClientRect();

            const verticalSliderTransformArr = this._getPixelFromTransform(this.verticalSlider.current)
            let trackTop = verticalSliderTransformArr[1]

            const sliderYHeight = parseFloat(this.verticalSlider.current.style.height)
            const clickPosition = sliderYHeight - this.prevPageY;
            const offset = -trackTop + clientY - clickPosition - trackTop2;
            let verticalSliderTop = trackTop
            //中间
            if (verticalSliderTop + offset >= 0 && sliderYHeight + verticalSliderTop + offset < this.scrollHeight) {
                this._changeElementTransform(this.verticalSlider, 0, verticalSliderTop + offset)
                this._changeElementTransform(this.showArea, verticalSliderTransformArr[0], -(verticalSliderTop * this.scaleY))
            }
            //上边界
            if (verticalSliderTop + offset < 0) {
                this._changeElementTransform(this.verticalSlider, 0, 0)
                this._changeElementTransform(this.showArea, verticalSliderTransformArr[0], 0)
            }
            //下边界
            if (sliderYHeight + verticalSliderTop + offset >= this.scrollHeight) {
                this._changeElementTransform(this.verticalSlider, 0, this.scrollHeight - sliderYHeight)
                this._changeElementTransform(this.showArea, verticalSliderTransformArr[0], -((this.scrollHeight - sliderYHeight) * this.scaleY))
            }
        }
        return false;
    }
    _changeElementTransform = (element, x, y) => {
        let el = element.current ? element.current : element
        el.style.transform = `translate(${x}px,${y}px)`
    }

    _handleDragEnd = () => {
        this.setState({
            draggingY: false,
            draggingX: false
        })
        this.prevPageX = this.prevPageY = 0;
        this._teardownDragging();
    }


    _controlScroll = (event) => {
        event.preventDefault()
        //向下滚 delta 正 向上 负
        const { showYslider, showXslider } = this.state
        if (showYslider && event.deltaY !== 0) {
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            let contentHeigh = null
            if (preY - event.deltaY > 0) {
                contentHeigh = 0
            } else if (preY - event.deltaY < -(this.showAreaHeight - this.scrollHeight)) {
                contentHeigh = -(this.showAreaHeight - this.scrollHeight)
            } else {
                contentHeigh = preY - event.deltaY
            }
            this.showArea.current.style.transform = `translate(${preX}px,${contentHeigh}px)`
            this.verticalSlider.current.style.transform = `translate(${0}px,${-contentHeigh / this.scaleY}px)`
        }
        if (showXslider && event.deltaX !== 0) {
            let pre = this._getPixelFromTransform(this.showArea.current)
            let [preX, preY] = pre
            let contentWidth = null
            if (preX - event.deltaX > 0) {
                contentWidth = 0
            } else if (preX - event.deltaX < -(this.showAreaWidth - this.scrollWidth)) {
                contentWidth = -(this.showAreaWidth - this.scrollWidth)
            } else {
                contentWidth = preX - event.deltaX
            }
            this.showArea.current.style.transform = `translate(${contentWidth}px,${preY}px)`
            this.horizontalSlider.current.style.transform = `translate(${-contentWidth / this.scaleX}px,${0}px)`
        }
    }

    _getPixelFromTransform = (transformEl) => {
        const el = transformEl.current ? transformEl.current : transformEl
        let arr = this.getComputedTranslateXY(el)
        return arr
    }

    getComputedTranslateXY = (obj) => {
        const transArr = [];
        if (!window.getComputedStyle) return;
        const style = getComputedStyle(obj),
            transform = style.transform || style.webkitTransform || style.mozTransform;
        let mat = transform.match(/^matrix3d\((.+)\)$/);
        if (mat) return parseFloat(mat[1].split(', ')[13]);
        mat = transform.match(/^matrix\((.+)\)$/);
        mat ? transArr.push(parseFloat(mat[1].split(', ')[4])) : 0;
        mat ? transArr.push(parseFloat(mat[1].split(', ')[5])) : 0;
        return transArr;
    }
}

import React, { Component } from 'react';
import logo from './logo.svg';
import './ScrollBar.css';
import cx from 'classnames';
import css from 'dom-css';

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
        const { mouseIn, showYslider, showXslider, mouseInYSlider, mouseInXSlider, draggingX, draggingY } = this.state
        const { height, width } = this.props
        let vs = cx({
            [`vertical-scroll`]: true,
            [`invisible`]: !mouseIn||!draggingY,
            [`visible`]: mouseIn&&!draggingX,
            [`mousein`]: mouseInYSlider||draggingY,
        })
        let ps = cx({
            [`horizontal-scroll`]: true,
            [`invisible`]: !mouseIn||!draggingX,
            [`visible`]: mouseIn&&!draggingY,
            [`mousein`]: mouseInXSlider||draggingX,
        })
        this.scroll.current && css(this.scroll.current, { height, width })
        return (
            <div className="inner" ref={this.scroll} onMouseEnter={() => {
                this.setState({
                    mouseIn: true
                })
            }} onMouseLeave={() => {
                this.setState({
                    mouseIn: false
                })
            }} onWheel={this._controlScroll}>
                <div className="showArea" ref={this.showArea}>
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
                }>
                    <div className="slider__vertical" ref={this.verticalSlider} onMouseDown={
                        (event) => {
                            // this.draggingY = true
                            this.setState({
                                draggingY: true
                            })
                            event.preventDefault();
                            this._handleDragStart(event);
                            const { target, clientY } = event;
                            const { offsetHeight } = target;
                            const { top } = target.getBoundingClientRect();
                            this.prevPageY = offsetHeight - (clientY - top);
                        }
                    }>
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
                }>
                    <div className="slider__horizontal" ref={this.horizontalSlider} onMouseDown={
                        (event) => {
                            // this.draggingX = true;
                            this.setState({
                                draggingX : true
                            })
                            event.preventDefault();
                            this._handleDragStart(event);
                            const { target, clientX } = event;
                            const { offsetWidth } = target;
                            const { left } = target.getBoundingClientRect();
                            this.prevPageX = offsetWidth - (clientX - left);
                        }} >
                    </div>
                </div>}
            </div>
        )
    }
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
    teardownDragging = () => {
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
            const { left: trackLeft } = this.horizontalSlider.current.getBoundingClientRect();
            const sliderXWidth = parseFloat(this.horizontalSlider.current.style.width)
            const clickPosition = sliderXWidth - this.prevPageX;
            const offset = -trackLeft + clientX - clickPosition;
            let horizontalSliderLeft = this.horizontalSlider.current.style.left ? parseFloat(this.horizontalSlider.current.style.left) : 0
            if (horizontalSliderLeft + offset >= 0 && sliderXWidth+ horizontalSliderLeft + offset< this.scrollWidth) {
                this.horizontalSlider.current.style.left = horizontalSliderLeft + offset + 'px'
                this.showArea.current.style.left = -(horizontalSliderLeft * this.scaleX) + 'px'
            }
            if (horizontalSliderLeft + offset < 0) {
                this.horizontalSlider.current.style.left = 0 + 'px'
                this.showArea.current.style.left = 0 +'px'
            }
            if (sliderXWidth + horizontalSliderLeft + offset>= this.scrollWidth){
                this.horizontalSlider.current.style.left = this.scrollWidth - sliderXWidth  + 'px'
                this.showArea.current.style.left = -((this.scrollWidth - sliderXWidth) * this.scaleX) + 'px'
            }
        }
        if (this.prevPageY) {
            const { clientY } = event;
            const { top: trackTop } = this.verticalSlider.current.getBoundingClientRect();
            const sliderYHeight = parseFloat(this.verticalSlider.current.style.height)
            const clickPosition = sliderYHeight - this.prevPageY;
            const offset = -trackTop + clientY - clickPosition;
            let verticalSliderTop = this.verticalSlider.current.style.top ? parseFloat(this.verticalSlider.current.style.top) : 0
            if (verticalSliderTop + offset >= 0 && sliderYHeight+ verticalSliderTop + offset< this.scrollHeight) {
                this.verticalSlider.current.style.top = verticalSliderTop + offset + 'px'
                this.showArea.current.style.top = -(verticalSliderTop * this.scaleY) + 'px'
            }
            if (verticalSliderTop + offset < 0) {
                this.verticalSlider.current.style.top = 0 + 'px'
                this.showArea.current.style.top = 0 +'px'
            }
            if (sliderYHeight+ verticalSliderTop + offset>= this.scrollHeight){
                this.verticalSlider.current.style.top = this.scrollHeight - sliderYHeight  + 'px'
                this.showArea.current.style.top = -((this.scrollHeight - sliderYHeight) * this.scaleY) + 'px'
            }
        }
        return false;
    }

    _handleDragEnd = () => {
        console.log('_handleDragEnd')
        this.setState({
            draggingY: false,
            draggingX: false
        })
        // this.draggingY = this.draggingX = false;
        this.prevPageX = this.prevPageY = 0;
        this.teardownDragging();
        // this.handleDragEndAutoHide();
    }


    _controlScroll = (event) => {
        event.preventDefault()
        // console.log(event.deltaX)
        //向下滚 delta 正 向上 负
        // debugger
        const { showYslider, showXslider } = this.state
        if (showYslider) {
            let pre = this.showArea.current.style.top
            pre = Number(pre.substring(0, pre.length - 2))
            let contentHeigh = null
            if (pre - event.deltaY > 0) {
                contentHeigh = 0
            } else if (pre - event.deltaY < -(this.showAreaHeight - this.scrollHeight)) {
                contentHeigh = -(this.showAreaHeight - this.scrollHeight)
            } else {
                contentHeigh = pre - event.deltaY
            }
            this.showArea.current.style.top = contentHeigh + 'px'
            this.verticalSlider.current.style.top = -contentHeigh / this.scaleY + 'px'
        }
        if (showXslider) {
            let pre = this.showArea.current.style.left
            pre = Number(pre.substring(0, pre.length - 2))
            let contentWidth = null
            if (pre - event.deltaX > 0) {
                contentWidth = 0
            } else if (pre - event.deltaX < -(this.showAreaWidth - this.scrollWidth)) {
                contentWidth = -(this.showAreaWidth - this.scrollWidth)
            } else {
                contentWidth = pre - event.deltaX
            }
            this.showArea.current.style.left = contentWidth + 'px'
            this.horizontalSlider.current.style.left = -contentWidth / this.scaleX + 'px'
        }

    }
}
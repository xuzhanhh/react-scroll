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
        console.log('showAreaWidth,scrollWidth ', showAreaWidth, scrollWidth)
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
        if( this.state.showYslider) {
            this.verticalScrollBar.current.style.height = scrollHeight + 'px'
            this.verticalSlider.current.style.height = scrollHeight * (scrollHeight / showAreaHeight) + "px"
            this.sliderHeight = scrollHeight - scrollHeight * (scrollHeight / showAreaHeight)
            this.sliderScrollableHeight = scrollHeight - this.sliderHeight
            this.contentScrollableHeight = showAreaHeight - scrollHeight
            this.scaleY = this.contentScrollableHeight / this.sliderHeight
            this.scrollHeight = scrollHeight
            this.showAreaHeight = showAreaHeight
        }
        if( this.state.showXslider){
            this.horizontalScrollBar.current.style.width = scrollWidth+ 'px'
            this.horizontalSlider.current.style.width = scrollWidth* (scrollWidth / showAreaWidth) + "px"
            console.log(scrollWidth* (scrollWidth / showAreaWidth))
            this.sliderWidth = scrollWidth - scrollWidth * (scrollWidth / showAreaWidth)

            this.sliderScrollableWidth = scrollWidth - this.sliderWidth
            this.contentScrollableWidth = showAreaWidth - scrollWidth
            this.scaleX = this.contentScrollableWidth / this.sliderWidth
            this.scrollWidth = scrollWidth
            this.showAreaWidth = showAreaWidth
        }
    }
    render() {
        const { mouseIn, showYslider, showXslider } = this.state
        const { height, width} = this.props
        console.log('render', showYslider, showXslider)
        console.log(this.showArea, this.showArea&&this.showArea.current&&this.showArea.current.scrollWidth, this.showArea&&this.showArea.current&&this.showArea.current.scrollHeight)
        let vs = cx({
            [`vertical-scroll`]: true,
            [`invisible`]: !mouseIn,
            [`visible`]: mouseIn,
        })
        let ps = cx({
            [`horizontal-scroll`]: true,
            [`invisible`]: !mouseIn,
            [`visible`]: mouseIn,
        })
        this.scroll.current&&css(this.scroll.current, {height, width})
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
                {showYslider && <div className={vs} ref={this.verticalScrollBar}>
                    <div className="slider__vertical" ref={this.verticalSlider}>
                    </div>
                </div>}
                {showXslider && <div className={ps} ref={this.horizontalScrollBar}>
                    <div className="slider__horizontal" ref={this.horizontalSlider}>
                    </div>
                </div>}
            </div>
        )
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
            } else if (pre - event.deltaX< -(this.showAreaWidth - this.scrollWidth)) {
                contentWidth = -(this.showAreaWidth - this.scrollWidth)
            } else {
                contentWidth = pre - event.deltaX
            }
            this.showArea.current.style.left = contentWidth + 'px'
            this.horizontalSlider.current.style.left = -contentWidth / this.scaleX + 'px'
        }

    }
}
import React from 'react'
import ScrollBar from './ScrollBar'
import './VirtualList.css'
class VirtualList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            itemHeight: 30,
            item: Array.from(new Array(1000), (val, index) => index + 1),
            visibleData: []
        }
        this.content = React.createRef()
        this.wrapper = React.createRef()
    }
    componentDidMount() {
        this._updateVisibleData()
    }

    render() {
        const { height, width } = this.props
        const { itemHeight, item, visibleData } = this.state
        const wrapperHeight = item.length * itemHeight + 'px'
        return (
            // <ScrollBar height={height} width={width} onWheel={this._updateVisibleData}>

            <div ref={this.wrapper} style={{height:height, width:width, overflow:'auto', position:'relative', border:'1px solid #aaa'}} onWheel={this._updateVisibleData}  >
                <div className="vl-phantom" style={{ height: wrapperHeight }}>

                </div>

                <div className="vl-content" ref={this.content}>
                    {visibleData.map((data, index) => <div key={index} style={{ height: itemHeight }}>{data}</div>)}
                </div>
            </div >
            // </ScrollBar>
        )
    }
    _updateVisibleData = () => {
        let scrollTop = this.wrapper.current.scrollTop
        console.log(scrollTop)
        const { height } = this.props
        const { itemHeight, item } = this.state
        const visibleCount = Math.ceil(height / itemHeight)
        const start = Math.floor(scrollTop / itemHeight)
        const end = start + visibleCount
        const visibleData = item.slice(start, end)
        console.log(start, end)
        this.content.current.style.webkitTransform = `translate3d(0, ${ start * itemHeight }px, 0)`;
        this.setState({
            visibleData
        })
    }
}

export default VirtualList
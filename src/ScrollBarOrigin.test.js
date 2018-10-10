import React from 'react'
import ScrollBar from './ScrollBarOrigin'
import {render} from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const component = render(
    <ScrollBar style={{width:200, height:200}}>
        <div style={{width:400, height:400}}></div>
    </ScrollBar>
)

test('ScrollBar changes the class when hovered', ()=>{

    // let tree = component.toJSON()
    expect(component.hasClass('inner__origin')).toEqual(true)

    // tree.props.onMouseEnter()
})

test('render', ()=>{
    expect(component).toMatchSnapshot()
})
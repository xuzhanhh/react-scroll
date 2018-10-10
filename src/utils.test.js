import { getTransformString } from './utils'

test('getTransformString',()=>{
    expect(getTransformString(10.5,10.5)).toEqual(`translate(10px,10px)`)
})
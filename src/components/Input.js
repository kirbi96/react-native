import React, {memo} from 'react'
import {TextInput} from 'react-native'

const Input = ({style, data, setData}) =>{
    return(
        <TextInput
            style={style}
            onChangeText={setData}
            value={data}
        />
    )
}

export default memo(Input);

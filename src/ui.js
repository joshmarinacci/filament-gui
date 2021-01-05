import {useEffect, useRef, useState} from 'react'

export const VBox = ({children, classes={}, grow = false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'column'
    }
    let clsses = {
        grow: grow
    }
    Object.keys(classes).forEach(key => clsses[key] = classes[key])
    let clssstr = Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}
export const HBox = ({children, fill = false}) => {
    let style = {
        display: 'flex',
        flexDirection: 'row'
    }
    let clsses = {
        fill: fill
    }
    let clssstr = Object.keys(clsses).filter(k => clsses[k]).join(" ")
    return <div className={clssstr} style={style}>{children}</div>
}
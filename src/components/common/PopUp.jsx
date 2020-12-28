import React from 'react'
import s from './PopUp.module.css'
import useEscape from "../../utils/useEscape";

const PopUp = ({onClose=()=>{}, ...props}) => {
  const containerRef = useEscape(s.wrapper, onClose);
  return <div className={s.wrapper} ref={containerRef}>{props.children}</div>
}

export default PopUp

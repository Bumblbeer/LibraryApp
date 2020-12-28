import React, {useContext, useState} from "react";
import s from "./ListView.module.css";

const ListView = (props) => {
  return <div className={s.contentWrapper}>
    {props.children}
  </div>
}

export default ListView

import s from "./TabView.module.css";
import SearchBar from "./SearchBar";
import React, {useState} from "react";

const Menu = ({items=[], activeId = 0, setIndex=()=>{}}) => {
  return <div className={s.menu}>
    {items.map((item, id)=><MenuItem text={item} onClick={()=>setIndex(id)} isActive={id === activeId}/>)}
  </div>
}

const MenuItem = ({text, isActive = false, onClick = ()=>{}}) => {
  return <div className={s.menuItem} onClick={onClick} style={isActive? {fontWeight: 'bold'} : {}}>{text}</div>
}

const TabView = ({screens = [], onAdd, setQuery}) => {

  const [currentScreen, setCurrentScreen] = useState(0)

  return (
    <div className={s.wrapper}>
      <SearchBar onClick={onAdd ? ()=>onAdd(currentScreen) : null} setQuery={setQuery}/>
      <Menu items={screens.map(s=>s.title)} activeId={currentScreen} setIndex={setCurrentScreen}/>
      {screens[currentScreen].content}
    </div>
  )
}

export default TabView

import s from "./SearchBar.module.css";
import React from "react";
import Button from "./Button";

const SearchBar = ({setQuery, onClick}) => {
  return <div className={s.searchWrapper}>
    <div className={s.searchBar}>
      <i className={'fas fa-search'}/>
      <input className={s.searchInput} placeholder={"Search"} onChange={e=>setQuery(e.target.value)}/>
    </div>
    {onClick && <div style={{padding: '4px 0 4px 8px'}}><Button title={<span><i className={'fas fa-plus'} />Add</span>} onClick={onClick}/></div> }
  </div>
}

export default SearchBar

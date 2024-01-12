import useOnClickOutside from '@/HOC/useOnClickOutside';
import { createContext, useContext, useRef, useState } from 'react';
import Image from 'next/image'
import trash from "../../public/images/trash.png";

const DropDownContext=createContext();

export const DropDown = ({children}) => {
    const [open,setOpen]=useState(false);
    const selectContainerRef = useRef(null);
    const clickOutsideHandler = () => setOpen(false);
    useOnClickOutside(selectContainerRef,clickOutsideHandler);

    return (
        <div className='position-relative' ref={selectContainerRef}>
          <DropDownContext.Provider value={{open,setOpen}}>
                {children}
          </DropDownContext.Provider>
        </div>
    )
}

function Header(){
    const {open,setOpen}=useContext(DropDownContext);
    return (
          <button type="button" className="more-btn dropdown-toggle"
           onClick={()=>setOpen(!open)} >
            <svg
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
            >
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
          </button>
    )
}

function Body({value}){
    const {open}=useContext(DropDownContext);
  
    return (
        <ul className={`dropdown-menu end-0 ${open?"d-block":""}`} >
            {value.map(item=>{
         return <li>
           <button
             type="button"
             className='d-flex align-items-center justify-content-between px-3'
             onClick={() =>console.log("end")}
           >
             <p>{item}</p>  <Image src={trash} alt="trash" /> 
           </button>
         </li>

            })}
       </ul>
    )
}

DropDown.Header=Header;
DropDown.Body=Body;
import { useCallback, useEffect, useRef, useState } from "react"

const useGetPage = (socket,event,selectedUser,ref) => {
  const [state,setState]=useState({});
  const parentRef=useRef(null);
  useEffect(()=>{
    if(selectedUser){
      socket.emit(event,selectedUser,(response) => {
      setState(response);
      })
    }
  },[selectedUser.id]);

  const chatListRef=useCallback((node) => {
    if(ref.current)ref.current.disconnect();
    ref.current=new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting){
          if(state.nextPage){
            socket.emit(event,{id:selectedUser.id,skip:state.nextPage},(response) => {
              setState({data:[...state.data,...response.data],nextPage:response.nextPage});
            })
          }
        }
    },{
      threshold:0.1
    })
    if(node)ref.current.observe(node);
  },[state]);

  return {data:state?.data,chatListRef,parentRef}
}

export default useGetPage
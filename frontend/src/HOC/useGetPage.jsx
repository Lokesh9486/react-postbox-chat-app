import { useCallback, useEffect, useState } from "react"

const useGetPage = (socket,event,selectedUser,ref) => {
  const [state,setState]=useState({});
  const [count,setCount]=useState(0);
  useEffect(()=>{
    if(selectedUser){
      socket.emit(event,selectedUser,(response) => {
      setState(response);
      })
    }
  },[selectedUser.id]);

  const chatListRef=useCallback((node) => {
    console.log("node:", node)
    if(ref.current)ref.current.disconnect();
    ref.current=new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting){
          console.log(state.nextPage);
          if(state.nextPage){
            socket.emit(event,{id:selectedUser.id,skip:state.nextPage},(response) => {
              setState({data:[...response.data,...state.data],nextPage:response.nextPage});
            })
          }
        }
    },{
      threshold:0.1
    })
    if(node)ref.current.observe(node);
  },[state]);

  return {data:state?.data,chatListRef}
}

export default useGetPage
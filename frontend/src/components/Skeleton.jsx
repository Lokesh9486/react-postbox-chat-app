import "../styles/components/skeleton.scss";

const Skeleton = () => {
  return (
    <div className="chat-pages-main skeleton">
      <aside>
        <div className="sidebar-header split">
          <div className="user-round"></div>
          <div className="input-round"></div>
        </div>
        {[...Array(4)].map((_, index) => (
          <div className="split" key={index}>
            <div className="user-round"></div>
            <div className="w-100 d-flex alig-items-center flex-column gap-3">
              <div className="input-straight"></div>
              <div className="input-straight w-50"></div>
            </div>
          </div>
        ))}
      </aside>
      <section className="chat-container">
        <div className="split">
          <div className="user-round"></div>
          <div className="input-round"></div>
        </div>
        <div className="chat-body">
        {
            [...Array(6)].map((_,index)=>
            <div
            key={index}
              className={
                index%2 ? "other-chat-list" : "user-chat-list"
              }
            >
            <div className="split" key={index}>
            <div className="user-round"></div>
            <div className="w-100 d-flex alig-items-center flex-column gap-3 message-skel">
              <div className="input-straight"></div>
              <div className="input-straight w-50"></div>
            </div>
          </div>

            </div>
            )
        }
        </div>
        {/* <button class="custom-btn btn-11">Read More 1<div class="dot"></div></button> */}
      </section>
    </div>
  );
};

export default Skeleton;

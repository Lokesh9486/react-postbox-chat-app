import {NavLink} from "react-router-dom";

export const LinkComponent = ({ image, active, path }) => {
  return (
    <li>
      <NavLink to={path} className={({ isActive }) => isActive ? "active" : "" }>
          <img
            src={`assets/images/${image}.png`}
            alt="demo-image"
            className="sidebar-img"
          />
      </NavLink>
    </li>
  );
};

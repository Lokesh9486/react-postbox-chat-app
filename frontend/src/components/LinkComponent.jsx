import {Link, useLocation} from "react-router-dom";

export const LinkComponent = ({ image, active, path }) => {
  const location = useLocation();
  return (
    <li className={location.pathname == path ? "active" : ""}>
      <Link href="/">
          <img
            src={`assets/images/${location.pathname == path ? active : image}.jpg`}
            alt="demo-image"
            className="w-100"
          />
      </Link>
    </li>
  );
};

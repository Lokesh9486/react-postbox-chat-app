import {Link, useLocation} from "react-router-dom";

export const LinkComponent = ({ image, active, path }) => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <li className={location.pathname == path ? "active" : ""}>
      <Link href="/">
        <div>
          <img
            src={`assets/images/${location.pathname == path ? active : image}.jpg`}
            width="100%"
            height="100%"
            alt="demo-image"
          />
        </div>
      </Link>
    </li>
  );
};

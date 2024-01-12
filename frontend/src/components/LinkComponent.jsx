import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LinkComponent = ({ image, active, path }) => {
  const router = usePathname();
  return (
    <li className={router == path ? "active" : ""}>
      <Link href="/">
        <div>
          <Image
            src={`/images/${router == path ? active : image}.jpg`}
            width="100%"
            height="100%"
            objectFit="contain"
            alt="demo-image"
          />
        </div>
      </Link>
    </li>
  );
};

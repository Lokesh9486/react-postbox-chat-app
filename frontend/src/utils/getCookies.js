// import { getCookie } from 'cookies-next';

const getCookies=()=>{
    const pattern = RegExp("token=.[^;]*");
    const matched = document.cookie.match(pattern);
    if(matched){
        const [, token] = matched?.[0]?.split("=");
    //    const token= getCookie('token');
    //     console.log("getCookies ~ token:", token)
        return token;
    }
}

export default getCookies;
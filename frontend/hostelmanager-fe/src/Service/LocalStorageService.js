export default function getToken(){
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
}
export function setToken(token) {
    localStorage.setItem('token', token);
}
export function removeToken() {
    localStorage.removeItem('token');
}

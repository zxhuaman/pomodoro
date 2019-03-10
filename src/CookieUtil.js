export default class CookieUtil {
    static get(name) {
        const cookieName = encodeURIComponent(name) + '=';
        const start = document.cookie.indexOf(cookieName);
        let cookieValue = null;
        if (start > -1) {
            let end = document.cookie.indexOf(';', start);
            if (end == -1) {
                end = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(start + cookieName.length, end));
        }
        return cookieValue;
    }

    static set(name, value, expires, path, domain, secure) {
        let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        if (expires) {
            cookieText += '; expires=' + expires.toGMTString();
        }

        if (path) {
            cookieText += '; path=' + path;
        }

        if (domain) {
            cookieText += '; domain=' + domain;
        }

        if (secure) {
            cookieText += '; secure'
        }

        document.cookie = cookieText;
    }

    static unset(name, value, path, domain, secure) {
        this.set(name, '', new Date(0), path, domain, secure);
    }
}
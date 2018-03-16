export const COOKIES = Object.freeze({
  IMAGE_BASE_URL: 'imageBaseUrl',
});

export class Cookies {
  /* Sets a cookie */
  static set = (name, value, days = 1, path = '/') => {
    const expires = new Date(Date.now() + (days * 864e5)).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}`;
  }

  /* Retrieves a cookie based on its name.
  Returns the cookie value if found or null. */
  static get = (name) => {
    const value = document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
    return (value === '') ? null : value;
  }

  /* Deletes a cookie */
  static delete = (name, path = '/') => {
    Cookies.setCookie(name, '', -1, path);
  }
}

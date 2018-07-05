import Cookies from "js-cookie";

export default class Debug {
  constructor(tag, tag2) {
    this.tag = tag + tag2;
    this.cookieKey = "webrtcDebug";
  }

  log(text, other) {
    this.l("log", text, other);
  }

  error(text, other) {
    this.l("error", text, other);
  }

  l(kind, text, other) {
    let loggerFn = kind === "error" ? console.error : console.debug;
    let tag = `[${this.tag}]: `;
    if (this.isDebug()) {
      if (other) {
        loggerFn(tag + text, other);
      } else {
        loggerFn(tag + text);
      }
    }
  }

  isDebug() {
    if (Cookies.get(this.cookieKey)) {
      return true;
    }
    return false;
  }
}

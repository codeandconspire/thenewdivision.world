var html = require('choo/html')

exports.medium = function () {
  return html`
    <span class="Icon Icon--medium">
      <svg width="980" height="830" viewBox="0 0 980 830" class="Icon-image">
        <path fill="currentColor" d="M327 155v642c0 9-3 17-7 23-5 6-11 10-20 10-6 0-12-2-18-5L27 698c-7-4-14-10-19-19-5-8-8-17-8-25V31c0-8 2-14 6-19 3-5 8-8 15-8 6 0 14 3 25 8l279 140 2 3zm35 56l292 473-292-145V211zm618 9v577c0 9-3 16-8 22s-12 8-20 8c-9 0-18-2-26-7L685 700l295-480zm-2-65L838 384 674 651 461 304 638 16c6-10 15-15 28-15 5 0 10 1 14 3l296 148c2 0 2 1 2 3z"/>
      </svg>
    </span>
  `
}

exports.facebook = function () {
  return html`
    <span class="Icon Icon--facebook">
      <svg width="413" height="413" viewBox="0 0 413 413" class="Icon-image">
        <path fill="currentColor" d="M349 1H69C33 1 1 27 1 63v281c0 36 32 69 68 69h173V246l-33-1v-56h33l1-54c1-14 6-28 17-38 13-12 31-17 48-17h55v58h-36c-7-1-15 5-16 12v39h52c-1 18-4 37-7 56l-45 1v166h38c37 0 63-32 63-68V63c1-36-26-62-63-62z"/>
      </svg>
    </span>
  `
}

exports.twitter = function () {
  return html`
    <span class="Icon Icon--twitter">
      <svg width="612" height="498" viewBox="0 0 612 498" class="Icon-image">
        <path fill="currentColor" d="M612 59c-23 10-47 17-72 20 26-15 46-40 55-69-24 14-51 24-80 30a125 125 0 0 0-217 86c0 10 1 19 3 29-104-6-196-56-258-132a125 125 0 0 0 39 168c-21-1-40-6-57-16v2c0 61 43 111 100 123a127 127 0 0 1-56 2c16 50 62 86 117 87A252 252 0 0 1 0 441a355 355 0 0 0 550-301l-1-16c25-17 46-40 63-65z"/>
      </svg>
    </span>
  `
}

exports.instagram = function () {
  return html`
    <span class="Icon Icon--instagram">
      <svg width="504" height="504" viewBox="0 0 504 504" class="Icon-image">
        <g fill="currentColor">
          <path d="M252 45c67 0 75 1 102 2 24 1 38 5 47 9a78 78 0 0 1 48 48c3 8 7 22 8 46 1 27 2 35 2 102s-1 75-2 102c-1 24-5 38-9 47-8 22-25 39-47 47-9 4-23 8-47 9-27 1-35 2-102 2s-75-1-102-2c-24-1-38-5-47-9a78 78 0 0 1-48-48c-3-8-7-22-8-46-1-27-2-35-2-102s1-75 2-102c1-24 5-38 9-47a78 78 0 0 1 48-48c8-3 22-7 46-8 27-1 35-2 102-2zm0-45c-68 0-77 0-104 2-27 1-45 5-61 11-17 7-32 17-45 29-12 13-22 28-29 45-6 16-10 34-11 61-2 27-2 36-2 104s0 77 2 104c1 27 5 45 11 61 7 17 17 32 29 45 13 12 28 22 45 29 16 6 34 10 61 11 27 2 36 2 104 2s77 0 104-2c27-1 45-5 61-11 34-13 61-40 74-74 6-16 10-34 11-61 2-27 2-36 2-104s0-77-2-104c-1-27-5-45-11-61-7-17-17-32-29-45-13-12-28-22-45-29-16-6-34-10-61-11-27-2-36-2-104-2z"/>
          <path d="M252 123a129 129 0 1 0 0 258 129 129 0 0 0 0-258zm0 213a84 84 0 1 1 0-168 84 84 0 0 1 0 168z"/>
          <circle cx="386" cy="118" r="30"/>
        </g>
      </svg>
    </span>
  `
}

exports.linkedin = function () {
  return html`
    <span class="Icon Icon--linkedin">
      <svg width="19" height="19" viewBox="0 0 19 19" class="Icon-image">
        <path fill="currentColor" d="M5 19H1V7h4v12zM3 5.4A2.4 2.4 0 0 1 .6 3C.6 1.7 1.7.6 3 .6 4.3.6 5.4 1.7 5.4 3c0 1.3-1.1 2.4-2.4 2.4zM19 19h-4v-6c0-1.6-.4-3.2-2-3.2s-2 1.6-2 3.2v6H7V7h4v1.4h.2c.5-1 1.8-1.8 3.3-1.8C18.2 6.6 19 9 19 12v7z"/>
      </svg>
    </span>
  `
}

var html = require('choo/html')

exports.medium = function (opts = {}) {
  return html`
    <span class="Icon Icon--medium ${opts.brand ? 'Icon--brand' : ''}">
      <svg width="980" height="830" viewBox="0 0 980 830" class="Icon-image">
        <path fill="currentColor" d="M327 155v642c0 9-3 17-7 23-5 6-11 10-20 10-6 0-12-2-18-5L27 698c-7-4-14-10-19-19-5-8-8-17-8-25V31c0-8 2-14 6-19 3-5 8-8 15-8 6 0 14 3 25 8l279 140 2 3zm35 56l292 473-292-145V211zm618 9v577c0 9-3 16-8 22s-12 8-20 8c-9 0-18-2-26-7L685 700l295-480zm-2-65L838 384 674 651 461 304 638 16c6-10 15-15 28-15 5 0 10 1 14 3l296 148c2 0 2 1 2 3z"/>
      </svg>
    </span>
  `
}

exports.facebook = function (opts = {}) {
  return html`
    <span class="Icon Icon--facebook ${opts.brand ? 'Icon--brand' : ''}">
      <svg width="413" height="413" viewBox="0 0 413 413" class="Icon-image">
        <path fill="currentColor" d="M349 1H69C33 1 1 27 1 63v281c0 36 32 69 68 69h173V246l-33-1v-56h33l1-54c1-14 6-28 17-38 13-12 31-17 48-17h55v58h-36c-7-1-15 5-16 12v39h52c-1 18-4 37-7 56l-45 1v166h38c37 0 63-32 63-68V63c1-36-26-62-63-62z"/>
      </svg>
    </span>
  `
}

exports.twitter = function (opts = {}) {
  return html`
    <span class="Icon Icon--twitter ${opts.brand ? 'Icon--brand' : ''}">
      <svg width="612" height="498" viewBox="0 0 612 498" class="Icon-image">
        <path fill="currentColor" d="M612 59c-23 10-47 17-72 20 26-15 46-40 55-69-24 14-51 24-80 30a125 125 0 0 0-217 86c0 10 1 19 3 29-104-6-196-56-258-132a125 125 0 0 0 39 168c-21-1-40-6-57-16v2c0 61 43 111 100 123a127 127 0 0 1-56 2c16 50 62 86 117 87A252 252 0 0 1 0 441a355 355 0 0 0 550-301l-1-16c25-17 46-40 63-65z"/>
      </svg>
    </span>
  `
}

exports.instagram = function (opts = {}) {
  return html`
    <span class="Icon Icon--instagram ${opts.brand ? 'Icon--brand' : ''}">
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

exports.linkedin = function (opts = {}) {
  return html`
    <span class="Icon Icon--linkedin ${opts.brand ? 'Icon--brand' : ''}">
      <svg width="19" height="19" viewBox="0 0 19 19" class="Icon-image">
        <path fill="currentColor" d="M5 19H1V7h4v12zM3 5.4A2.4 2.4 0 0 1 .6 3C.6 1.7 1.7.6 3 .6 4.3.6 5.4 1.7 5.4 3c0 1.3-1.1 2.4-2.4 2.4zM19 19h-4v-6c0-1.6-.4-3.2-2-3.2s-2 1.6-2 3.2v6H7V7h4v1.4h.2c.5-1 1.8-1.8 3.3-1.8C18.2 6.6 19 9 19 12v7z"/>
      </svg>
    </span>
  `
}

/**
 * Note that this version logo was altered to work better in small sizes.
 * "Know the rules well, so you can break them effectively" :)
 */

exports.globalgoals = function () {
  return html`
    <svg class="Icon Icon--brand" width="22" height="22" viewBox="0 0 22 22">
      <g fill="none" stroke="#FFF" stroke-width=".25" transform="translate(1 1)">
        <path fill="#56C02B" d="M5.16344371,7.14933775 C5.41178808,6.72741722 5.71298013,6.34066225 6.05821192,5.99827815 L3.12417219,2.78099338 C2.38596026,3.48642384 1.75649007,4.30423841 1.26139073,5.20562914 L5.16344371,7.14933775"/>
        <path fill="#DDA63A" d="M12.3560927,4.87649007 C12.8003311,5.08006623 13.2135099,5.33980132 13.5864238,5.64735099 L16.5288079,2.43496689 C15.7538411,1.76668874 14.8750993,1.21529801 13.9211921,0.80807947 L12.3560927,4.87649007"/>
        <path fill="#C5192D" d="M19.0943709,5.84384106 L15.1946358,7.78781457 C15.3809272,8.22251656 15.5133113,8.68417219 15.5850993,9.16569536 L19.9231126,8.75622517 C19.7951656,7.7292053 19.5108609,6.74993377 19.0943709,5.84384106"/>
        <path fill="#4C9F38" d="M14.9148344,7.22423841 L18.814106,5.2805298 C18.3310596,4.38304636 17.7150331,3.56768212 16.9919868,2.8613245 L14.0496026,6.07291391 C14.3847682,6.41721854 14.6761589,6.80384106 14.9148344,7.22423841"/>
        <path fill="#3F7E44" d="M4.38854305,9.99543046 C4.38854305,9.90774834 4.39145695,9.82006623 4.39523179,9.73291391 L0.0562251656,9.34443709 C0.0426490066,9.55953642 0.0343046358,9.77662252 0.0343046358,9.99543046 C0.0343046358,10.8276821 0.137682119,11.6362252 0.329801325,12.4089404 L4.52046358,11.206755 C4.43456954,10.8162914 4.38854305,10.411457 4.38854305,9.99543046"/>
        <path fill="#FCC30B" d="M14.3687417,13.5617881 C14.0603311,13.9371523 13.7043709,14.2717881 13.3105298,14.5572185 L15.6015232,18.2664901 C16.4517881,17.6903974 17.2087417,16.986755 17.8450331,16.1831126 L14.3687417,13.5617881"/>
        <path fill="#FF3A21" d="M15.6456954,9.99543046 C15.6456954,10.4062914 15.6015232,10.8068212 15.516755,11.1927152 L19.7068874,12.3966225 C19.897947,11.6272848 19.9998013,10.8229139 19.9998013,9.99543046 C19.9998013,9.78993377 19.9929801,9.58596026 19.9803974,9.38278146 L15.6417881,9.79251656 C15.6441722,9.86039735 15.6456954,9.92768212 15.6456954,9.99543046"/>
        <path fill="#FD9D24" d="M5.73576159,13.644702 L2.26768212,16.2805298 C2.91271523,17.074702 3.67662252,17.7669536 4.53251656,18.3321854 L6.82304636,14.6269536 C6.41953642,14.347947 6.05390728,14.0172185 5.73576159,13.644702"/>
        <path fill="#0A97D9" d="M4.45880795,9.10688742 C4.53642384,8.61675497 4.67847682,8.14801325 4.87437086,7.70900662 L0.976225166,5.76688742 C0.545496689,6.68357616 0.250198675,7.67576159 0.11589404,8.71741722 L4.45880795,9.10688742"/>
        <path fill="#A21942" d="M15.0686093,18.6019868 L12.7809934,14.8976821 C12.3653642,15.1323179 11.9176821,15.3164901 11.445894,15.4401325 L12.253245,19.7252318 C13.2576821,19.4945033 14.2048344,19.1113907 15.0686093,18.6019868"/>
        <path fill="#26BDE2" d="M15.3498013,11.7994702 C15.1980795,12.2450331 14.9929139,12.6655629 14.7407947,13.0535762 L18.2198675,15.6777483 C18.7849669,14.8653642 19.2315894,13.9657616 19.5366225,13.002649 L15.3498013,11.7994702"/>
        <path fill="#FD6925" d="M10.8289404,15.5652318 C10.564106,15.6035099 10.2930464,15.6243709 10.0170861,15.6243709 C9.79549669,15.6243709 9.57668874,15.6105298 9.36192053,15.5855629 L8.55496689,19.8707947 C9.03258278,19.9408609 9.52046358,19.9780132 10.0170861,19.9780132 C10.5680132,19.9780132 11.1087417,19.9327152 11.6354305,19.8465563 L10.8289404,15.5652318"/>
        <path fill="#E5243B" d="M10.3769536,4.37794702 C10.8604636,4.40900662 11.3274172,4.50099338 11.7698675,4.64688742 L13.3347682,0.579668874 C12.4037086,0.250860927 11.4104636,0.0562251656 10.3769536,0.0198675497 L10.3769536,4.37794702"/>
        <path fill="#DD1367" d="M8.7415894,15.4784106 C8.25370861,15.3646358 7.79006623,15.1874172 7.35993377,14.955894 L5.06794702,18.6629139 C5.94966887,19.1676159 6.91370861,19.5413245 7.93549669,19.7590066 L8.7415894,15.4784106"/>
        <path fill="#19486A" d="M8.32556291,4.62682119 C8.77748344,4.48390728 9.25423841,4.39688742 9.74748344,4.37384106 L9.74748344,0.0163576159 C8.69993377,0.0443046358 7.69357616,0.235099338 6.74986755,0.562450331 L8.32556291,4.62682119"/>
        <path fill="#BF8B2E" d="M5.35410596,13.1439735 C5.07768212,12.7356291 4.85211921,12.2884768 4.69006623,11.8130464 L0.502384106,13.0147682 C0.819536424,14.0135762 1.28953642,14.9442384 1.88556291,15.7798013 L5.35410596,13.1439735"/>
        <path fill="#00689D" d="M6.5297351,5.5805298 C6.89768212,5.28907285 7.30264901,5.04344371 7.73675497,4.85006623 L6.16198675,0.787748344 C5.22410596,1.18152318 4.35986755,1.71476821 3.59364238,2.36072848 L6.5297351,5.5805298"/>
      </g>
    </svg>
  `
}

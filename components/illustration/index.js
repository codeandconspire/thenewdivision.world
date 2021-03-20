const html = require('choo/html')
const nanoraf = require('nanoraf')
const Component = require('choo/component')
const { vh } = require('../base')

module.exports = class Illustration extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
  }

  update () {
    return false
  }

  load (element) {
    let inview
    let offset, viewport
    const onscroll = nanoraf(function () {
      const { scrollY } = window
      if (scrollY > (offset - (viewport / 6))) {
        if (inview) element.style.setProperty('--Illustration-offset', 1)
        return
      }
      if (scrollY + viewport < offset) {
        if (inview) element.style.setProperty('--Illustration-offset', 0)
        return
      }
      const ratio = 1 - (((offset - (viewport / 6)) - scrollY) / (viewport))
      element.style.setProperty('--Illustration-offset', ratio.toFixed(3))
      inview = true
    })

    const onresize = nanoraf(function () {
      offset = element.offsetTop
      viewport = vh()
      let parent = element
      while ((parent = parent.offsetParent)) offset += parent.offsetTop
      onscroll()
    })

    onresize()
    onscroll()
    window.addEventListener('resize', onresize)
    window.addEventListener('scroll', onscroll, { passive: true })
    return function () {
      window.removeEventListener('resize', onresize)
      window.removeEventListener('scroll', onscroll)
    }
  }

  createElement (version) {
    return html`
      <div class="Illustration Illustration--${version}">
        ${version === '1' ? html`
          <svg class="Illustration-stars" height="1046" viewBox="0 0 1148 1046" width="1148">
            <g fill="var(--color-text)"><circle cx="139.44" cy="282" r="2"/><circle cx="144.76" cy="151.64" r="2"/><circle cx="244.52" cy="716.96" r="2"/><circle cx="3.1" cy="332.1" r="3.1"/><circle cx="201.29" cy="623.85" r="3.1"/><circle cx="137.44" cy="389.74" r="4.83"/><circle cx="217.25" cy="536.06" r="4.83"/><circle cx="77.59" cy="629.66" r="4.83"/><circle cx="1023.33" cy="298.63" r="2"/><circle cx="932.88" cy="2" r="2"/><circle cx="1145.71" cy="430.31" r="2"/><circle cx="980.1" cy="590.6" r="2"/><circle cx="922.68" cy="264.71" r="3.1"/><circle cx="932.88" cy="397.73" r="3.1"/><circle cx="1128.42" cy="657.55" r="3.1"/><circle cx="1085.85" cy="225.65" r="4.83"/><circle cx="1056.59" cy="530.74" r="4.83"/><circle cx="1026.66" cy="840" r="8.02"/><circle cx="915.1" cy="665.09" r="4.83"/><circle cx="853.07" cy="1040.37" r="4.83"/><circle cx="908.94" cy="507.29" r="4.83"/></g>
          </svg>
          <div class="Illustration-planet js-planet">
            <svg class="Illustration-line1" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)" transform="translate(43.35 66.48)"><path d="m142.35 484.99 246.99-484.41-82.68 511"/><path d="m531.7 285.8-531.7-86.03 506.47-80.09"/><path d="m506.47 119.68-481.25 246.21"/><path d="m265.57 242.63 111.28-22.78 14.59 87.77"/></g></g>
            </svg>
            <svg class="Illustration-line2" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)" transform="translate(43.35 40.48)"><path d="m25.22 391.89 364.12-365.31-389.34 199.19"/><path d="m531.7 311.8-306.67-311.8 281.44 145.68"/><path d="m142.35 510.99 82.68-510.99-199.81 391.89"/><path d="m306.66 537.58-230.34-461.5 66.03 434.91"/><path d="m455.37 461.49-455.37-235.72 306.66 311.81"/><path d="m531.7 311.8-506.48 80.09 430.15 69.6"/><path d="m306.66 537.58 199.81-391.9-51.1 315.81"/><path d="m376.92 246.06 154.57 66.02"/></g></g>
            </svg>
            <svg class="Illustration-line3" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g transform="translate(29.33 26.46)"><path d="m403.36 40.6-164.31-26.58-148.71 76.08-76.32 149.69 25.22 166.12 117.13 119.1 164.31 26.59 148.71-76.09 76.33-149.69-25.23-166.12z" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m469.39 475.51-66.03-434.91 142.36 285.22" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m90.34 90.1 313.02-49.5" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m14.02 239.79 225.03-225.77" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m520.49 159.7-430.15-69.6" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m39.24 405.91 51.1-315.81" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m156.37 525.01-142.35-285.22" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m320.68 551.6-281.44-145.69" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m520.49 159.7-364.12 365.31 389.35-199.19" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m469.39 475.51-313.02 49.5" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m545.72 325.82-225.04 225.78" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m187.96 329.79 76.41-150.05" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m390.7 259.8-34.64-126.57" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m390.87 259.66 37.79-52.73" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m115.68 256.35 72.2 73.47-43.05-130.65" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m356.06 133.35-92.35 46.84" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><g fill-rule="nonzero"><circle cx="239.05" cy="14.02" fill="#646464" opacity=".5" r="14.02"/><circle cx="403.36" cy="40.6" fill="#646464" opacity=".5" r="14.02"/><circle cx="520.49" cy="159.7" fill="#646464" opacity=".5" r="14.02"/><circle cx="545.72" cy="325.82" fill="#646464" opacity=".5" r="14.02"/><circle cx="469.39" cy="475.51" fill="#646464" opacity=".5" r="14.02"/><circle cx="320.68" cy="551.6" fill="#646464" opacity=".5" r="14.02"/><circle cx="156.37" cy="525.01" fill="#646464" opacity=".5" r="14.02"/><circle cx="39.24" cy="405.91" fill="#646464" opacity=".5" r="14.02"/><circle cx="14.02" cy="239.79" fill="#646464" opacity=".5" r="14.02"/><circle cx="90.34" cy="90.1" fill="#646464" opacity=".5" r="14.02"/><circle cx="115.68" cy="256.35" fill="#afafaf" r="2.8"/><circle cx="131.46" cy="358.83" fill="#afafaf" r="1.95"/><circle cx="204.02" cy="432.31" fill="#afafaf" r="1.95"/><circle cx="361.77" cy="419.73" fill="#afafaf" r="1.95"/><circle cx="428.66" cy="206.93" fill="#afafaf" r="1.95"/><circle cx="352.13" cy="356.38" fill="#afafaf" r="1.95"/><circle cx="405.84" cy="347.87" fill="#afafaf" r="1.95"/><circle cx="144.92" cy="199.4" fill="#afafaf" r="1.95"/><circle cx="144.83" cy="199.29" fill="#646464" opacity=".5" r="5.18"/><circle cx="187.8" cy="330.25" fill="#646464" opacity=".5" r="8.93"/><circle cx="263.71" cy="180.19" fill="#646464" opacity=".5" r="8.93"/><circle cx="361.77" cy="418.96" fill="#646464" opacity=".5" r="16.21"/><circle cx="390.87" cy="259.87" fill="#646464" opacity=".5" r="11.27"/><circle cx="356.06" cy="133.35" fill="#646464" opacity=".5" r="6.3"/><circle cx="203.89" cy="432.31" fill="#646464" opacity=".5" r="18.32"/><circle cx="405.46" cy="347.64" fill="#646464" opacity=".5" r="6.93"/><circle cx="428.24" cy="207.54" fill="#646464" opacity=".5" r="11.26"/><circle cx="115.68" cy="256.35" fill="#646464" opacity=".5" r="10.17"/><circle cx="86.38" cy="313.9" fill="#646464" opacity=".5" r="5.72"/></g><path d="m320.68 551.6-81.63-537.58 230.34 461.49" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m469.39 475.51-379.05-385.41 455.38 235.72" stroke="#7d7d7d" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/></g></g>
            </svg>
            <svg class="Illustration-dots" height="618" viewBox="0 0 618 618" width="618">
              <g fill="none" fill-rule="evenodd"><path d="m0 0h618v618h-618z"/><g fill-rule="nonzero"><circle cx="268.38" cy="40.48" fill="var(--color-text)" r="5.16"/><circle cx="432.69" cy="67.06" fill="var(--color-text)" r="5.16"/><circle cx="549.82" cy="186.16" fill="var(--color-text)" r="5.16"/><circle cx="575.05" cy="352.28" fill="var(--color-text)" r="5.16"/><circle cx="498.72" cy="501.97" fill="var(--color-text)" r="5.16"/><circle cx="350.01" cy="578.06" fill="var(--color-text)" r="5.16"/><circle cx="185.7" cy="551.47" fill="var(--color-text)" r="5.16"/><circle cx="68.57" cy="432.37" fill="var(--color-text)" r="5.16"/><circle cx="119.67" cy="116.56" fill="var(--color-text)" r="5.16"/><circle cx="145.01" cy="282.81" fill="#afafaf" r="2.8"/><circle cx="233.35" cy="458.77" fill="#afafaf" r="1.95"/><circle cx="391.1" cy="446.19" fill="#afafaf" r="1.95"/><circle cx="457.99" cy="233.39" fill="#afafaf" r="1.95"/><circle cx="435.17" cy="374.33" fill="#afafaf" r="1.95"/><circle cx="174.25" cy="225.86" fill="#afafaf" r="1.95"/><g fill="var(--color-text)"><circle cx="309.26" cy="309.28" r="14.02"/><circle cx="174.16" cy="225.75" r="2.18"/><circle cx="217.13" cy="356.71" r="3.76"/><circle cx="293.04" cy="206.65" r="3.76"/><circle cx="391.1" cy="445.42" r="6.82"/><circle cx="420.2" cy="286.33" r="4.15"/><circle cx="385.39" cy="159.81" r="2.32"/><circle cx="233.22" cy="458.77" r="6.75"/><circle cx="434.79" cy="374.1" r="2.55"/><circle cx="457.57" cy="234" r="4.15"/><circle cx="145.01" cy="282.81" r="3.75"/><circle cx="115.71" cy="340.36" r="2.11"/><circle cx="43.35" cy="266.25" r="5.16"/></g></g></g>
            </svg>
          </div>
        ` : null}

        ${version === '2' ? html`
          <svg class="Illustartion-papers" height="527" viewBox="0 0 526 527" width="526">
            <g fill="none" fill-rule="evenodd" stroke="var(--color-text)">
              <g class="Illustration-paper">
                <g>
                  <path d="m26.079115 51.261866h253.388527v347.174281h-253.388527z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)" transform="matrix(.98794473 -.15480702 .15480702 .98794473 -32.966479 26.361006)"/>
                  <g stroke-width="var(--Illustration-stroke-width)"><path d="m47 127.44 96.45-15.11"/><path d="m49.89 145.86 178.81-28.01"/><path d="m52.78 164.29 170.14-26.66"/><path d="m55.66 182.71 178.82-28.02"/><path d="m58.55 201.13 155.51-24.36"/><path d="m61.44 219.56 178.81-28.02"/><path d="m64.32 237.98 169.61-26.57"/><path d="m67.21 256.4 178.81-28.01"/><path d="m70.1 274.83 72.06-11.29"/><path d="m72.98 293.25 156.06-24.45"/><path d="m75.87 311.68 178.81-28.02"/><path d="m78.76 330.1 171.77-26.92"/><path d="m81.64 348.52 178.82-28.02"/><path d="m84.53 366.95 169.6-26.58"/></g>
                </g>
              </g>
              <g class="Illustration-paper">
                <g>
                  <path d="m227.261626 30.01898h253.404699v347.196439h-253.404699z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)" transform="matrix(.95778224 -.28749467 .28749467 .95778224 -43.595293 110.35902)"/><path d="m236 121.28 93.51-28.07" stroke-width="var(--Illustration-stroke-width)"/><path d="m241.36 139.14 173.36-52.04" stroke-width="var(--Illustration-stroke-width)"/><path d="m246.72 157 164.95-49.52" stroke-width="var(--Illustration-stroke-width)"/><path d="m252.09 174.86 173.35-52.04" stroke-width="var(--Illustration-stroke-width)"/><path d="m257.45 192.72 150.76-45.26" stroke-width="var(--Illustration-stroke-width)"/><path d="m262.81 210.58 173.35-52.04" stroke-width="var(--Illustration-stroke-width)"/><path d="m268.17 228.44 164.43-49.36" stroke-width="var(--Illustration-stroke-width)"/><path d="m273.53 246.31 173.36-52.05" stroke-width="var(--Illustration-stroke-width)"/><path d="m278.9 264.17 69.86-20.98" stroke-width="var(--Illustration-stroke-width)"/><path d="m284.26 282.03 151.29-45.42" stroke-width="var(--Illustration-stroke-width)"/><path d="m289.62 299.89 173.35-52.05" stroke-width="var(--Illustration-stroke-width)"/><path d="m294.98 317.75 166.53-50" stroke-width="var(--Illustration-stroke-width)"/><path d="m300.35 335.61 173.35-52.05" stroke-width="var(--Illustration-stroke-width)"/><path d="m305.71 353.47 164.42-49.36" stroke-width="var(--Illustration-stroke-width)"/>
                </g>
              </g>
              <g class="Illustration-paper">
                <g>
                  <path d="m148.903993 79.720224h253.410344v347.204172h-253.410344z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)" transform="matrix(.99915921 -.04099833 .04099833 .99915921 -10.154064 11.512506)"/>
                </g>
              </g>
              <g class="Illustration-paper">
                <g>
                  <path d="m159.09398 116.997473h253.410706v347.204668h-253.410706z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)" transform="matrix(.98845824 -.1514936 .1514936 .98845824 -40.725384 46.650805)"/>
                </g>
              </g>
              <g class="Illustration-paper">
                <g>
                  <path d="m163.838364 139.793936h253.396686v347.185459h-253.396686z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)" transform="matrix(.87781148 -.47900627 .47900627 .87781148 -114.613927 177.461157)"/><path d="m158.05 257.33 85.7-46.77" stroke-width="var(--Illustration-stroke-width)"/><path d="m166.98 273.7 158.88-86.7" stroke-width="var(--Illustration-stroke-width)"/><path d="m175.91 290.07 151.18-82.5" stroke-width="var(--Illustration-stroke-width)"/><path d="m184.84 306.44 158.89-86.7" stroke-width="var(--Illustration-stroke-width)"/><path d="m193.78 322.81 138.18-75.4" stroke-width="var(--Illustration-stroke-width)"/><path d="m202.71 339.18 158.88-86.7" stroke-width="var(--Illustration-stroke-width)"/><path d="m211.64 355.55 150.7-82.23" stroke-width="var(--Illustration-stroke-width)"/><path d="m220.57 371.92 158.89-86.7" stroke-width="var(--Illustration-stroke-width)"/><path d="m229.51 388.29 64.03-34.95" stroke-width="var(--Illustration-stroke-width)"/><path d="m238.44 404.65 138.66-75.66" stroke-width="var(--Illustration-stroke-width)"/><path d="m247.37 421.02 158.88-86.69" stroke-width="var(--Illustration-stroke-width)"/><path d="m256.3 437.39 152.63-83.28" stroke-width="var(--Illustration-stroke-width)"/><path d="m265.23 453.76 158.89-86.69" stroke-width="var(--Illustration-stroke-width)"/><path d="m274.17 470.13 150.7-82.23" stroke-width="var(--Illustration-stroke-width)"/>
                </g>
              </g>
            </g>
          </svg>
          <svg class="Illustartion-pencil" height="226" viewBox="0 0 76 226" width="76">
            <g fill="none" fill-rule="evenodd" transform="translate(1 1)"><g stroke="var(--color-text)" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"><path d="m72.77 54.1-47.29 170.03-25.48-6.94 47.33-170.17c.38-1.38 1.21-2.36 1.85-2.19l23.14 6.44c.63.18.83 1.44.45 2.83z"/><path d="m65.18 49.34-47.93 172.34"/><path d="m56.88 47.03-47.93 172.34"/><path d="m72.93 53.35 1.63-53.34-26.95 46.19"/></g><path d="m73.74 25.58-12.05-3.53 12.82-22.05z" fill="var(--color-text)" fill-rule="nonzero"/></g>
          </svg>
          <svg class="Illustartion-goals" height="451" viewBox="0 0 465 451" width="465"><g fill="none" fill-rule="evenodd" stroke="var(--color-text)" transform="translate(1 1)">
            <g fill="var(--color-background)"><path d="m108.7 151.17c5.26-8.94 11.65-17.14 18.96-24.4l-62.19-68.19c-15.65 14.95-28.99 32.28-39.48 51.39z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m261.15 103c9.42 4.31 18.17 9.82 26.08 16.34l62.36-68.08c-16.42-14.16-35.05-25.85-55.27-34.48z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m403.96 123.5-82.65 41.2c3.95 9.21 6.75 19 8.28 29.2l91.94-8.68c-2.72-21.76-8.74-42.52-17.57-61.72" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m315.38 152.76 82.64-41.2c-10.24-19.02-23.29-36.3-38.62-51.27l-62.36 68.07c7.1 7.29 13.28 15.49 18.34 24.4" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m92.28 211.49c0-1.86.06-3.72.14-5.56l-91.96-8.23c-.29 4.56-.46 9.16-.46 13.8 0 17.64 2.19 34.78 6.26 51.15l88.82-25.48c-1.83-8.28-2.8-16.86-2.8-25.68" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m356.85 365.19c7.41-7.01 14.31-14.55 20.65-22.55h-.02l-73.68-55.56c-6.54 7.96-14.08 15.05-22.43 21.1l48.56 78.62" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m330.87 211.49c0 8.71-.94 17.2-2.73 25.38l88.81 25.52c4.05-16.31 6.21-33.35 6.21-50.89 0-4.36-.14-8.68-.41-12.98l-91.95 8.68c.04 1.43.07 2.86.07 4.29" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m93.77 192.66c1.65-10.39 4.66-20.32 8.81-29.63l-82.62-41.16c-9.13 19.43-15.39 40.46-18.23 62.53z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m324.6 249.73c-3.22 9.44-7.56 18.36-12.91 26.58l73.74 55.62c11.98-17.22 21.44-36.28 27.91-56.7z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m228.78 329.54c-5.61.81-11.36 1.25-17.21 1.25-4.7 0-9.33-.29-13.89-.82l-17.1 90.82c10.12 1.48 20.46 2.27 30.99 2.27 11.68 0 23.14-.96 34.3-2.79z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m219.2 92.43c10.25.66 20.14 2.61 29.52 5.7l33.17-86.2c-19.73-6.97-40.78-11.09-62.69-11.86z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m175.72 97.71c9.58-3.03 19.68-4.87 30.14-5.36v-92.35c-22.2.59-43.53 4.64-63.53 11.57z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m112.74 278.22c-5.86-8.65-10.64-18.13-14.07-28.21l-88.76 25.47c6.72 21.17 16.68 40.89 29.32 58.6z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m137.66 117.92c7.8-6.18 16.38-11.38 25.58-15.48l-33.38-86.1c-19.88 8.35-38.19 19.65-54.43 33.34z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m121.28 288.87-73.52 55.88c13.67 16.84 29.87 31.51 48.01 43.49l48.56-78.55c-8.55-5.91-16.3-12.92-23.05-20.82" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m185.01 327.75c-10.34-2.41-20.17-6.17-29.29-11.08l-48.59 78.59c18.69 10.7 39.13 18.62 60.79 23.24z" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><path d="m417.65 430.31-33.77-1.16c-.9-.03-1.7-.59-2.05-1.42l-25-60.22c-.66-1.58.58-3.3 2.29-3.18l64.15 4.48c.86.06 1.62.6 1.96 1.39l13.49 31.61z" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)"/></g><path d="m357.36 365.27 45.22 32.59" stroke-width="var(--Illustration-stroke-width)"/><circle cx="401.17" cy="396.86" fill="var(--color-text)" fill-rule="nonzero" r="9.61"/><path d="m416.44 431.9 23.36-31.55c.31-.42.9-.51 1.32-.2l21.56 15.96c.42.31.51.9.2 1.32l-23.36 31.55c-.31.42-.9.51-1.32.2l-21.56-15.96c-.42-.31-.51-.9-.2-1.32z" fill="var(--color-background)" fill-rule="nonzero" stroke-width="var(--Illustration-stroke-width)"/></g>
          </svg>
          <svg class="Illustartion-arrow" height="249" viewBox="0 0 244 249" width="244"><g fill="none" fill-rule="evenodd">
            <path d="m66.61 2.12 45.56 46.07-110.75 109.53 87.49 88.46 110.75-109.53 42.01 42.47" stroke="#c8c8c8" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><g fill="var(--color-text)" fill-rule="nonzero"><circle cx="2.42" cy="157.93" r="2.42"/><circle cx="88.39" cy="246.18" r="2.42"/><circle cx="200.47" cy="137.44" r="2.42"/><circle cx="241.46" cy="178.02" r="2.42"/><circle cx="67.22" cy="2.42" r="2.42"/><circle cx="110.86" cy="48.31" r="2.42"/></g><path d="m241.46 178.02v-175.6h-174.24" stroke="#c8c8c8" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--Illustration-stroke-width)"/><circle cx="241.45" cy="2.44" fill="var(--color-text)" fill-rule="nonzero" r="2.42"/></g>
          </svg>
        ` : null}
      </div>
    `
  }
}

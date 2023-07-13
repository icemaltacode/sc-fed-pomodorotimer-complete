function CoffeeCup({ progress = 0, sidelength = 200 }) {
    const scaledProgress = (((100 - Number(progress)) * 80) / 100) + 20
    const brownOffset = `${scaledProgress}%`;
    const whiteOffset = `${scaledProgress + 1}%`;
    const sideLength = `${sidelength}px`;

    return <svg width={sideLength} height={sideLength} viewBox="0 0 128 128">
    <defs>
        <linearGradient id="half" x1="0" y1="1" x2="0" y2="0" spreadMethod='pad'>
            <stop offset={brownOffset} stopColor="#c87137" /> 
            <stop offset={whiteOffset} stopColor="white" />
        </linearGradient>            
    </defs>
    <g id="layer1" stroke="#000" transform="translate(-66.38 -391.32)">
      <path id="path7583" strokeLinejoin="round" d="m82.38 439.32h80c0 24-3.16 40-24 56h-32c-19.691-14.07-24-32-24-56z" fillRule="evenodd" strokeWidth="6" style={{fill:'url(#half)'}}/>
      <path id="path7585" strokeLinejoin="round" d="m74.38 487.32h96.34c-8.34 8-8.34 12.66-28.91 15.65h-38.53c-20.9-2.45-20.9-7.65-28.9-15.65z" fillRule="evenodd" strokeWidth="6" fill="#88C057"/>
      <path id="path7589" strokeLinejoin="round" d="m116.09 67.721a13.643 18.109 0 1 1 -27.284 0 13.643 18.109 0 1 1 27.284 0z" transform="matrix(.94651 .32267 -.32267 .94651 100.16 363.38)" strokeLinecap="round" strokeWidth="6" fill="none"/>
      <path id="path7593" d="m47.628 7.4419c15.257 15.917-14.094 16.96 0 33.24" transform="translate(66.38 391.32)" strokeLinecap="round" strokeWidth="4" fill="none"/>
      <path id="path7595" strokeWidth="4" strokeLinecap="round" fill="none" d="m123.93 399.26c15.26 15.92-14.09 16.96 0 33.24"/>
      <path id="path7597" strokeWidth="4" strokeLinecap="round" fill="none" d="m134.85 399.26c15.25 15.92-14.1 16.96 0 33.24"/>
    </g>
  </svg>
  }

  export default CoffeeCup;
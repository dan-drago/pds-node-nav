console.log('__BASE_HREF__', `images/sbn.png`);
console.log('__BASE_HREF__', `/images/sbn.png`);

export const PDSData: IPDSDATA = {
  'NASA: The Planetary Data System': {
    //
    icon: `images/pds.jpg`,
    websiteImage: `images/pds_nasa_homepage.png`,
    websiteUrl: 'https://pds.nasa.gov',
    about: `
        This is the NASA Planetary Data System. It consists of 'nodes' of research institutes around the United States that archive and research data generated by NASA-funded missions. ... etc ...
      `
  },
  'Small Bodies Node': {
    //
    icon: `images/sbn.png`,
    websiteUrl: '',
    websiteImage:
      'https://www.thoughtco.com/thmb/f5nOqM1DFHeOmd78BnOErkCznpY=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/solar-system-439046_1920-be1042fd410b4878b66848659193859d.jpg',
    about: `This is the Small Bodies Node. We're based at UMD in College Park, MD. We are experts in comets and asteroids. ... etc ... `
  },
  'Minor Planets Center': {
    //
    icon: `images/mpc.png`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the Minor Planet Center ...'
  },
  CATCH: {
    //
    icon: `images/catch.png`,
    websiteUrl: '',
    websiteImage: '',
    about: ''
  },
  'Planetary Science Institute': {
    //
    // icon: `images/psi.png`,
    icon: `https://pbs.twimg.com/profile_images/378800000458120805/564ec750e30282c52b1a324c0f6b13d0_400x400.png`,
    websiteUrl: '',
    websiteImage: 'images/psi_homepage.png',
    about:
      'This is the Planetary Science Institute based in Tuscon Arizona. We specialize in space dust ... etc ...'
  },
  'Legacy SBN': {
    //
    icon: `images/legacy.png`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the legacy SBN site ... etc ...'
  },
  IAWN: {
    //
    icon: `images/iawn.png`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is IAWN ... etc ...'
  },
  BSU: {
    //
    icon: `images/bsu.png`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is Bowie State Uni. .... etc. '
  },
  Engineering: {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the Engineering node ...'
  },
  Atmospheres: {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the Atmospheres node'
  },
  Geosciences: {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the Geosciences node'
  },
  'Cartography & Imaging': {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the Cartography * Imaging node ...'
  },
  'Navigational & Ancillary Information': {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is etc ...'
  },
  'Planetary Plasma Interactions': {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the plasma node ....'
  },
  'Ring-Moon Systems': {
    //
    icon: `images/scipio.jpg`,
    websiteUrl: '',
    websiteImage: '',
    about: 'This is the rings-moon systems nod ....'
  }
};

export interface IPDSDATUM {
  icon: string;
  websiteUrl: string;
  websiteImage: string;
  about: string;
}

interface IPDSDATA {
  [index: string]: IPDSDATUM;
}

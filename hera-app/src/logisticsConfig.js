import heraLogo from './assets/HERA LOGO.jpeg';
import kernLogo from './assets/kern-logo.svg';

export const LOGISTICS_CONFIG = {
  hera: {
    id: 'hera',
    label: 'Hera Logistics',
    shortName: 'HERA LOGISTICS',
    legalName: 'HERA LOGISTICS PVT.LTD.,',
    challanLegalName: 'HERA LOGISTICS PVT. LTD.',
    tagline: 'Logistics Simplified',
    address: 'No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.',
    addressLines: ['No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.'],
    phone: '96622 96633',
    gstNo: '33AAFCH8632K1ZE',
    email: '',
    website: '',
    hubLabel: 'Thoothukudi Central Hub',
    logo: heraLogo,
    pdfPrefix: 'Hera',
    accentColor: '#B91C1C'
  },
  kern: {
    id: 'kern',
    label: 'Kern Logistics',
    shortName: 'KERN LOGISTICS',
    legalName: 'KERN LOGISTICS PRIVATE LIMITED',
    challanLegalName: 'KERN LOGISTICS PRIVATE LIMITED',
    tagline: 'Logistics & Beyond',
    address: 'No.314/1A2, Chettipedu Village,Sriperumbudur Taluk, Kancheepuram District,Tamil Nadu - 602105.',
    addressLines: [
      'No.314/1A2, Chettipedu Village,Sriperumbudur Taluk,',
      'Kancheepuram District,Tamil Nadu - 602105.'
    ],
    phone: '9994215809',
    gstNo: '',
    email: 'coldstore@kernlogistics.com / kernagrostore@gmail.com',
    website: 'www.kernlogistics.com',
    hubLabel: 'Sriperumbudur Cold Hub',
    logo: kernLogo,
    pdfPrefix: 'Kern',
    accentColor: '#B91C1C'
  }
};

export const getLogisticsConfig = (logisticsId) => {
  return LOGISTICS_CONFIG[logisticsId] || LOGISTICS_CONFIG.hera;
};

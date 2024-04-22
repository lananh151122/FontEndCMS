//config.ts

enum LayoutType {
  MIX = 'mix',
  TOP = 'top',
  SIDE = 'side',
}

const CONFIG = {
  appName: 'Salepage Cms',
  helpLink: 'https://github.com/lambro2510/salepage-portal.git',
  enablePWA: true,
  theme: {
    accentColor: '#7EB2DD',
    subColor: '#80BD9E',
    sidebarLayout: LayoutType.MIX,
    showBreadcrumb: true,
  },
  metaTags: {
    title: 'Salepage Cms',
    description:
      'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    imageURL: 'logo.svg',
  },
};

export default CONFIG;

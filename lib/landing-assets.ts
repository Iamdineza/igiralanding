export type LandingAsset = { src: string; alt: string; composed?: boolean }

export const landingPageAssets = {
  logo: { src: '/igira-logo.png', alt: 'Igira Provisoire logo' },
  aboutIgiraVisual: { src: '', alt: 'Igira Provisoire platform' },
  rwandaDrivingVisual: { src: '', alt: 'Driving in Rwanda' },
  heroDesktopScreenshot: { src: '/screens-hero-desktop.png', alt: 'Igira Provisoire desktop application', composed: true },
  heroMobileScreenshot: { src: '/screens-hero-mobile.png', alt: 'Igira Provisoire mobile application', composed: true },
  heroBackgroundRoad: { src: '', alt: 'Road inspired background' },
  howItWorksVisual: { src: '', alt: 'Igira Provisoire preparation experience' },
  practiceDesktopScreenshot: { src: '/screens-desktop-practice.png', alt: 'Igira Provisoire practice interface', composed: true },
  practiceMobileScreenshot: { src: '/screens-practice-mobile.png', alt: 'Igira Provisoire practice interface on mobile', composed: true },
  mockTestDesktopScreenshot: { src: '/screens-test-desktop.png', alt: 'Igira Provisoire mock test interface', composed: true },
  mockTestMobileScreenshot: { src: '/screens-test-mobile.png', alt: 'Igira Provisoire mock test interface on mobile', composed: true },
  androidAppScreenshot: { src: '/screens-android-app.png', alt: 'Igira Provisoire Android application', composed: true },
  iosAppScreenshot: { src: '/screens-ios-app.png', alt: 'Igira Provisoire iOS application', composed: true },
  mobileAppsDeviceMockup: { src: '', alt: 'Igira Provisoire mobile applications' },
  schoolDashboardScreenshot: { src: '/screens-school-dashboard.png', alt: 'Igira driving school dashboard', composed: true },
  schoolStudentManagementScreenshot: { src: '', alt: 'Driving school student management' },
  schoolCustomizationScreenshot: { src: '', alt: 'Customized driving school software' },
  schoolInstructorManagementScreenshot: { src: '', alt: 'Driving school instructor management' },
  blogFeatured: { src: '/blog-road-signs.png', alt: 'Road sign beside a Rwanda hillside road' },
  blogTrafficRules: { src: '/blog-rwanda-roads.png', alt: 'Winding road through Rwanda hills' },
  blogRoadSigns: { src: '/blog-road-signs.png', alt: 'Warning road sign beside a Rwanda road' },
  blogDrivingGuide: { src: '/blog-practice-tips.png', alt: 'Driving theory study notes on a desk' },
  advertisingVisual: { src: '', alt: 'Advertise with Igira Provisoire' },
} satisfies Record<string, LandingAsset>

export const deviceFrames = {
  heroDesktopFrame: { src: '/device-frames/laptop-frame.png', alt: 'Laptop or MacBook device frame' },
  heroMobileFrame: { src: '/device-frames/iphone-frame.png', alt: 'iPhone device frame' },
  practiceDesktopFrame: { src: '/device-frames/laptop-frame.png', alt: 'Laptop or MacBook device frame' },
  practiceMobileFrame: { src: '/device-frames/iphone-frame.png', alt: 'iPhone device frame' },
  mockTestDesktopFrame: { src: '/device-frames/desktop-monitor-frame.png', alt: 'Desktop monitor device frame' },
  mockTestMobileFrame: { src: '/device-frames/tablet-frame.png', alt: 'Tablet device frame' },
  androidDeviceFrame: { src: '/device-frames/android-frame.png', alt: 'Android phone device frame' },
  iosDeviceFrame: { src: '/device-frames/iphone-frame.png', alt: 'iPhone device frame' },
  schoolDesktopFrame: { src: '/device-frames/desktop-monitor-frame.png', alt: 'Desktop monitor device frame' },
} satisfies Record<string, LandingAsset>

export type AssetKey = keyof typeof landingPageAssets
export type FrameKey = keyof typeof deviceFrames

export function assetLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export function getAsset(key: AssetKey) { return landingPageAssets[key] }
export function getFrame(key: FrameKey) { return deviceFrames[key] }

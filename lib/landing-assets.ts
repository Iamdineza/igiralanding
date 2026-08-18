export type LandingAsset = { src: string; alt: string }

export const landingPageAssets = {
  logo: { src: 'https://www.igiraprovisoire.rw/assets/logo_developer-B-ocLJTd.png', alt: 'Igira Provisoire logo' },
  aboutIgiraVisual: { src: '', alt: 'Igira Provisoire platform' },
  rwandaDrivingVisual: { src: '', alt: 'Driving in Rwanda' },
  heroDesktopScreenshot: { src: '', alt: 'Igira Provisoire desktop application' },
  heroMobileScreenshot: { src: '', alt: 'Igira Provisoire mobile application' },
  heroBackgroundRoad: { src: '', alt: 'Road inspired background' },
  howItWorksVisual: { src: '', alt: 'Igira Provisoire preparation experience' },
  practiceDesktopScreenshot: { src: '', alt: 'Igira Provisoire practice interface' },
  practiceMobileScreenshot: { src: '', alt: 'Igira Provisoire practice interface on mobile' },
  mockTestDesktopScreenshot: { src: '', alt: 'Igira Provisoire mock test interface' },
  mockTestMobileScreenshot: { src: '', alt: 'Igira Provisoire mock test interface on mobile' },
  androidAppScreenshot: { src: '', alt: 'Igira Provisoire Android application' },
  iosAppScreenshot: { src: '', alt: 'Igira Provisoire iOS application' },
  mobileAppsDeviceMockup: { src: '', alt: 'Igira Provisoire mobile applications' },
  schoolDashboardScreenshot: { src: '', alt: 'Igira driving school dashboard' },
  schoolStudentManagementScreenshot: { src: '', alt: 'Driving school student management' },
  schoolCustomizationScreenshot: { src: '', alt: 'Customized driving school software' },
  schoolInstructorManagementScreenshot: { src: '', alt: 'Driving school instructor management' },
  blogFeatured: { src: '', alt: 'Igira Provisoire featured article' },
  blogTrafficRules: { src: '', alt: 'Traffic rules educational article' },
  blogRoadSigns: { src: '', alt: 'Road signs educational article' },
  blogDrivingGuide: { src: '', alt: 'Driving guide educational article' },
  advertisingVisual: { src: '', alt: 'Advertise with Igira Provisoire' },
} satisfies Record<string, LandingAsset>

export const deviceFrames = {
  heroDesktopFrame: { src: '', alt: 'Desktop device frame' },
  heroMobileFrame: { src: '/device-frames/iphone-15.png', alt: 'Apple iPhone 15 transparent device frame' },
  practiceDesktopFrame: { src: '', alt: 'Desktop device frame' },
  practiceMobileFrame: { src: '/device-frames/iphone-15.png', alt: 'Apple iPhone 15 transparent device frame' },
  mockTestDesktopFrame: { src: '', alt: 'Desktop device frame' },
  mockTestMobileFrame: { src: '', alt: 'Mobile device frame' },
  androidDeviceFrame: { src: '/device-frames/iphone-15.png', alt: 'Mobile device frame placeholder for Android app' },
  iosDeviceFrame: { src: '/device-frames/iphone-15.png', alt: 'Apple iPhone 15 transparent device frame' },
  schoolDesktopFrame: { src: '', alt: 'Desktop device frame' },
} satisfies Record<string, LandingAsset>

export type AssetKey = keyof typeof landingPageAssets
export type FrameKey = keyof typeof deviceFrames

export function assetLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export function getAsset(key: AssetKey) { return landingPageAssets[key] }
export function getFrame(key: FrameKey) { return deviceFrames[key] }

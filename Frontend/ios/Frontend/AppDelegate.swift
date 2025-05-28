import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleMaps    
import AVFoundation



@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(.playAndRecord, options: .defaultToSpeaker)
      // try session.setMode(.measurement)
      try session.setActive(true)
    } catch {
      print("⚠️ AVAudioSession 설정 실패:", error)
    }
    let apiKey = RNCConfig.env(for: "GOOGLE_MAPS_API_KEY")!
    GMSServices.provideAPIKey(apiKey)
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "Frontend",
      in: window,
      launchOptions: launchOptions
    )
    showSplashScreen()

    return true
  }
  private func showSplashScreen() {
        DispatchQueue.main.async {
            if let splashClass = NSClassFromString("SplashView") as? NSObject.Type,
               let splashInstance = splashClass.perform(NSSelectorFromString("sharedInstance"))?.takeUnretainedValue() as? NSObject {
                splashInstance.perform(NSSelectorFromString("showSplash"))
            }
        }
    }
}
 

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

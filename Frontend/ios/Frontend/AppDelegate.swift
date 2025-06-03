import UIKit
import React
import React_RCTAppDelegate       // RN New Arch
import ReactAppDependencyProvider // RN New Arch
import GoogleMaps
import AVFoundation

import KakaoSDKCommon             // Kakao SDK
import KakaoSDKAuth               // Kakao SDK – 로그인 콜백
             // 환경변수(.env) 읽기

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?

  // New Architecture
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory : RCTReactNativeFactory?

  // MARK: - App Launch
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {

    // ─── 1) 오디오 세션 (기존) ───
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(.playAndRecord, options: .defaultToSpeaker)
      try session.setMode(.measurement)
    } catch {
      print("⚠️ AVAudioSession 설정 실패:", error)
    }

    // ─── 2) Kakao SDK 초기화 ───
    let kakaoAppKey = RNCConfig.env(for:"KAKAO_NATIVE_KEY")!       // 또는 RNCConfig.env(for:"KAKAO_NATIVE_KEY")!
    KakaoSDK.initSDK(appKey: kakaoAppKey)

    // ─── 3) Google Maps 초기화 (기존) ───
    let gmapsKey = RNCConfig.env(for: "GOOGLE_MAPS_API_KEY")!
    GMSServices.provideAPIKey(gmapsKey)

    // ─── 4) React-Native New Architecture 부트스트랩 ───
    let delegate = ReactNativeDelegate()
    delegate.dependencyProvider = RCTAppDependencyProvider()

    let factory  = RCTReactNativeFactory(delegate: delegate)
    reactNativeDelegate = delegate
    reactNativeFactory  = factory

    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "Frontend",       // JS entrypoint (index.js)
      in: window,
      launchOptions: launchOptions
    )

    // ─── 5) 커스텀 스플래시 표시 ───
    showSplashScreen()

    return true
  }

  // MARK: - 딥링크 처리 (Kakao + RN Linking)
  func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {

    // ① Kakao 로그인 콜백
    if AuthApi.isKakaoTalkLoginUrl(url) {
      return AuthController.handleOpenUrl(url: url, options: options)
    }

    // ② 기타 RN Linking URL
    if RCTLinkingManager.application(application, open: url, options: options) {
      return true
    }
    return false
  }

  // MARK: - 스플래시 뷰 호출 (Objective-C 클래스를 리플렉션으로)
  private func showSplashScreen() {
    DispatchQueue.main.async {
      if let splashClass = NSClassFromString("SplashView") as? NSObject.Type,
         let splashInstance = splashClass.perform(
              NSSelectorFromString("sharedInstance")
         )?.takeUnretainedValue() as? NSObject {

        splashInstance.perform(NSSelectorFromString("showSplash"))
      }
    }
  }
}

// MARK: - React Native New-Arch Delegate
class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings()
               .jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
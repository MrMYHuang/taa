# Taiwan Animal Adoption (台灣動物認養)

## <a id='feature'>特色</a>

書籤功能、網址分享、佈景主題切換、字型調整、跨平台、無廣告、開放原始碼。

## 說明

Taiwan Animal Adoption (台灣動物認養)，簡寫 taa。隨機呈現台灣待認養動物，如貓、狗，的資訊，包括動物圖片、流水編號、收容所名稱、收容所電話。

此 app 支援以下功能:

* <a id='bookmark'>書籤</a>
  1. 在認養動物詳細資料頁面，點擊右上角書籤圖示，即可加入書籤頁。
  2. 刪除：至書籤頁，左滑項目即出現刪除鈕，再點擊即可。

* <a id='shareAppLink'>網址分享</a>
  1. 用瀏覽器開啟此 app 的動物列表頁面或開啟動物詳細資訊頁，點擊右上角分享鈕，可複製此頁連結至作業系統剪貼簿或產生QR code，可分享給其他人。
  2. 分享網址可帶上部分 app 設定參數。

* 佈景主題切換
* 字型調整
  1. 考量視力不佳的使用者，提供最大64 px的字型設定。

* <a id='report'>App異常回報</a>

  App設定頁的異常回報鈕使用方法為：執行會造成app異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封E-mail，包含異常的記錄，發送此E-mail給我們即可。

程式碼為開放(MIT License)，可自由下載修改、重新發佈。

## <a id='install'>安裝</a>

此 app 目前有2種取得、安裝方式：

  1. Chrome、Safari網頁瀏覽器。
  2. App 商店。

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用 Chrome (Windows, macOS, Linux, Android 作業系統使用者)、Safari (iOS (iPhone, iPad) 使用者)瀏覽器開啟以下網址：

https://myhpwa.github.io/taa

或：

<a href='https://myhpwa.github.io/taa' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此 progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致書籤資料不見！

#### Windows, macOS, Linux, Android - 使用Chrome安裝
使用 Chrome 瀏覧器（建議最新版）開啟上述 PWA 網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/taa/raw/master/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"Taiwan Animal Adoption" app 圖示。

#### iOS - 使用Safari安裝
1. 使用Safari開啟web app網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/taa/raw/master/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面"(Add to Home Screen)：

<img src='https://github.com/MrMYHuang/taa/raw/master/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/taa/raw/master/docs/images/Safari/AppIcon.png' width='50%' />

### <a id='storeApp'>從 App 商店安裝</a>
#### Android - 使用 Google Play Store
<a href='https://play.google.com/store/apps/details?id=com.taa' target='_blank'>
<img width="auto" height='60px' alt='Google Play立即下載' src='https://github.com/MrMYHuang/taa/raw/master/docs/images/zh-tw_badge_web_generic.png'/>
</a>

#### iOS 14.0+ (iPhone), iPadOS 14.0+ (iPad) - 使用 Apple App Store
<a href='https://apps.apple.com/app/id1579232521' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/taa/raw/master/docs/images/Download_on_the_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### macOS 10.10+ - 使用 Apple App Store
<a href='https://apps.apple.com/app/id1579232521' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/twri/raw/main/docs/images/Download_on_the_Mac_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### Windows 10 - 使用 Microsoft Store
<a href='https://www.microsoft.com/store/apps/9PH0CQ23ZKS5' target='_blank'>
<img width="auto" height='60px' src='https://developer.microsoft.com/store/badges/images/Chinese-Traditional_get-it-from-MS.png' alt='Chinese Traditional badge'/>
</a>

#### Linux - 使用 Snap Store
<a href='https://snapcraft.io/twaa' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/taa/raw/master/docs/images/[TW]-snap-store-black@2x.png' />
</a>

## <a id='knownIssues'>已知問題</a>
1. iOS Safari 13.4以上才支援"分享此頁"功能。

## <a id='history'>版本歷史</a>
* PWA 2.6.0:
  * [新增] 初次啟動會提示將下載離線資料。
  * [修正] 分頁讀取搜尋結果未依序顯示。

* PWA 2.5.3:
  * [修正] 分頁讀取搜尋結果未依序顯示。

* PWA 2.5.2:
  * [修正] 手動更新離線資料後，上次更新日期未更新的問題。

* PWA 2.5.1:
  * [修正] Chrome 瀏覽器開啟自動中翻英後，app 功能異常的 bug。

* PWA 2.5.0:
  * [新增] 離線資料更新通知設定。
  * [優化] 動物資料缺圖檔，應顯示"無圖片"。
  * [優化] Service Worker 更新。

* PWA 2.4.1:
  * [修正] iOS 上，分享 app 連結未複製到剪貼簿的問題。

* PWA 2.4.0:
  * [優化] 升級套件。

* PWA 2.3.4:
  * [修正] 網址分享在新電腦開啟異常。

* PWA 2.3.3:
  * [修正] package.json homepage 若不為根目錄，全新使用 app link 運作異常問題。

* PWA 2.3.2:
  * [修正] setState, dispatch 相關狀態更新 bugs。
* PWA 2.3.0:
  * 錯誤回報功能作 E-mail 檢查。
  * 錯誤回報功能支援填寫問題發生步驟。
* Snap 2.1.0:
  * 支援 Linux arm64。
* MAS 2.1.0:
  * 支援 Universal app。
* 2.2.0:
  * 修正錯誤回報功能異常的問題。
* 2.1.4:
  * 多重篩選新支援"資料異動時間"與"資料建立時間"。
* 2.1.3:
  * 修正無法刪除書籤的 bug.
* 2.1.2:
  * 修正錯字。
* 2.1.1:
  * 修正 bug。
* 2.1.0:
  * 支援多重篩選功能。
* 2.0.4:
  * MAS app 設定頁移除版本資訊，以符合 Mac App Store 上架規範。
* 2.0.3:
  * 修正 Electron app 無法開啟外部連結的 bug。
  * Electron app 加入視窗選單，以符合 Mac App Store 上架規範。
* 2.0.2:
  * 移除設定頁 app 更新通知功能，以符合 Mac App Store 上架規範。
* 2.0.1:
  * 移除 app 內的程式安裝連結，以符合 iOS 上架規範。
* 2.0.0:
  * 改寫成 PWA。
* 1.5.5:
  * 修正在64-bit Android手機會閃退的問題。
* 1.5.4:
  * 更新API路徑。
* 1.5.3:
  * 修復UWP版CodePush功能。
* 1.5.2:
  * 修復UWP版。
* 1.5.1:
  * 修正CodePush。
* 1.5.0:
  * 更新資料來源。
  * 更新NodeJS package。
* 1.4.1:
  * 解決有時"我的最愛"的列表項目按鈕非"刪除"的bug。
* 1.4.0:
  * 新增"我的最愛"功能。
* 1.3.1:
  * 修正資料庫下載進度條顯示問題。
* 1.3.0:
  * 新增下載資料庫會顯示進度。
  * 修正更新進度有可能不顯示的問題。
* 1.2.2:
  * 修正下載更新完成對話窗重複出現的bug。
* 1.2.0:
  * CodePush更新會顯示確認視窗與下載進度。
* 1.1.0:
  * 支援CodePush更新app。
  * 修正"下載資料庫"鈕無法更新資料庫的問題。
  * 關於頁面顯示上次下載資料之時間。
* 1.0.8：
  * 第一版。

## <a href='https://github.com/MrMYHuang/taa/blob/master/PrivacyPolicy.md'>隱私政策</a>

## 第三方軟體版權聲明

1. 動物認領養資料集 ( https://data.gov.tw/dataset/85903 )

    此app使用《動物認領養》資料集。此開放資料依政府資料開放授權條款 (Open Government Data License) 進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。政府資料開放授權條款：https://data.gov.tw/license

## Notices

  1. Android Package ID: com.taa
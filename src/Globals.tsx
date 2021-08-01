import axios from 'axios';
import fs from 'fs';
import { isPlatform, IonLabel } from '@ionic/react';
import { DownloaderHelper, Stats } from 'node-downloader-helper';
import { Settings } from './models/Settings';
const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL';
const pwaUrl = process.env.PUBLIC_URL || '';

const database = 'taaDb';
const animalsKey = 'animals';

const axiosInstance = axios.create({
  timeout: 8000,
});

async function downloadData(url: string, progressCallback: Function) {
  return new Promise<Buffer>((ok, fail) => {
    const dl = new DownloaderHelper(url, '.', {});
    let progressUpdateEnable = true;
    dl.on('progress', (stats: Stats) => {
      if (progressUpdateEnable) {
        // Reduce number of this calls by progressUpdateEnable.
        // Too many of this calls could result in 'end' event callback is executed before 'progress' event callbacks!
        progressCallback(stats.progress);
        progressUpdateEnable = false;
        setTimeout(() => {
          progressUpdateEnable = true;
        }, 100);
      }
    });
    dl.on('end', (downloadInfo: any) => {
      dl.removeAllListeners();
      const data = fs.readFileSync(downloadInfo.filePath);
      ok(data);
    });
    dl.start();
  });
}


async function getFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(database);

  return new Promise(function (ok, fail) {
    dbOpenReq.onsuccess = async function (ev) {
      const db = dbOpenReq.result;

      try {
        const trans = db.transaction(["store"], 'readwrite');
        let req = trans.objectStore('store').get(fileName);
        req.onsuccess = async function (_ev) {
          const data = req.result;
          if (!data) {
            console.error(`${fileName} loading failed!`);
            console.error(new Error().stack);
            return fail();
          }
          return ok(data);
        };
      } catch (err) {
        console.error(err);
      }
    };
  });
}

async function saveFileToIndexedDB(fileName: string, data: any) {
  const dbOpenReq = indexedDB.open(database);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').put(data, fileName);
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

async function removeFileFromIndexedDB(fileName: string) {
  const dbOpenReq = indexedDB.open(database);
  return new Promise<void>((ok, fail) => {
    try {
      dbOpenReq.onsuccess = (ev: Event) => {
        const db = dbOpenReq.result;

        const transWrite = db.transaction(["store"], 'readwrite')
        try {
          const reqWrite = transWrite.objectStore('store').delete(fileName);
          reqWrite.onsuccess = (_ev: any) => ok();
          reqWrite.onerror = (_ev: any) => fail();
        } catch (err) {
          console.error(err);
        }
      };
    } catch (err) {
      fail(err);
    }
  });
}

async function clearIndexedDB() {
  const dbOpenReq = indexedDB.open(database);
  return new Promise<void>((ok, fail) => {
    dbOpenReq.onsuccess = async (ev: Event) => {
      const db = dbOpenReq.result;

      const transWrite = db.transaction(["store"], 'readwrite')
      const reqWrite = transWrite.objectStore('store').clear();
      reqWrite.onsuccess = (_ev: any) => ok();
      reqWrite.onerror = (_ev: any) => fail();
    };
  });
}

let log = '';

async function clearAppData() {
  localStorage.clear();
}

//const electronBackendApi: any = (window as any).electronBackendApi;

const consoleLog = console.log.bind(console);
const consoleError = console.error.bind(console);

function getLog() {
  return log;
}

function enableAppLog() {
  console.log = function () {
    log += '----- Info ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleLog.apply(console, arguments as any);
  };

  console.error = function () {
    log += '----- Error ----\n';
    log += (Array.from(arguments)) + '\n';
    consoleError.apply(console, arguments as any);
  };
}

function disableAppLog() {
  log = '';
  console.log = consoleLog;
  console.error = consoleError;
}

function copyToClipboard(text: string) {
  try {
    navigator.clipboard && navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
}

function isMacCatalyst() {
  return isPlatform('ios') && navigator.platform === 'MacIntel';
}

const Globals = {
  pwaUrl,
  axiosInstance,
  dataUrl,
  database,
  downloadData,
  getFileFromIndexedDB,
  saveFileToIndexedDB,
  removeFileFromIndexedDB,
  clearIndexedDB,
  animalsKey,
  storeFile: 'taaSettings.json',
  getLog,
  enableAppLog,
  disableAppLog,
  appSettings: {
    'theme': '佈景主題',
    'uiFontSize': 'UI字型大小',
    'textFontSize': '內容文字大小',
  } as Record<string, string>,
  fetchErrorContent: (
    <div className='contentCenter'>
      <IonLabel>
        <div>
          <div>連線失敗!</div>
          <div style={{ fontSize: 'var(--ui-font-size)', paddingTop: 24 }}>請嘗試點擊右上方的重新讀取按鈕。如果問題持續發生，請執行<a href={`/${pwaUrl}/settings`} target="_self">設定頁</a>的 app 異常回報功能。</div>
        </div>
      </IonLabel>
    </div>
  ),
  updateApp: () => {
    return new Promise(async resolve => {
      navigator.serviceWorker.getRegistrations().then(async regs => {
        const hasUpdates = await Promise.all(regs.map(reg => (reg.update() as any).then((newReg: ServiceWorkerRegistration) => {
          return newReg.installing !== null || newReg.waiting !== null;
        })));
        resolve(hasUpdates.reduce((prev, curr) => prev || curr, false));
      });
    });
  },
  updateCssVars: (settings: Settings) => {
    document.documentElement.style.cssText = `--text-font-size: ${settings.textFontSize}px; --ui-font-size: ${settings.uiFontSize}px;`
  },
  isMacCatalyst,
  isTouchDevice: () => {
    return (isPlatform('ios') && !isMacCatalyst()) || isPlatform('android');
  },
  clearAppData,
  copyToClipboard,
};

export default Globals;

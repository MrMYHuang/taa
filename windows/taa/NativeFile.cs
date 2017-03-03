using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ReactNative.Bridge;
using System.Diagnostics;
using System.IO;
using Newtonsoft.Json.Linq;
using Windows.Storage;

namespace taa
{
    class NativeLocalFile : NativeModuleBase
    {
        /*
        public NativeLocalFile(ReactContext reactContext)
            : base(reactContext)
        {
        }*/

        public override string Name
        {
            get
            {
                return "NativeLocalFile";
            }
        }

        [ReactMethod]
        public async void SaveStrAsync(string fileName, string str, IPromise promise)
        {
            var lf = ApplicationData.Current.LocalFolder;
            var sf = await lf.CreateFileAsync(fileName, CreationCollisionOption.ReplaceExisting);
            using(var s = await sf.OpenStreamForWriteAsync())
            {
                using (var sw = new StreamWriter(s))
                {
                    sw.Write(str);
                }
            }
            promise.Resolve(true);
        }

        [ReactMethod]
        public async void LoadStrAsync(string fileName, IPromise promise)
        {
            var lf = ApplicationData.Current.LocalFolder;
            try
            {
                string str;
                using (var s = await lf.OpenStreamForReadAsync(fileName))
                {
                    using (var sr = new StreamReader(s))
                    {
                        str = sr.ReadToEnd();
                    }
                }
                promise.Resolve(str);
            }
            catch(Exception ex)
            {
                promise.Reject(ex);
            }            
        }
    }
}

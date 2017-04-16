using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System.Collections.Generic;
using CodePush.ReactNative;

namespace taa
{
    class MainPage : ReactPage
    {
        public override string MainComponentName
        {
            get
            {
                return "taa";
            }
        }

#if BUNDLE
        private CodePushReactPackage codePushReactPackage;
        public override string JavaScriptBundleFile
        {
            get
            {
                //return "ms-appx:///ReactAssets/index.windows.bundle";
                string cpKey;
#if DEBUG
        cpKey = "staging_key";
#else
                cpKey = "production_key";
#endif
                codePushReactPackage = new CodePushReactPackage(cpKey, this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#endif

        public override List<IReactPackage> Packages
        {
            get
            {
                var rpl = new List<IReactPackage>
                {
                    new MainReactPackage(),
                    new TaaReactPackage()
                };
#if BUNDLE
                rpl.Add(codePushReactPackage);
#endif
                return rpl;
            }
        }

        public override bool UseDeveloperSupport
        {
            get
            {
#if !BUNDLE || DEBUG
                return true;
#else
                return false;
#endif
            }
        }
    }

}

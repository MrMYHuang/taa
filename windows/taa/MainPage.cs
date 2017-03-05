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
                //return "ms-appx:///Assets/index.windows.bundle";
                codePushReactPackage = new CodePushReactPackage("deployment-key-here", this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#endif

        public override List<IReactPackage> Packages
        {
            get
            {
                return new List<IReactPackage>
                {
                    new MainReactPackage(),
                    new TaaReactPackage(),
                    codePushReactPackage
                };
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

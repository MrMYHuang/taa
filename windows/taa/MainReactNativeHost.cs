using CodePush.ReactNative;
using ReactNative;
using ReactNative.Modules.Core;
using ReactNative.Shell;
using System.Collections.Generic;

namespace taa
{
    class MainReactNativeHost : ReactNativeHost
    {
        public override string MainComponentName => "taa";

#if !BUNDLE || DEBUG
        public override bool UseDeveloperSupport => true;
#else
        public override bool UseDeveloperSupport => false;
#endif

        protected override string JavaScriptMainModuleName => "index";

#if BUNDLE
        protected override string JavaScriptBundleFile => "ms-appx:///ReactAssets/index.windows.bundle";
        /*
        CodePushReactPackage codePushReactPackage;
        protected override string JavaScriptBundleFile
        {
            get
            {
                codePushReactPackage = new CodePushReactPackage("deployment-key-here", this);
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }*/
#endif

        protected override List<IReactPackage> Packages
        {
            get
            {
                var rpl = new List<IReactPackage>
                {
                    new MainReactPackage(),
                    new TaaReactPackage()
                };
#if BUNDLE
                var codePushReactPackage = new CodePushReactPackage("deployment-key-here", this);
                rpl.Add(codePushReactPackage);
#endif
                return rpl;
            }
        }
    }
}

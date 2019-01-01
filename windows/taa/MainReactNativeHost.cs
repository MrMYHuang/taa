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
        CodePushReactPackage codePushReactPackage;

        public MainReactNativeHost()
        {
            codePushReactPackage = new CodePushReactPackage("deployment-key-here", this);
        }

        protected override string JavaScriptBundleFile
        {
            get
            {
                return codePushReactPackage.GetJavaScriptBundleFile();
            }
        }
#else            
        protected override string JavaScriptBundleFile => "ms-appx:///ReactAssets/index.windows.bundle";
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
                rpl.Add(codePushReactPackage);
#endif
                return rpl;
            }
        }
    }
}

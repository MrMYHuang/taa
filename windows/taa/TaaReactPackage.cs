using ReactNative.Bridge;
using ReactNative.Modules.Core;
using ReactNative.UIManager;
using System;
using System.Collections.Generic;

namespace taa
{
    /// <summary>
    /// Package defining basic modules and view managers.
    /// </summary>
    public class TaaReactPackage : IReactPackage
    {
        /// <summary>
        /// Creates the list of native modules to register with the react
        /// instance.
        /// </summary>
        /// <param name="reactContext">The React application context.</param>
        /// <returns>The list of native modules.</returns>
        public IReadOnlyList<INativeModule> CreateNativeModules(ReactContext reactContext)
        {
            return new List<INativeModule>
            {
                new NativeLocalFile()
            };
        }

        /// <summary>
        /// Creates the list of JavaScript modules to register with the
        /// React instance.
        /// </summary>
        /// <returns>The list of JavaScript modules.</returns>
        public IReadOnlyList<Type> CreateJavaScriptModulesConfig()
        {
            return new List<Type>(0);
        }

        /// <summary>
        /// Creates the list of view managers that should be registered with
        /// the <see cref="UIManagerModule"/>.
        /// </summary>
        /// <param name="reactContext">The React application context.</param>
        /// <returns>The list of view managers.</returns>
        public IReadOnlyList<IViewManager> CreateViewManagers(
            ReactContext reactContext)
        {
            return new List<IViewManager>(0);
        }
    }
}

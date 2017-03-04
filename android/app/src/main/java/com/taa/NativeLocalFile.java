package com.taa;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.Map;

public class NativeLocalFile extends ReactContextBaseJavaModule {
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    private ReactApplicationContext context;

    public NativeLocalFile(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "NativeLocalFile";
    }

    @ReactMethod
    public void SaveStrAsync(String fileName, String str, Promise promise) {
        try {
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(
                    context.openFileOutput(fileName, Context.MODE_PRIVATE));
            outputStreamWriter.write(str);
            outputStreamWriter.close();
            promise.resolve(true);
        } catch (IOException e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void LoadStrAsync(String fileName, Promise promise) {

        StringBuilder stringBuilder = new StringBuilder();
        String line;
        BufferedReader in = null;

        try {
            in = new BufferedReader(new FileReader(new File(context.getFilesDir(), fileName)));
            while ((line = in.readLine()) != null) stringBuilder.append(line);
            promise.resolve(stringBuilder.toString());
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}

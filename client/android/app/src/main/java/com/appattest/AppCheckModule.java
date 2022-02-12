package com.appattest;
import android.telecom.Call;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.appcheck.AppCheckToken;
import com.google.firebase.appcheck.FirebaseAppCheck;
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory;

public class AppCheckModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    AppCheckModule(ReactApplicationContext context){
        super(context);
        reactContext = context;
    }

    @ReactMethod
    public void getToken(Callback successCallback, Callback errorCallback){
        FirebaseApp.initializeApp(/*context=*/ reactContext);
        FirebaseAppCheck firebaseAppCheck = FirebaseAppCheck.getInstance();
        firebaseAppCheck.installAppCheckProviderFactory(
                DebugAppCheckProviderFactory.getInstance());

        Task task = firebaseAppCheck.getAppCheckToken(false);

        task.addOnSuccessListener(new OnSuccessListener<AppCheckToken>() {
            @Override
            public void onSuccess(@NonNull AppCheckToken tokenResponse) {
                String appCheckToken = tokenResponse.getToken();
                successCallback.invoke(appCheckToken);
                Log.d("AppCheckToken", appCheckToken);
            }
        });
        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Log.e("AppCheckError", String.valueOf(e));
                errorCallback.invoke(String.valueOf(e));
            }
        });
    }

    @Override
    public String getName() {
        return "AppCheckModule";
    }
}

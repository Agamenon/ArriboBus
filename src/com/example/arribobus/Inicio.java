package com.example.arribobus;

import android.os.Bundle;
import android.app.Activity;
import org.apache.cordova.*;

public class Inicio extends DroidGap {

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        /** Introducido para que no de el TimeOut **/
        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        //setContentView(R.layout.activity_main);
        super.loadUrl("file:///android_asset/www/index.html");
    }
    /*@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inicio);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.activity_inicio, menu);
        return true;
    }*/
}

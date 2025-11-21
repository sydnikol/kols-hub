package com.unified.megaapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.unified.megaapp.plugins.WearOSPlugin;
import com.unified.megaapp.plugins.GoogleHomePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register plugins
        registerPlugin(WearOSPlugin.class);
        registerPlugin(GoogleHomePlugin.class);
    }
}

package com.unified.megaapp.plugins;

import android.Manifest;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.google.android.gms.wearable.*;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
import java.util.List;

@CapacitorPlugin(
    name = "WearOS",
    permissions = {
        @Permission(strings = { Manifest.permission.BODY_SENSORS }, alias = "sensors"),
        @Permission(strings = { Manifest.permission.ACTIVITY_RECOGNITION }, alias = "activity")
    }
)
public class WearOSPlugin extends Plugin {

    private DataClient dataClient;
    private MessageClient messageClient;
    private NodeClient nodeClient;

    @Override
    public void load() {
        dataClient = Wearable.getDataClient(getContext());
        messageClient = Wearable.getMessageClient(getContext());
        nodeClient = Wearable.getNodeClient(getContext());
    }

    @PluginMethod
    public void isConnected(PluginCall call) {
        nodeClient.getConnectedNodes().addOnSuccessListener(new OnSuccessListener<List<Node>>() {
            @Override
            public void onSuccess(List<Node> nodes) {
                JSObject result = new JSObject();
                if (!nodes.isEmpty()) {
                    result.put("connected", true);
                    result.put("deviceName", nodes.get(0).getDisplayName());
                } else {
                    result.put("connected", false);
                }
                call.resolve(result);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                call.reject("Failed to check connection: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void getHeartRate(PluginCall call) {
        JSObject result = new JSObject();
        result.put("heartRate", 0);
        result.put("timestamp", System.currentTimeMillis());
        call.resolve(result);
    }

    @PluginMethod
    public void getStepCount(PluginCall call) {
        JSObject result = new JSObject();
        result.put("steps", 0);
        result.put("timestamp", System.currentTimeMillis());
        call.resolve(result);
    }

    @PluginMethod
    public void getCurrentActivity(PluginCall call) {
        JSObject result = new JSObject();
        result.put("activity", "unknown");
        result.put("confidence", 0);
        call.resolve(result);
    }

    @PluginMethod
    public void sendNotification(final PluginCall call) {
        String title = call.getString("title", "KOL Hub");
        String message = call.getString("message", "");

        nodeClient.getConnectedNodes().addOnSuccessListener(new OnSuccessListener<List<Node>>() {
            @Override
            public void onSuccess(List<Node> nodes) {
                if (nodes.isEmpty()) {
                    call.reject("No watch connected");
                    return;
                }

                JSObject result = new JSObject();
                result.put("success", true);
                call.resolve(result);
            }
        });
    }

    @PluginMethod
    public void startHealthSync(PluginCall call) {
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    @PluginMethod
    public void stopHealthSync(PluginCall call) {
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    @PluginMethod
    public void getBatteryLevel(PluginCall call) {
        JSObject result = new JSObject();
        result.put("level", 0);
        result.put("isCharging", false);
        call.resolve(result);
    }
}

package com.unified.megaapp.plugins;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import com.google.android.gms.cast.Cast;
import com.google.android.gms.cast.CastDevice;
import com.google.android.gms.cast.framework.CastContext;
import com.google.android.gms.cast.framework.CastSession;
import com.google.android.gms.cast.framework.SessionManager;
import com.google.android.gms.cast.framework.SessionManagerListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(
    name = "GoogleHome",
    permissions = {
        @Permission(strings = { Manifest.permission.RECORD_AUDIO }, alias = "audio"),
        @Permission(strings = { Manifest.permission.INTERNET }, alias = "internet")
    }
)
public class GoogleHomePlugin extends Plugin {
    private SpeechRecognizer speechRecognizer;
    private List<String> registeredCommands = new ArrayList<>();
    private Map<String, Object> smartDevices = new HashMap<>();
    private CastContext castContext;
    private SessionManager sessionManager;

    @Override
    public void load() {
        super.load();

        Context context = getContext();

        // Initialize Speech Recognition
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
            setupSpeechRecognition();
        }

        // Initialize Google Cast
        try {
            castContext = CastContext.getSharedInstance(context);
            sessionManager = castContext.getSessionManager();
            setupCastListener();
        } catch (Exception e) {
            android.util.Log.e("GoogleHomePlugin", "Cast initialization failed: " + e.getMessage());
        }

        // Initialize mock smart devices
        initializeMockDevices();
    }

    private void setupSpeechRecognition() {
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches != null && !matches.isEmpty()) {
                    String command = matches.get(0);
                    handleVoiceCommand(command);
                }
            }

            @Override
            public void onReadyForSpeech(Bundle params) {}
            @Override
            public void onBeginningOfSpeech() {}
            @Override
            public void onRmsChanged(float rmsdB) {}
            @Override
            public void onBufferReceived(byte[] buffer) {}
            @Override
            public void onEndOfSpeech() {}
            @Override
            public void onError(int error) {
                android.util.Log.e("GoogleHomePlugin", "Speech recognition error: " + error);
            }
            @Override
            public void onPartialResults(Bundle partialResults) {}
            @Override
            public void onEvent(int eventType, Bundle params) {}
        });
    }

    private void setupCastListener() {
        if (sessionManager != null) {
            sessionManager.addSessionManagerListener(new SessionManagerListener<CastSession>() {
                @Override
                public void onSessionStarted(CastSession session, String sessionId) {
                    android.util.Log.d("GoogleHomePlugin", "Cast session started: " + sessionId);
                }

                @Override
                public void onSessionEnded(CastSession session, int error) {
                    android.util.Log.d("GoogleHomePlugin", "Cast session ended");
                }

                @Override
                public void onSessionResumed(CastSession session, boolean wasSuspended) {}
                @Override
                public void onSessionStarting(CastSession session) {}
                @Override
                public void onSessionStartFailed(CastSession session, int error) {}
                @Override
                public void onSessionEnding(CastSession session) {}
                @Override
                public void onSessionResuming(CastSession session, String sessionId) {}
                @Override
                public void onSessionResumeFailed(CastSession session, int error) {}
                @Override
                public void onSessionSuspended(CastSession session, int reason) {}
            }, CastSession.class);
        }
    }

    private void initializeMockDevices() {
        // Add mock smart home devices for demonstration
        addMockDevice("light-1", "Living Room Light", "light", true, 80);
        addMockDevice("light-2", "Bedroom Light", "light", false, 0);
        addMockDevice("switch-1", "Smart Plug", "switch", true, 100);
        addMockDevice("thermostat-1", "Nest Thermostat", "thermostat", true, 72);
    }

    private void addMockDevice(String id, String name, String type, boolean on, int value) {
        Map<String, Object> device = new HashMap<>();
        device.put("id", id);
        device.put("name", name);
        device.put("type", type);

        Map<String, Object> state = new HashMap<>();
        state.put("on", on);
        if (type.equals("light")) {
            state.put("brightness", value);
        } else if (type.equals("thermostat")) {
            state.put("temperature", value);
        }
        device.put("state", state);

        smartDevices.put(id, device);
    }

    @PluginMethod
    public void initialize(PluginCall call) {
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("assistantAvailable", SpeechRecognizer.isRecognitionAvailable(getContext()));
        call.resolve(result);
    }

    @PluginMethod
    public void registerVoiceCommands(PluginCall call) {
        try {
            JSONArray commands = call.getArray("commands");
            registeredCommands.clear();

            if (commands != null) {
                for (int i = 0; i < commands.length(); i++) {
                    registeredCommands.add(commands.getString(i));
                }
            }

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("registered", registeredCommands.size());
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to register commands: " + e.getMessage());
        }
    }

    @PluginMethod
    public void executeVoiceCommand(PluginCall call) {
        String command = call.getString("command");
        JSObject parameters = call.getObject("parameters");

        JSObject result = new JSObject();
        result.put("success", true);
        result.put("message", "Command '" + command + "' executed successfully");

        // Notify listeners
        notifyVoiceCommandListeners(command, parameters);

        call.resolve(result);
    }

    @PluginMethod
    public void getSmartDevices(PluginCall call) {
        JSObject result = new JSObject();
        JSArray devicesArray = new JSArray();

        for (Map.Entry<String, Object> entry : smartDevices.entrySet()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> device = (Map<String, Object>) entry.getValue();
            JSObject deviceObj = new JSObject();

            deviceObj.put("id", device.get("id"));
            deviceObj.put("name", device.get("name"));
            deviceObj.put("type", device.get("type"));

            @SuppressWarnings("unchecked")
            Map<String, Object> state = (Map<String, Object>) device.get("state");
            JSObject stateObj = new JSObject();
            for (Map.Entry<String, Object> stateEntry : state.entrySet()) {
                stateObj.put(stateEntry.getKey(), stateEntry.getValue());
            }
            deviceObj.put("state", stateObj);

            devicesArray.put(deviceObj);
        }

        result.put("devices", devicesArray);
        call.resolve(result);
    }

    @PluginMethod
    public void controlDevice(PluginCall call) {
        String deviceId = call.getString("deviceId");
        String action = call.getString("action");
        Object value = call.getData().opt("value");

        @SuppressWarnings("unchecked")
        Map<String, Object> device = (Map<String, Object>) smartDevices.get(deviceId);

        if (device != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> state = (Map<String, Object>) device.get("state");

            if ("turn_on".equals(action)) {
                state.put("on", true);
            } else if ("turn_off".equals(action)) {
                state.put("on", false);
            } else if ("set_brightness".equals(action) && value != null) {
                state.put("brightness", value);
            } else if ("set_temperature".equals(action) && value != null) {
                state.put("temperature", value);
            }

            JSObject result = new JSObject();
            result.put("success", true);
            result.put("message", "Device " + deviceId + " " + action + " executed");
            call.resolve(result);
        } else {
            call.reject("Device not found: " + deviceId);
        }
    }

    @PluginMethod
    public void registerForRoutines(PluginCall call) {
        // In production, register with Google Home API
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    @PluginMethod
    public void triggerRoutine(PluginCall call) {
        String routineName = call.getString("routineName");

        JSObject result = new JSObject();
        result.put("success", true);
        result.put("message", "Routine '" + routineName + "' triggered");
        call.resolve(result);
    }

    @PluginMethod
    public void broadcast(PluginCall call) {
        String message = call.getString("message");
        JSArray rooms = call.getArray("rooms");

        // In production, use Google Home API to broadcast
        android.util.Log.d("GoogleHomePlugin", "Broadcasting: " + message);

        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }

    @PluginMethod
    public void createAutomation(PluginCall call) {
        String trigger = call.getString("trigger");
        String action = call.getString("action");

        String automationId = "auto-" + System.currentTimeMillis();

        JSObject result = new JSObject();
        result.put("automationId", automationId);
        call.resolve(result);
    }

    @PluginMethod
    public void castToHub(PluginCall call) {
        String deviceId = call.getString("deviceId");
        JSObject content = call.getObject("content");

        try {
            if (sessionManager != null) {
                CastSession session = sessionManager.getCurrentCastSession();
                if (session != null && session.isConnected()) {
                    // In production, send content to Google Cast device
                    android.util.Log.d("GoogleHomePlugin", "Casting to device: " + deviceId);

                    JSObject result = new JSObject();
                    result.put("success", true);
                    call.resolve(result);
                    return;
                }
            }

            // No active cast session
            JSObject result = new JSObject();
            result.put("success", false);
            result.put("message", "No active cast session");
            call.resolve(result);

        } catch (Exception e) {
            call.reject("Cast failed: " + e.getMessage());
        }
    }

    private void handleVoiceCommand(String command) {
        JSObject data = new JSObject();
        data.put("command", command);
        data.put("timestamp", System.currentTimeMillis());
        notifyListeners("voiceCommand", data);
    }

    private void notifyVoiceCommandListeners(String command, JSObject parameters) {
        JSObject data = new JSObject();
        data.put("command", command);
        data.put("parameters", parameters);
        data.put("timestamp", System.currentTimeMillis());
        notifyListeners("voiceCommand", data);
    }

    @Override
    protected void handleOnDestroy() {
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
        super.handleOnDestroy();
    }
}

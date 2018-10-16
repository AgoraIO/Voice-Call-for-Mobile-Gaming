package io.agora.amg.model;

import android.text.TextUtils;

public class CurrentUserSettings {
    public volatile int mEncryptionModeIndex;

    public volatile String mEncryptionKey;

    public volatile String mChannelName;

    public volatile int mDefaultRenderMode;

    public volatile boolean mFullBandAudioEnabled;
    public volatile boolean mStereoAudioEnabled;
    public volatile boolean mFullBitrateAudioEnabled;

    public volatile HardwareAcce mHAC;

    public volatile boolean mDualStreamMode;

    public volatile boolean mEnablePreferFrameRateThanQuality;

    // default value: true(broadcasting), false(communication)
    public volatile boolean mSwapWidthAndHeight; // reset it when channel profile changed

    public volatile boolean mFakeDynamicChannelKey;
    public volatile boolean mFakeDynamicCallInKey;
    public volatile boolean mFakeDynamicRecordingKey;

    public volatile boolean mLocalAudioMuted;


    public CurrentUserSettings() {
        reset();
    }

    public void reset() {

        mFullBandAudioEnabled = false;
        mStereoAudioEnabled = false;
        mFullBitrateAudioEnabled = false;

        mFakeDynamicChannelKey = false;
        mFakeDynamicCallInKey = false;
        mFakeDynamicRecordingKey = false;

        mDualStreamMode = false;

        mLocalAudioMuted = false;

        mHAC = null;
    }

    @Override
    public String toString() {
        return "CurrentUserSettings{" +
                "mEncryptionModeIndex=" + mEncryptionModeIndex +
                ", mEncryptionKey='" + mEncryptionKey + '\'' +
                ", mChannelName='" + mChannelName + '\'' +
                ", mDefaultRenderMode=" + mDefaultRenderMode +
                ", mFullBandAudioEnabled=" + mFullBandAudioEnabled +
                ", mStereoAudioEnabled=" + mStereoAudioEnabled +
                ", mFullBitrateAudioEnabled=" + mFullBitrateAudioEnabled +
                ", mSwapWidthAndHeight=" + mSwapWidthAndHeight +
                ", mLocalAudioMuted=" + mLocalAudioMuted +
                ", mHAC=" + mHAC +
                '}';
    }
}

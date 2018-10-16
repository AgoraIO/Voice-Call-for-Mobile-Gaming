package io.agora.amg.model;

/**
 * Created by Lucy on 7/25/17.
 */
public class GlobalAudioEffectStatus {
    private double mVolume;

    private double mPitch;
    private double mPan;
    private double mGain;

    private int mStatus;

    public GlobalAudioEffectStatus() {
        this.mVolume = 50; // [0, 100]
        this.mPitch = 1.0; // [0, 2]
        this.mPan = 0.0; // [-1, 1]
        this.mGain = 100.0; // [0, 100]
        this.mStatus = AudioEffectItem.STATUS_INIT;
    }

    public GlobalAudioEffectStatus(int volume, int pitch, int pan, int gain, int status) {
        this.mVolume = volume;
        this.mPitch = pitch;
        this.mPan = pan;
        this.mGain = gain;
        this.mStatus = status;
    }

    public double getVolume() {
        return mVolume;
    }

    public void setVolume(double volume) {
        this.mVolume = volume;
    }

    public double getPitch() {
        return mPitch;
    }

    public void setPitch(double pitch) {
        this.mPitch = pitch;
    }

    public double getPan() {
        return mPan;
    }

    public void setPan(double pan) {
        this.mPan = pan;
    }

    public double getGain() {
        return mGain;
    }

    public void setGain(double gain) {
        this.mGain = gain;
    }

    public int getStatus() {
        return mStatus;
    }

    public void setStatus(int status) {
        this.mStatus = status;
    }

    @Override
    public String toString() {
        return "GlobalAudioEffectStatus{" +
                "mVolume=" + mVolume +
                ", mPitch=" + mPitch +
                ", mPan=" + mPan +
                ", mGain=" + mGain +
                ", mStatus=" + mStatus +
                '}';
    }
}

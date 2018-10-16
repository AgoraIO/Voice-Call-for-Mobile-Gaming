package io.agora.amg.model;

/**
 * Created by Lucy on 7/25/17.
 */
public class AudioEffectItem {

    public static final int STATUS_INIT = 0;
    public static final int STATUS_PLAYING = 1 << 1;
    public static final int STATUS_PAUSING = STATUS_PLAYING << 1;
    public static final int STATUS_RESUMING = STATUS_PAUSING << 1;
    public static final int STATUS_STOPPING = STATUS_RESUMING << 1;

    private final int mId;

    private final String mPath;

    private int mStatus;

    private double mVolume;

    private boolean mPreload;

    private boolean mLooping;

    public AudioEffectItem(String path, int status, double volume, boolean preload, boolean loop) {
        this.mId = System.identityHashCode(path);

        this.mPath = path;

        this.mStatus = status;

        this.mVolume = volume;
        this.mPreload = preload;
        this.mLooping = loop;
    }

    public int getId() {
        return mId;
    }

    public String getPath() {
        return mPath;
    }

    public int getStatus() {
        return mStatus;
    }

    public void setStatus(int mStatus) {
        this.mStatus = mStatus;
    }

    public double getVolume() {
        return mVolume;
    }

    public void setVolume(double volume) {
        this.mVolume = volume;
    }

    public boolean isPreload() {
        return mPreload;
    }

    public void setPreload(boolean mPreload) {
        this.mPreload = mPreload;
    }

    public boolean isLooping() {
        return mLooping;
    }

    public void setLooping(boolean mLooping) {
        this.mLooping = mLooping;
    }

    @Override
    public String toString() {
        return "AudioEffectItem{" +
                "mId=" + mId +
                ", mPath='" + mPath + '\'' +
                ", mStatus=" + mStatus +
                ", mVolume=" + mVolume +
                ", mPreload=" + mPreload +
                ", mLooping=" + mLooping +
                '}';
    }
}

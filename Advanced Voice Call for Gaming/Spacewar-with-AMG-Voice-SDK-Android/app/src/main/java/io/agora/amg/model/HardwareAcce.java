package io.agora.amg.model;

/**
 * Created by Lucy on 7/25/17.
 */
public class HardwareAcce {
    public volatile boolean mEncodingEnabled;
    public volatile boolean mDecodingEnabled;

    @Override
    public String toString() {
        return "HardwareAcce{" +
                "mEncodingEnabled=" + mEncodingEnabled +
                ", mDecodingEnabled=" + mDecodingEnabled +
                '}';
    }
}
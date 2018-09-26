package io.agora.amg.ui;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.ToggleButton;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Locale;

import io.agora.amg.R;
import io.agora.amg.model.AudioEffectItem;
import io.agora.amg.model.GlobalAudioEffectStatus;

/**
 * Created by Lucy on 7/25/17.
 */
public class AudioEffectsDialog extends DialogFragment{

    private boolean haveJoinedC = false;
    private boolean inAudioMixing = false;

    private ToggleButton btn_amix;

    private double localVol = 50.0;
    private double backVol = 100.0;
    private int backPos;

    private final static Logger log = LoggerFactory.getLogger(AudioEffectsDialog.class);

    private boolean mTouchOutside;

    private GlobalAudioEffectStatus mStatus;

    private ArrayList<AudioEffectItem> mAudioEffects;

    private DialogHandler mHandler;

    public interface DialogHandler {
//        void onAudioEffectStatusOped(String tag, AudioEffectItem effect);
//
//        void onAudioEffectPreloadOped(String tag, AudioEffectItem effect);

//        void onAudioEffectVolumeOped(String tag, AudioEffectItem effect);

        void onRecordingEffectVolumeOped(int volume);

        void onAudioMixingVolSet(Boolean inAudioMixing, int volume);

        void onAudioMixingModeSet(Boolean open, int volume);

        void onAudioEffectSystemVolume(int volume);



//        void onAudioEffectStatusOped(String tag, GlobalAudioEffectStatus status);

        void onAudioEffectVolumeOped(int volume);

        void onNegativeClicked(String tag);
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        LayoutInflater inflater = getActivity().getLayoutInflater();
        builder.setView(inflater.inflate(R.layout.audio_effect_list_dialog, null));

        return builder.create();
    }


    public void show(FragmentManager manager, String tag, GlobalAudioEffectStatus status, ArrayList<AudioEffectItem> effects, boolean touchOutside, boolean haveJoinedC) {
        this.mTouchOutside = touchOutside;
        this.mStatus = status;
        this.mAudioEffects = effects;
        this.haveJoinedC = haveJoinedC;
        super.show(manager, tag);
    }


    @Override
    public void onStart() {
        super.onStart();

        final AlertDialog dialog = (AlertDialog) getDialog();

        initAudioEffectStatus(dialog, mStatus);

        Button closeAudioEffects = (Button) dialog.findViewById(R.id.btn_close_audio_effects);
        closeAudioEffects.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                AudioEffectsDialog.this.dismissAllowingStateLoss();
            }
        });

        dialog.setCanceledOnTouchOutside(mTouchOutside);

        dialog.findViewById(R.id.btn_amix).setEnabled(haveJoinedC);

    }

    @Override
    public void onCancel(DialogInterface dialog) {
        AudioEffectsDialog.this.dismissAllowingStateLoss();
        AudioEffectsDialog.this.mHandler.onNegativeClicked(getTag());
    }

    private void initAudioEffectStatus(AlertDialog dialog, final GlobalAudioEffectStatus status) {

        btn_amix = (ToggleButton) dialog.findViewById(R.id.btn_amix);

        // Pitch Seekbar settings
        final TextView pvText = (TextView) dialog.findViewById(R.id.pitch_value_of_audio_effects);
        SeekBar pvSB = (SeekBar) dialog.findViewById(R.id.audio_pitch_value_bar);
        pvSB.setProgress((int) (status.getPitch() * 100.0f / 2.0f));
        pvSB.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    double pitch = progress * 2.0f / 100.0f;
                    //SetLocalVoicePitch
                    pvText.setText(String.format(Locale.US, "%.2f", pitch));

//                    if (mHandler == null) {
//                        return;
//                    }
//                    mHandler.onAudioEffectVolumeOped(getTag(), status);
                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });
        pvText.setText(String.format(Locale.US, "%.2f", status.getPitch()));


        // Voice Seekbar settings
        final TextView vvText = (TextView) dialog.findViewById(R.id.voice_value_of_audio_effects);
        SeekBar vvSB = (SeekBar) dialog.findViewById(R.id.audio_voice_value_bar);
        vvSB.setProgress((int) localVol);
        vvSB.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    localVol = progress;


                    vvText.setText(String.format(Locale.US, "%.2f", localVol));

                    if (mHandler == null) {
                        return;
                    }
                    mHandler.onRecordingEffectVolumeOped((int)localVol);
                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });
        vvText.setText(String.format(Locale.US, "%.2f", localVol));


        // Background Seekbar settings
        final TextView bvText = (TextView) dialog.findViewById(R.id.background_value_of_audio_effects);
        SeekBar bvSB = (SeekBar) dialog.findViewById(R.id.audio_background_value_bar);

        bvSB.setProgress((int) backVol);
        bvSB.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    backVol = progress;

                    bvText.setText(String.format(Locale.US, "%.2f", backVol));

                    if (mHandler == null) {
                        return;
                    }
                    if (inAudioMixing) {
                        mHandler.onAudioMixingVolSet(true, (int) backVol);
                    } else {
                        mHandler.onAudioMixingVolSet(false, (int) backVol);
                        log.debug("notinam: " + backVol);
                    }

                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });
        bvText.setText(String.format(Locale.US, "%.2f", backVol));


        // Effects(all) Seekbar settings
        final TextView evText = (TextView) dialog.findViewById(R.id.effect_value_of_audio_effects);
        SeekBar evSB = (SeekBar) dialog.findViewById(R.id.audio_effect_value_bar);
        evSB.setProgress((int) (status.getVolume()));
        evSB.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    double effect_vol = progress;
                    status.setVolume(effect_vol);

                    evText.setText(String.format(Locale.US, "%.2f", status.getVolume()));

                    if (mHandler == null) {
                        return;
                    }

                    if (haveJoinedC) {
                        log.debug("joinchannel 1 1");
                        mHandler.onAudioEffectVolumeOped((int) effect_vol);
                    } else {
                        mHandler.onAudioEffectSystemVolume((int) effect_vol);
                    }

                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });
        evText.setText(String.format(Locale.US, "%.2f", status.getVolume()));

        log.debug("btn_amix:" + btn_amix);
        btn_amix.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    if (mHandler == null) {
                        return;
                    }
                    inAudioMixing = true;
                    mHandler.onAudioMixingModeSet(true, 100);
                    log.debug("dialog start amix");
                } else {
                    if (mHandler == null) {
                        return;
                    }

                    inAudioMixing = false;
                    mHandler.onAudioMixingModeSet(false, 50);
                    log.debug("dialog stop amix");
                }
            }
        });
    }

    public void setDialogHandler(DialogHandler handler) {
        this.mHandler = handler;
    }

}

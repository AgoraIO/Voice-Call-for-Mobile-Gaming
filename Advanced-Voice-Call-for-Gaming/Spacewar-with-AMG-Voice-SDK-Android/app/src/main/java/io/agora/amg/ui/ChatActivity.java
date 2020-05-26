package io.agora.amg.ui;

import android.animation.Animator;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.PorterDuff;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.ScaleAnimation;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import io.agora.amg.R;
import io.agora.amg.model.AGEventHandler;
import io.agora.amg.model.AudioEffectItem;
import io.agora.amg.model.ConstantApp;
import io.agora.amg.model.GlobalAudioEffectStatus;
import io.agora.amg.ui.view.DragDropView;
import io.agora.rtc.IAudioEffectManager;
import io.agora.rtc.IRtcEngineEventHandler;
import io.agora.rtc.RtcEngine;

public class ChatActivity extends BaseActivity implements AGEventHandler {

    private DragDropView dragDropView;
    private RelativeLayout game;
    private RelativeLayout back;
    private RelativeLayout llContainerMain;

    private int effectVol = 50;
    private int effectVolC = 50;

    private MediaPlayer mPlayer;
    private MediaPlayer mPlayerS;

    private int direction_x;
    private int direction_y;

    private int[] dots;
    private int[] imageCordinates_star = new int[2];
    private int[] imageCordinates_user = new int[2];
    private int[] imageCordinates_spaceship = new int[2];

    private int speed_y;
    private int pos_x;
    private int size;

    private boolean haveJoinedC = false;

    private String channelName;

    private int mode;

    private LinearLayout layout_button;
    private ImageView btn_commander;
    private ImageView btn_mute;
    private boolean on_commander = false;

    private ImageView user_img;

    private final static Logger log = LoggerFactory.getLogger(ChatActivity.class);

    private volatile boolean mAudioMuted = false;

//    private volatile int mAudioRouting = -1; // Default

    private AudioEffectsDialog mAudioEffectsDialog;
    private GlobalAudioEffectStatus mAudioEffectStatus = new GlobalAudioEffectStatus();;
    private ArrayList<AudioEffectItem> mAudioEffects = new ArrayList<>();

    private static final String TAG_OPEN_DO_SHOW_AUDIO_SETTINGS = "OPEN_DO_SHOW_AUDIO_SETTINGS";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return false;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return false;
    }

    @Override
    protected void initUIandEvent() {

        event().addEventHandler(this);

        Intent i = getIntent();

        channelName = i.getStringExtra(ConstantApp.ACTION_KEY_CHANNEL_NAME);

        mode = i.getIntExtra("Mode", 0);

        llContainerMain = (RelativeLayout) findViewById(R.id.layout_drag);
        dragDropView = new DragDropView(this, llContainerMain);
        dragDropView.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT));
        llContainerMain.addView(dragDropView);

        layout_button = (LinearLayout) findViewById(R.id.layout_button);
//        game = (RelativeLayout) findViewById(R.id.layout_game);

        log.debug("gameis: " + game);

        setMusicEffect();

        TextView textChannelName = (TextView) findViewById(R.id.channel_name);
        textChannelName.setText(channelName);

        LinearLayout bottomContainer = (LinearLayout) findViewById(R.id.bottom_container);
        FrameLayout.MarginLayoutParams fmp = (FrameLayout.MarginLayoutParams) bottomContainer.getLayoutParams();
        fmp.bottomMargin = virtualKeyHeight() + 16;

        findViewById(R.id.spaceship).getLocationOnScreen(imageCordinates_spaceship);
    }

//    private Handler mMainHandler;
//
//    private static final int UPDATE_UI_MESSAGE = 0x1024;
//
//    EditText mMessageList;
//
//    StringBuffer mMessageCache = new StringBuffer();

//    private void notifyMessageChanged(String msg) {
//        if (mMessageCache.length() > 10000) { // drop messages
//            mMessageCache = new StringBuffer(mMessageCache.substring(10000 - 40));
//        }
//
//        mMessageCache.append(System.currentTimeMillis()).append(": ").append(msg).append("\n"); // append timestamp for messages
//
//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                if (isFinishing()) {
//                    return;
//                }
//
//                if (mMainHandler == null) {
//                    mMainHandler = new Handler(getMainLooper()) {
//                        @Override
//                        public void handleMessage(Message msg) {
//                            super.handleMessage(msg);
//
//                            if (isFinishing()) {
//                                return;
//                            }
//
//                            switch (msg.what) {
//                                case UPDATE_UI_MESSAGE:
//                                    String content = (String) (msg.obj);
//                                    mMessageList.setText(content);
//                                    mMessageList.setSelection(content.length());
//                                    break;
//
//                                default:
//                                    break;
//                            }
//
//                        }
//                    };
//
//                    mMessageList = (EditText) findViewById(R.id.msg_list);
//                }
//
//                mMainHandler.removeMessages(UPDATE_UI_MESSAGE);
//                Message envelop = new Message();
//                envelop.what = UPDATE_UI_MESSAGE;
//                envelop.obj = mMessageCache.toString();
//                mMainHandler.sendMessageDelayed(envelop, 1000l);
//            }
//        });
//    }

    private void optional() {
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);

        setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
    }

    private void optionalDestroy() {
    }

//    public void onSwitchSpeakerClicked(View view) {
//        log.info("onSwitchSpeakerClicked " + view + " " + mAudioMuted + " " + mAudioRouting);
//
//        RtcEngine rtcEngine = rtcEngine();
//        rtcEngine.setEnableSpeakerphone(mAudioRouting != 3);
//    }

    public void onSwitchSpeakerClicked(View view) {
        ImageView iv = (ImageView) view;
        if (!haveJoinedC) {
            checkAndJoinChannel();
            iv.setImageResource(R.drawable.btn_speaker_blue);
            haveJoinedC = true;
            log.debug("joinchannel 1");
        } else {
            checkAndLeaveChannel();
            iv.setImageResource(R.drawable.btn_speaker);
            haveJoinedC = false;
            log.debug("leavechannel");
        }
        log.debug("channelclick: " + haveJoinedC);
        log.debug("channelname: " + channelName);
    }

    @Override
    protected void deInitUIandEvent() {
        optionalDestroy();

        doLeaveChannel();
        event().removeEventHandler(this);
    }

    private void doLeaveChannel() {
        worker().leaveChannel(config().mChannel);
    }

    public void onEndCallClicked(View view) {
        log.info("onEndCallClicked " + view);

        quitCall();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();

        log.info("onBackPressed");

        quitCall();
    }

    private void quitCall() {
        mPlayer.stop();
        rtcEngine().stopAudioMixing();

        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);

        finish();
    }

    @Override
    public void onJoinChannelSuccess(String channel, final int uid, int elapsed) {
        String msg = "onJoinChannelSuccess " + channel + " " + (uid & 0xFFFFFFFFL) + " " + elapsed;
        log.debug(msg);

//        notifyMessageChanged(msg);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (isFinishing()) {
                    return;
                }

                rtcEngine().muteLocalAudioStream(mAudioMuted);
            }
        });
    }

    @Override
    public void onUserJoined(int uid, int elapsed) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                initUserImg();
            }
        });
        log.debug("OnUserJoined");
        Toast.makeText(this.getBaseContext(), "User Joined the channel", Toast.LENGTH_SHORT).show();
//        notifyMessageChanged("OnUserJoined");
    }

    @Override
    public void onUserOffline(int uid, int reason) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                rmvUserImg();
            }
        });
        String msg = "onUserOffline " + (uid & 0xFFFFFFFFL) + " " + reason;
        log.debug(msg);

//        notifyMessageChanged(msg);

    }

    @Override
    public void onExtraCallback(final int type, final Object... data) {

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (isFinishing()) {
                    return;
                }

                doHandleExtraCallback(type, data);
            }
        });
    }

    private void doHandleExtraCallback(int type, Object... data) {
        int peerUid;
        boolean muted;

        switch (type) {
            case AGEventHandler.EVENT_TYPE_ON_USER_AUDIO_MUTED: {
                peerUid = (Integer) data[0];
                muted = (boolean) data[1];

//                notifyMessageChanged("mute: " + (peerUid & 0xFFFFFFFFL) + " " + muted);
                break;
            }

            case AGEventHandler.EVENT_TYPE_ON_AUDIO_QUALITY: {
                peerUid = (Integer) data[0];
                int quality = (int) data[1];
                short delay = (short) data[2];
                short lost = (short) data[3];

//                notifyMessageChanged("quality: " + (peerUid & 0xFFFFFFFFL) + " " + quality + " " + delay + " " + lost);
                break;
            }

            case AGEventHandler.EVENT_TYPE_ON_SPEAKER_STATS: {
                IRtcEngineEventHandler.AudioVolumeInfo[] infos = (IRtcEngineEventHandler.AudioVolumeInfo[]) data[0];

                if (infos.length == 1 && infos[0].uid == 0) { // local guy, ignore it
                    break;
                }

                StringBuilder volumeCache = new StringBuilder();
                for (IRtcEngineEventHandler.AudioVolumeInfo each : infos) {
                    peerUid = each.uid;
                    int peerVolume = each.volume;

                    if (peerUid == 0) {
                        continue;
                    }

                    volumeCache.append("volume: ").append(peerUid & 0xFFFFFFFFL).append(" ").append(peerVolume).append("\n");
                }

                if (volumeCache.length() > 0) {
                    String volumeMsg = volumeCache.substring(0, volumeCache.length() - 1);
//                    notifyMessageChanged(volumeMsg);

                    if ((System.currentTimeMillis() / 1000) % 10 == 0) {
                        log.debug(volumeMsg);
                    }
                }
                break;
            }

            case AGEventHandler.EVENT_TYPE_ON_APP_ERROR: {
                int subType = (int) data[0];

                if (subType == ConstantApp.AppError.NO_NETWORK_CONNECTION) {
                    showLongToast(getString(R.string.msg_no_network_connection));
                }

                break;
            }

            case AGEventHandler.EVENT_TYPE_ON_AGORA_MEDIA_ERROR: {
                int error = (int) data[0];
                String description = (String) data[1];

//                notifyMessageChanged(error + " " + description);

                break;
            }

            case AGEventHandler.EVENT_TYPE_ON_AUDIO_ROUTE_CHANGED: {
                notifyHeadsetPlugged((int) data[0]);

                break;
            }
        }
    }

    public void notifyHeadsetPlugged(final int routing) {
        log.info("notifyHeadsetPlugged " + routing);

//        mAudioRouting = routing;

//        ImageView iv = (ImageView) findViewById(R.id.switch_speaker_id);
//        if (mAudioRouting == 3) { // Speakerphone
//            iv.setColorFilter(getResources().getColor(R.color.agora_blue), PorterDuff.Mode.MULTIPLY);
//        } else {
//            iv.clearColorFilter();
//        }
    }

    public void onSettingClicked(View view){

        final IAudioEffectManager aeMgr = rtcEngine().getAudioEffectManager();

        if (mAudioEffectsDialog == null) {
            mAudioEffectsDialog = new AudioEffectsDialog();

//            mAudioEffectStatus = new GlobalAudioEffectStatus();
        }

        if (mAudioEffectsDialog.isAdded()) {
            return;
        }

        mAudioEffectsDialog.show(getFragmentManager(), TAG_OPEN_DO_SHOW_AUDIO_SETTINGS, mAudioEffectStatus, mAudioEffects, false, haveJoinedC);

        mAudioEffectsDialog.setDialogHandler(new AudioEffectsDialog.DialogHandler() {

//            @Override
//            public void onAudioEffectStatusOped(String tag, GlobalAudioEffectStatus status) {
//                log.debug("onAudioEffectStatusOped " + status);
//
//                switch (status.getStatus()) {
//                    case AudioEffectItem.STATUS_PAUSING:
//                        aeMgr.pauseAllEffects();
//                        break;
//                    case AudioEffectItem.STATUS_STOPPING:
//                        aeMgr.stopAllEffects();
//                        break;
//                    case AudioEffectItem.STATUS_RESUMING:
//                        aeMgr.resumeAllEffects();
//                        break;
//                }
//            }
//
//            @Override
//            public void onAudioEffectStatusOped(String tag, AudioEffectItem status) {
//                log.debug("onAudioEffectStatusOped " + status);
//
//                switch (status.getStatus()) {
//                    case AudioEffectItem.STATUS_PAUSING:
//                        aeMgr.pauseEffect(status.getId());
//                        break;
//                    case AudioEffectItem.STATUS_STOPPING:
//                        aeMgr.stopEffect(status.getId());
//                        break;
//                    case AudioEffectItem.STATUS_RESUMING:
//                        aeMgr.resumeEffect(status.getId());
//                        break;
//                    case AudioEffectItem.STATUS_PLAYING:
//                        String effectFile = AppUtil.APP_DIRECTORY + File.separator + "music" + File.separator + status.getPath();
//                        aeMgr.playEffect(status.getId(), effectFile, status.isLooping(), mAudioEffectStatus.getPitch(), mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
//                        break;
//                }
//            }

//            @Override
//            public void onAudioEffectVolumeOped(String tag, AudioEffectItem volume) {
//                mPlayerS.stop();
//                log.debug("mplayers stop");
//                aeMgr.setVolumeOfEffect(volume.getId(), volume.getVolume());
//                log.debug("mplayers stop");
//            }

            @Override
            public void onAudioEffectVolumeOped(int volume) {

                log.debug("mplayers stop");
                effectVolC = volume;
            }

            @Override
            public void onAudioEffectSystemVolume(int volume) {
                effectVol = volume;
            }

            @Override
            public void onRecordingEffectVolumeOped(int volume) {
                rtcEngine().adjustRecordingSignalVolume(volume);
            }

            @Override
            public void onAudioMixingVolSet(Boolean inAudioMixing, int volume) {
                if (inAudioMixing) {
                    rtcEngine().adjustAudioMixingVolume(volume);
//                    rtcEngine().setAudioMixingPosition(mPlayer.getCurrentPosition());
//                    mPlayer.pause();
//                    rtcEngine().startAudioMixing(PATH + "/raw/" + "mario.mp3", true, false, -1);
//                    log.debug("Start AudioMixing");

                } else {
                    mPlayer.setVolume(volume / 100.0f, volume / 100.0f);
                    log.debug("notinam2: " + volume);
//                    mPlayer.seekTo(rtcEngine().getAudioMixingCurrentPosition());
//                    rtcEngine().stopAudioMixing();
//                    mPlayer.start();
                }
            }

            @Override
            public void onAudioMixingModeSet(Boolean open, int volume) {
                if (open) {
                    int pos = mPlayer.getCurrentPosition();
                    mPlayer.pause();
                    log.debug("Start AudioMixing: " + mPlayer.getCurrentPosition());
                    rtcEngine().startAudioMixing("/assets/space.mp3", true, false, 0);
                    rtcEngine().adjustAudioMixingVolume(volume);
                    rtcEngine().setAudioMixingPosition(pos);

                } else {
                    mPlayer.setVolume(volume / 100.0f, volume / 100.0f);
                    mPlayer.seekTo(rtcEngine().getAudioMixingCurrentPosition());
                    rtcEngine().stopAudioMixing();
                    mPlayer.start();
                    mPlayer.setLooping(true);
                }
            }

//            @Override
//            public void onAudioEffectPreloadOped(String tag, AudioEffectItem preload) {
//                log.debug("onAudioEffectPreloadOped " + preload);
//            }


            @Override
            public void onNegativeClicked(String tag) {

            }
        });
    }

    public void onShoot(){

        if (haveJoinedC){
            final IAudioEffectManager aeMgr = rtcEngine().getAudioEffectManager();

            log.debug("onshoot onc");

            // Replay shoot sound effect each time the button is clicked
            if (mAudioEffects.get(0).getStatus() == AudioEffectItem.STATUS_PLAYING) {
                log.debug("effectplaying");
                aeMgr.stopEffect(mAudioEffects.get(0).getId());
                aeMgr.setEffectsVolume(effectVolC);
                aeMgr.playEffect(mAudioEffects.get(0).getId(), "/assets/shoot.mp3", 0, mAudioEffectStatus.getPitch(), mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
            } else {
                log.debug("effectnotplaying");
                mAudioEffects.get(0).setStatus(AudioEffectItem.STATUS_PLAYING);
                log.debug("effectVolC: " + effectVolC);
                aeMgr.playEffect(mAudioEffects.get(0).getId(), "/assets/shoot.mp3", 0, mAudioEffectStatus.getPitch(), mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
                aeMgr.setEffectsVolume(effectVolC);
            }
        } else {
//            Uri uri = Uri.parse(PATH + "/raw/" + "shoot.mp3");
            mPlayerS = MediaPlayer.create(this, R.raw.shoot);
            mPlayerS.setVolume(effectVol / 100.0f, effectVol / 100.0f);
            if (mPlayerS.isPlaying()){
                mPlayerS.stop();
                mPlayerS.start();
            } else {
                mPlayerS.start();
            }
        }


    }

    public void createBackgroundAnim(){

        dots = new int[]{R.id.dot1, R.id.dot2, R.id.dot3};

        int count = dots.length;

        while (count != 0) {
            Random rand = new Random();
            pos_x = rand.nextInt(1046) + 50;
            speed_y = rand.nextInt(4000) + 4000;
            size = rand.nextInt(15) + 5;

            ImageView dot = new ImageView(ChatActivity.this);
            dot.setX(pos_x);
            dot.setY(0);
            dot.setImageResource(R.drawable.oval);
            dot.setId(dots[count - 1]);
            RelativeLayout.LayoutParams layoutParams  = new
                    RelativeLayout.LayoutParams(size, size);
            dot.setLayoutParams(layoutParams);

            back = (RelativeLayout) findViewById(R.id.layout_bottom);
            back.addView(dot);

            dot.animate().setListener(new Animator.AnimatorListener() {
                @Override
                public void onAnimationStart(Animator animator) {

                }

                @Override
                public void onAnimationEnd(Animator animator) {
                    RelativeLayout back = (RelativeLayout) findViewById(R.id.layout_bottom);
                    back.removeView(findViewById(dots[dots.length - 1]));
                }

                @Override
                public void onAnimationCancel(Animator animator) {

                }

                @Override
                public void onAnimationRepeat(Animator animator) {

                }
            });
            count --;
            dot.animate().translationY(2000).setDuration(speed_y).start();
        }

    }

    //    ScheduledExecutorService executorService = new Sche


    public void createBackgroundDot(){


        findViewById(R.id.dot1).animate().translationY(2000).setDuration(speed_y).start();

    }

    public void checkAndJoinChannel(){
        setMusicEffectOnJoin();
        if (mode == 1 || mode == 2) {
            if (mode == 1){
                initMuteBtn();
            }
            initCommanderBtn();
        }
        log.debug("mAudioEffects" + mAudioEffects);
        worker().joinChannel(channelName, config().mUid);
        optional();
        Toast.makeText(this.getBaseContext(), "You have joined Channel: " + channelName, Toast.LENGTH_SHORT).show();
    }

    public void checkAndLeaveChannel(){
        if (mode == 1 || mode == 2) {
            if (mode == 1){
                rmvMuteBtn();
            }
            rmvCommanderBtn();
        }

        if (user_img != null){
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    rmvUserImg();
                }
            });
        }
        Toast.makeText(this.getBaseContext(), "You have left Channel: " + channelName, Toast.LENGTH_SHORT).show();
        worker().leaveChannel(channelName);
//        setMusicEffect();
    }

    public void setMusicEffect(){
        mPlayer = MediaPlayer.create(this, R.raw.space);
        mPlayer.start();
        mPlayer.setLooping(true);
    }

    public void setMusicEffectOnJoin(){

        if (mAudioEffects.size() == 0){
            mAudioEffects.add(new AudioEffectItem("/assets/shoot.mp3", AudioEffectItem.STATUS_INIT, 50.0, false, false));
            mAudioEffects.add(new AudioEffectItem("/assets/boom.mp3", AudioEffectItem.STATUS_INIT, 50.0, false, false));
        }

        //PATH + "/raw/" + "shoot.mp3"

//        String path = PATH + "/raw/" + "mario.mp3";
//        String effectFile_0 = "/assets/mario.mp3";
//        aeMgr.playEffect(mAudioEffects.get(0).getId(), effectFile_0, true, mAudioEffectStatus.getPitch(), mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
//        log.debug("effectfile " + effectFile_0);
    }

    public void createShootingStar(){
        game.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:

                        ImageView star = new ImageView(ChatActivity.this);

                        star.setImageResource(R.drawable.star);
                        star.setId(R.id.star);
                        star.setScaleType(ImageView.ScaleType.CENTER);

                        game.addView(star);

                        //screen touch get x and y of the touch event
                        direction_x = (int) (motionEvent.getX() -
                                (imageCordinates_spaceship[0] + findViewById(R.id.spaceship).getWidth() / 2)) * 100;
                        direction_y = (int) (motionEvent.getY() -
                                (imageCordinates_spaceship[1] + findViewById(R.id.spaceship).getHeight() / 2)) * 100;


                        log.debug("motionx: " + motionEvent.getX() + "motiony: " + motionEvent.getY() +
                                "starx: " + (int) (imageCordinates_spaceship[0] + findViewById(R.id.spaceship).getWidth() / 2) +
                                "stary: " + (int) (imageCordinates_spaceship[1] + findViewById(R.id.spaceship).getHeight() / 2));

                        // Remove star when animation is finished (when star surely out of screen)
                        star.animate().setListener(new Animator.AnimatorListener() {
                            @Override
                            public void onAnimationStart(Animator animator) {

                            }

                            @Override
                            public void onAnimationEnd(Animator animator) {
                                game.removeView(findViewById(R.id.star));
                            }

                            @Override
                            public void onAnimationCancel(Animator animator) {

                            }

                            @Override
                            public void onAnimationRepeat(Animator animator) {
                            }
                        });

                        star.animate().translationX(direction_x).translationY(direction_y).setDuration(4000).start();
                        onShoot();


                        if (haveJoinedC) {
                            ScheduledThreadPoolExecutor  executor = new ScheduledThreadPoolExecutor(1);
                            executor.scheduleAtFixedRate(new Runnable() {
                                @Override
                                public void run() {

                                    runOnUiThread(new Runnable() {
                                        @Override
                                        public void run() {
                                            if (findViewById(R.id.star) != null){
                                                log.debug("in intersects");
                                                if (user_img != null){
                                                    collisionDetect((ImageView) findViewById(R.id.star));
                                                }
                                            }

                                        }
                                    });
                                }
                            }, 0, 100L, TimeUnit.MILLISECONDS);
                        }

                        break;

                    case MotionEvent.ACTION_UP:

                        break;

                    case MotionEvent.ACTION_MOVE:

                        break;
                }

                return true;
            }
        });
    }

    @Override
    protected void onResume(){
        super.onResume();

        game = (RelativeLayout) findViewById(R.id.layout_game);

        ScheduledThreadPoolExecutor  executor = new ScheduledThreadPoolExecutor(1);
        executor.scheduleAtFixedRate(new Runnable() {

            @Override
            public void run() {

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        createBackgroundAnim();
                    }
                });
            }
        }, 0, 1L, TimeUnit.SECONDS);

        createShootingStar();
    }

    public void initCommanderBtn(){

        btn_commander = new ImageView(this);
        if (mode == 1) {
            btn_commander.setImageResource(R.drawable.btn_commander_blue);
            on_commander = true;
        } else {
            btn_commander.setImageResource(R.drawable.btn_commander);
            on_commander = false;
        }
        btn_commander.setScaleType(ImageView.ScaleType.CENTER);

        // Calculate the correct position of button according to screen scale
        final float scale = this.getResources().getDisplayMetrics().density;
        int pixels = (int) (54 * scale + 0.5f);
        btn_commander.setLayoutParams(new LinearLayout.LayoutParams(pixels, LinearLayout.LayoutParams.MATCH_PARENT));

        layout_button.addView(btn_commander);

        btn_commander.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onCommanderClicked(view);
            }
        });
    }

    public void rmvCommanderBtn(){
        layout_button.removeView(btn_commander);
        btn_commander = null;
    }

    public void onCommanderClicked(View view){
        if (on_commander){
            btn_commander.setImageResource(R.drawable.btn_commander);
            on_commander = false;
            mode = 2;
            Toast.makeText(this.getBaseContext(), "To Audience Mode", Toast.LENGTH_SHORT).show();
            rmvMuteBtn();
        } else {
            if (btn_mute == null){
                //To remain the order of the buttons
                rmvCommanderBtn();
                initMuteBtn();
                initCommanderBtn();
                log.debug("initMuteBtn");
            }
            btn_commander.setImageResource(R.drawable.btn_commander_blue);
            on_commander = true;
            mode = 1;
            log.debug("on_commander: " + on_commander);
            Toast.makeText(this.getBaseContext(), "To Commander Mode", Toast.LENGTH_SHORT).show();
        }
    }

    public void initMuteBtn(){

        btn_mute = new ImageView(this);
        btn_mute.setImageResource(R.drawable.btn_mute);
        btn_mute.setScaleType(ImageView.ScaleType.CENTER);

        // Calculate the correct position of button according to screen scale
        final float scale = this.getResources().getDisplayMetrics().density;
        int pixels = (int) (54 * scale + 0.5f);
        btn_mute.setLayoutParams(new LinearLayout.LayoutParams(pixels, LinearLayout.LayoutParams.MATCH_PARENT));

        layout_button.addView(btn_mute);

        btn_mute.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onVoiceMuteClicked(view);
            }
        });
    }

    public void rmvMuteBtn(){
        layout_button.removeView(btn_mute);
        btn_mute = null;
    }

    public void onVoiceMuteClicked(View view) {
        log.info("onVoiceMuteClicked " + view + " audio_status: " + mAudioMuted);

        RtcEngine rtcEngine = rtcEngine();
        rtcEngine.muteLocalAudioStream(mAudioMuted = !mAudioMuted);

        ImageView iv = (ImageView) view;

        if (mAudioMuted) {
            Toast.makeText(this.getBaseContext(), "Voice Muted", Toast.LENGTH_SHORT).show();
            btn_mute.setImageResource(R.drawable.btn_mute_blue);
        } else {
            Toast.makeText(this.getBaseContext(), "Voice Resumed", Toast.LENGTH_SHORT).show();
            btn_mute.setImageResource(R.drawable.btn_mute);
        }
    }

    public void initUserImg(){
        user_img = new ImageView(this);
        user_img.setImageResource(R.drawable.user);
        dragDropView.AddDraggableView(user_img, imageCordinates_spaceship[0],
                findViewById(R.id.layout_drag).getHeight() / 2,
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT);
    }

    public void rmvUserImg(){
        dragDropView.removeView(user_img);
        user_img = null;
        log.debug("rmvuserimg");
    }

    public void collisionDetect(ImageView star){
//        imageCordinates_user = new int[2];
//        imageCordinates_star = new int[2];
        star.getLocationOnScreen(imageCordinates_star);
        user_img.getLocationOnScreen(imageCordinates_user);
        log.debug("incollision");

        if ((imageCordinates_user[0] + user_img.getWidth()) > imageCordinates_star[0] && (imageCordinates_star[0] + star.getWidth()) > imageCordinates_user[0] &&
                (imageCordinates_user[1] + user_img.getHeight()) > imageCordinates_star[1] && (imageCordinates_star[1] + star.getHeight()) > imageCordinates_user[1]){

            final IAudioEffectManager aeMgr = rtcEngine().getAudioEffectManager();

            // Replay shoot sound effect each time the button is clicked
            if (mAudioEffects.get(1).getStatus() == AudioEffectItem.STATUS_PLAYING) {
                aeMgr.stopEffect(mAudioEffects.get(1).getId());
                aeMgr.setEffectsVolume(effectVolC);
                aeMgr.playEffect(mAudioEffects.get(1).getId(), "/assets/boom.mp3", 0, mAudioEffectStatus.getPitch(),
                        mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
            } else {
                mAudioEffects.get(1).setStatus(AudioEffectItem.STATUS_PLAYING);
                aeMgr.playEffect(mAudioEffects.get(1).getId(), "/assets/boom.mp3", 0, mAudioEffectStatus.getPitch(),
                        mAudioEffectStatus.getPan(), mAudioEffectStatus.getGain());
                aeMgr.setEffectsVolume(effectVolC);
            }


            // Animate user_img when collides with star
            Animation anim = new ScaleAnimation(
                    1f, 1.1f, // Start and end values for the X axis scaling
                    1f, 1.1f, // Start and end values for the Y axis scaling
                    Animation.RELATIVE_TO_SELF, 0.5f, // Pivot point of X scaling
                    Animation.RELATIVE_TO_SELF, 0.5f);

            anim.setFillEnabled(true);
            anim.setDuration(100);

            user_img.startAnimation(anim);

            // Remove star view when star collides with user_img
            game.removeView(star);

            log.debug("collisiondetects");
        }
    }

}

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

using agora_gaming_rtc;

public class GameController : MonoBehaviour {
	public Text channelNameText;
	public MessageText messageText;
	public Canvas uiGrid;
	public SettingsCanvas settingsCanvas;
	public GameObject bgmObject;

	public PitchSlider pitchSlider;
	public VoiceSlider voiceSlider;
	public BGMSlider bgmSlider;
	public EffectSlider effectSlider;

	public Speaker speaker;
	public Speaker selectedSpeaker;
	public Dictionary<uint, Speaker> addedSpeakers = new Dictionary<uint, Speaker>();

	public Vector2 defaultSpeakerPosition;
	private Rect availablePeerRect = new Rect(-2.5f,3.5f,5f,4.7f);
	private MessageText currentMessageText;

	private IRtcEngine mRtcEngine = null;
	private bool isInAgoraAudio = false;
	private bool useAudioMixing = true;
	private AudioSource bgmAudioSource;
	public Text versionText;

	void Start () {
		ShowChannelName ();
		bgmAudioSource = bgmObject.GetComponent<AudioSource> () as AudioSource;

		LoadAgoraKit ();
	}

	void Awake() {
		QualitySettings.vSyncCount = 0;
		Application.targetFrameRate = 30;
	}

	void OnApplicationPause(bool pauseStatus) {
		if (pauseStatus) {
			mRtcEngine.Pause ();
		} else {
			mRtcEngine.Resume ();
		}
	}

	void Update () {
		if (mRtcEngine != null) {
			mRtcEngine.Poll ();
		}
	}

	void ShowChannelName () {
		channelNameText.text = ApplicationModal.ChannelName;
	}

	public void DisplaySettingsCanvas (bool display) {
		settingsCanvas.SetDisplay (display);
	}

	void LoadAgoraKit () {
		mRtcEngine = IRtcEngine.GetEngine (ApplicationModal.AppId);

		mRtcEngine.SetLogFilter (LOG_FILTER.DEBUG);
		string rtcLogFile = LocalLogFilePath ();
		mRtcEngine.SetLogFile (rtcLogFile);
		Debug.Log (string.Format ("SetLogFile {0}", rtcLogFile));
		versionText.GetComponent<Text> ().text = "Version : " + IRtcEngine.GetSdkVersion ();
		Debug.Log (" SDK  version  =  " + IRtcEngine.GetSdkVersion ());
		if (ApplicationModal.AudioGameProfile == 0) {
			mRtcEngine.SetChannelProfile (CHANNEL_PROFILE.GAME_FREE_MODE);
		} else {
			mRtcEngine.SetChannelProfile (CHANNEL_PROFILE.GAME_COMMAND_MODE);
		}

		mRtcEngine.EnableAudioVolumeIndication (200, 3);
		LoadEngineCallbacks ();
	}

	//callbacks
	void EngineOnJoinChannelSuccess (string channelName, uint uid, int elapsed) {
		string joinSuccessMessage = string.Format ("joinChannel callback channel {0}, uid: {1}, elapsed: {2}", channelName, Convert.ToString (uid), Convert.ToString (elapsed));
		Debug.Log (joinSuccessMessage);

		if (useAudioMixing) {
			SwitchBackGroundMusicToAudioMixing ();
		}
	}

	void EngineOnLeaveChannel (RtcStats stats) {
		string leaveChannelMessage = string.Format ("leaveChannel callback duration {0}, tx: {1}, rx: {2}, tx kbps: {3}, rx kbps: {4}", stats.duration, stats.txBytes, stats.rxBytes, stats.txKBitRate, stats.rxKBitRate);
		Debug.Log (leaveChannelMessage);
	}

	void EngineOnUserJoined (uint uid, int elapsed) {
		string userJoinedMessage = string.Format ("onUserJoined callback uid {0} {1}", uid, elapsed);
		Debug.Log (userJoinedMessage);

		AddSpeaker (uid);
	}

	void EngineOnUserOffline (uint uid, USER_OFFLINE_REASON reason) {
		string userOfflineMessage = string.Format ("onUserOffline callback uid {0} {1}", uid, reason);
		Debug.Log (userOfflineMessage);

		RemoveSpeaker (uid);
	}

	void EngineOnVolumeIndication (AudioVolumeInfo[] speakers, int speakerNumber, int totalVolume) {
		foreach (AudioVolumeInfo volumeInfo in speakers) {
			Speaker speaker;
			if (addedSpeakers.TryGetValue (volumeInfo.uid, out speaker)) {
				uint volume = volumeInfo.volume;
				speaker.SetVolume(volume);
			}
		}
	}

	void EngineOnError (int error, string msg) {
		AlertString ("Engine error: " + error);
	}

	void EngineOnWarning (int warn, string msg) {
		AlertString ("Engine warning: " + warn);
	}

	void LoadEngineCallbacks () {
		mRtcEngine.OnJoinChannelSuccess += EngineOnJoinChannelSuccess;
		mRtcEngine.OnLeaveChannel += EngineOnLeaveChannel;
		mRtcEngine.OnUserJoined += EngineOnUserJoined;
		mRtcEngine.OnUserOffline += EngineOnUserOffline;
		mRtcEngine.OnVolumeIndication += EngineOnVolumeIndication;
		mRtcEngine.OnError += EngineOnError;
		mRtcEngine.OnWarning += EngineOnWarning;
	}

	public void UnLoadEngineCallbacks () {
		mRtcEngine.OnJoinChannelSuccess -= EngineOnJoinChannelSuccess;
		mRtcEngine.OnLeaveChannel -= EngineOnLeaveChannel;
		mRtcEngine.OnUserJoined -= EngineOnUserJoined;
		mRtcEngine.OnUserOffline -= EngineOnUserOffline;
		mRtcEngine.OnVolumeIndication -= EngineOnVolumeIndication;
		mRtcEngine.OnError -= EngineOnError;
		mRtcEngine.OnWarning -= EngineOnWarning;
	}

	void AlertString (string message) {
		if (currentMessageText != null) {
			Destroy (currentMessageText.gameObject);
			currentMessageText = null;
		}

		MessageText text = Instantiate (messageText);
		text.transform.SetParent (uiGrid.transform, false);
		text.SetupText (message);

		currentMessageText = text;
	}

	//added speaker
	void AddSpeaker (uint uid) {
		if (!addedSpeakers.ContainsKey (uid)) {
			Speaker newSpeaker = Instantiate (speaker, defaultSpeakerPosition, transform.rotation) as Speaker;
			newSpeaker.SetupController (this);
			addedSpeakers.Add (uid, newSpeaker);
		}
	}

	void RemoveSpeaker (uint uid) {
		if (addedSpeakers.ContainsKey (uid)) {
			Speaker speaker = addedSpeakers [uid];
			addedSpeakers.Remove (uid);

			if (speaker) {
				Destroy (speaker.gameObject);
			}
		}
	}

	void RemoveAllSpeakers () {
		foreach (KeyValuePair<uint, Speaker> entry in addedSpeakers) {
			Speaker speaker = entry.Value;
			Destroy (speaker.gameObject);
		}
		addedSpeakers.Clear ();
	}

	uint UidOfSpeaker (Speaker speaker) {
		foreach (KeyValuePair<uint, Speaker> entry in addedSpeakers) {
			if (entry.Value == speaker) {
				return entry.Key;
			}
		}
		return 0;
	}

	//touch pad
	public Rect TouchPadAvailablePeerRect () {
		return availablePeerRect;
	}

	public void TouchPadDidMoveSpeaker (Speaker speaker) {
		uint uid = UidOfSpeaker (speaker);
		if (uid == 0) {
			return;
		}

		Vector2 postion = speaker.transform.position;
		Vector2 panAndGain = PanAndGain (postion);
		Double pan = panAndGain.x;
		Double gain = panAndGain.y;

		IAudioEffectManager effectManager = mRtcEngine.GetAudioEffectManager ();
		effectManager.SetRemoteVoicePosition (uid, pan, gain);
	}

	//speaker
	public bool SpeakerShouldPlayCollideSound () {
		return !isInAgoraAudio;
	}

	public void SpeakerCollided (Speaker speaker) {
		IAudioEffectManager effectManager = mRtcEngine.GetAudioEffectManager ();
		string localPath = LocalAudioFilePath ("boom.mp3");

		Vector2 postion = speaker.transform.position;
		Vector2 panAndGain = PanAndGain (postion);
		Double pan = panAndGain.x;

		effectManager.PlayEffect (1, localPath, false, 1D, pan, 100D);
	}

	//Agora Audio Engine
	public void JoinChannel () {
		if (mRtcEngine == null) {
			Debug.Log ("no mRtcEngine!");
			return;
		}

		mRtcEngine.JoinChannel (ApplicationModal.ChannelName, "", 0);
		isInAgoraAudio = true;

		if (ApplicationModal.AudioGameProfile == 1) {

        #if UNITY_IOS || UNITY_ANDROID
			mRtcEngine.SetClientRole (CLIENT_ROLE.BROADCASTER);
        #else
			mRtcEngine.SetClientRole (CLIENT_ROLE.AUDIENCE);
        #endif

		} else if (ApplicationModal.AudioGameProfile == 2) {

        #if UNITY_IOS || UNITY_ANDROID
			mRtcEngine.SetClientRole (CLIENT_ROLE.AUDIENCE);
        #else
			mRtcEngine.SetClientRole (CLIENT_ROLE.AUDIENCE);
        #endif

		}

		SetLocalVoicePitch (pitchSlider.PitchValue ());
		AdjustRecordingSignalVolume (voiceSlider.VoiceValue ());
		AdjustAudioMixingVolume (bgmSlider.BGMValue ());
		SetEffectsVolume (effectSlider.EffectValue ());
	}

	public void LeaveChannel () {
		if (isInAgoraAudio) {
			mRtcEngine.LeaveChannel ();
		}

		SwitchBackGroundMusicToPlayer ();

		isInAgoraAudio = false;
		RemoveAllSpeakers ();
		settingsCanvas.SetToDefault ();
	}

	public void MuteSelf (bool shouldMute) {
		mRtcEngine.MuteLocalAudioStream (shouldMute);
	}

	public void CommanderChange (bool isCommander) {
		if (isInAgoraAudio) {
			CLIENT_ROLE role = isCommander ? CLIENT_ROLE.BROADCASTER : CLIENT_ROLE.AUDIENCE;
        #if UNITY_IOS || UNITY_ANDROI
			mRtcEngine.SetClientRole (role);
        #else
			mRtcEngine.SetClientRole (role);
        #endif           

		}
	}

	//settings canvas
	public void PitchValueChanged (float value) {
		SetLocalVoicePitch (value);
	}

	public void VoiceValueChanged (float value) {
		AdjustRecordingSignalVolume ((int)value);
	}

	public void BGMValueChanged (float value) {
		AdjustAudioMixingVolume (((int)value));
	}

	public void EffectValueChanged (float value) {
		SetEffectsVolume (value);
	}

	public void AudioMixingValueChanged (bool value) {
		if (useAudioMixing == value) {
			return;
		}

		useAudioMixing = value;

		if (isInAgoraAudio) {
			if (useAudioMixing) {
				SwitchBackGroundMusicToAudioMixing ();
			} else {
				SwitchBackGroundMusicToPlayer ();
			}
		}
	}

	void SetLocalVoicePitch (float value) {
		if (isInAgoraAudio) {
			IAudioEffectManager effectManager = mRtcEngine.GetAudioEffectManager ();
			effectManager.SetLocalVoicePitch (value);
		}
	}

	void AdjustRecordingSignalVolume (float value) {
		if (isInAgoraAudio) {
			mRtcEngine.AdjustRecordingSignalVolume ((int)value);
		}
	}

	void AdjustAudioMixingVolume (float value) {
		if (isInAgoraAudio) {
			mRtcEngine.AdjustAudioMixingVolume (((int)value));
		}
	}

	void SetEffectsVolume (float value) {
		if (isInAgoraAudio) {
			IAudioEffectManager effectManager = mRtcEngine.GetAudioEffectManager ();
			effectManager.SetEffectsVolume (value);
		}
	}

	//point
	Vector2 PanAndGain (Vector2 point) {
		Vector2 midBottom = new Vector2(x: (availablePeerRect.xMax + availablePeerRect.xMin)/2, y: availablePeerRect.yMin);
		Vector2 direction = point - midBottom;

		float pan = 0;
		if (direction == Vector2.zero) {
			pan = 0;
		} else if (direction.y == 0) {
			pan = direction.x > 0 ? 1 : -1;
		} else {
			pan = Mathf.Atan (direction.x / direction.y) / Mathf.PI * 2;
		}

		float gain = 100f - 50f * direction.magnitude / availablePeerRect.height;
		if (gain < 20) {
			gain = 20f;
		}

		return new Vector2 (pan, gain);
	}

	//audio
	void SwitchBackGroundMusicToPlayer () {
		if (bgmAudioSource.isPlaying) {
			return;
		}

		int position = mRtcEngine.GetAudioMixingCurrentPosition ();
		float time = ((float)position) / 1000;

		mRtcEngine.StopAudioMixing ();

		bgmAudioSource.time = time;
		bgmAudioSource.Play ();
	}

	void SwitchBackGroundMusicToAudioMixing () {
		if (!bgmAudioSource.isPlaying) {
			return;
		}

		int time = (int)(bgmAudioSource.time * 1000);
		bgmAudioSource.Stop ();

		string localPath = LocalAudioFilePath ("space.mp3");
		mRtcEngine.StartAudioMixing (localPath, true, false, -1, playTime: time);
	}

	string LocalAudioFilePath (string subPath) {
		#if UNITY_ANDROID
		string localPath= Application.persistentDataPath + "/Audio/" + subPath;
		if (!System.IO.File.Exists(localPath)) {
			CopyFileFromStreamingAssets (subPath);
		}

		return localPath;

		#else
		return Application.streamingAssetsPath + "/Audio/" + subPath;
		#endif
	}

	string LocalLogFilePath () {
		return Application.persistentDataPath + "/agorasdk.log";
	}

	void CopyFileFromStreamingAssets (string subPath) {
		string jarPath = Application.streamingAssetsPath + "/Audio/" + subPath;

		WWW fileWWW = new WWW(jarPath);

		while (!fileWWW.isDone) {
//			Debug.Log ("=== fileWWW is not Done");
		}

		string persistentPath = Application.persistentDataPath + "/Audio";
		if (!System.IO.Directory.Exists(persistentPath)) {
			System.IO.Directory.CreateDirectory (persistentPath);
		}

		System.IO.File.WriteAllBytes(persistentPath + "/" + subPath, fileWWW.bytes);
	}

	void OnApplicationFocus (bool isFocus) {  
		if (isFocus) {  
			if (mRtcEngine!=null) {
				mRtcEngine.EnableAudio ();
			}
			Debug.Log ("agora  isFocus");             
		} else {  
			Debug.Log ("agora   unfocus");
		}  
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SettingsCanvas : MonoBehaviour {

	public PitchSlider pitchSlider;
	public VoiceSlider voiceSlider;
	public BGMSlider bgmSlider;
	public EffectSlider effectSlider;
	public AudioMixingToggle audioMixingToggle;

	public void SetDisplay (bool display) {
		CanvasGroup group = GetComponent<CanvasGroup> ();
		group.alpha = display ? 1 : 0;
		group.blocksRaycasts = display;
	}

	public void SetToDefault () {
		pitchSlider.SetToDefault ();
		voiceSlider.SetToDefault ();
		bgmSlider.SetToDefault ();
		effectSlider.SetToDefault ();
		audioMixingToggle.SetToDefault ();
	}
}

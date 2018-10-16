using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class VoiceSlider : MonoBehaviour {

	public Text valueLabel;
	public GameController gameController;

	private Slider slider;

	void Start () {
		slider = GetComponent<Slider> () as Slider;
		SetToDefault ();
	}

	public float VoiceValue () {
		return slider.value;
	}

	public void OnSliderDrag () {
		float value = VoiceValue ();

		valueLabel.text = value.ToString ();
		gameController.VoiceValueChanged (value);
	}

	public void SetToDefault () {
		slider.minValue = 0f;
		slider.maxValue = 100f;
		slider.value = 100f;
		valueLabel.text = slider.value.ToString ();
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PitchSlider : MonoBehaviour {

	public Text valueLabel;
	public GameController gameController;

	private Slider slider;

	void Start () {
		slider = GetComponent<Slider> () as Slider;
		SetToDefault ();
	}

	public float PitchValue () {
		return slider.value;
	}

	public void OnSliderDrag () {
		float value = PitchValue ();

		valueLabel.text = value.ToString ();
		gameController.PitchValueChanged (value);
	}

	public void SetToDefault () {
		slider.minValue = 0.5f;
		slider.maxValue = 2f;
		slider.value = 1f;
		valueLabel.text = slider.value.ToString ();
	}
}

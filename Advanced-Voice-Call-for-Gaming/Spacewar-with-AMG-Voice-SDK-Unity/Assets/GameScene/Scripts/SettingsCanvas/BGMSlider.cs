using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BGMSlider : MonoBehaviour {

	public Text valueLabel;
	public GameController gameController;

	private Slider slider;

	void Start () {
		slider = GetComponent<Slider> () as Slider;
		SetToDefault ();
	}

	public float BGMValue () {
		return slider.value;
	}

	public void OnSliderDrag () {
		float value = BGMValue ();

		valueLabel.text = value.ToString ();
		gameController.BGMValueChanged (value);
	}

	public void SetToDefault () {
		slider.minValue = 0f;
		slider.maxValue = 100f;
		slider.value = 100f;
		valueLabel.text = slider.value.ToString ();
	}
}

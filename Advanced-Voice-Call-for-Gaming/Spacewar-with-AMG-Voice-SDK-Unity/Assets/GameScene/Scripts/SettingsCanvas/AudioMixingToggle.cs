using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class AudioMixingToggle : MonoBehaviour {

	public GameController gameController;

	Toggle toggle;

	void Start () {
		toggle = GetComponent<Toggle> ();
		SetToDefault ();
	}
	
	public void OnToggleChanged () {
		gameController.AudioMixingValueChanged (toggle.isOn);
	}

	public void SetToDefault () {
		toggle.isOn = true;
	}
}

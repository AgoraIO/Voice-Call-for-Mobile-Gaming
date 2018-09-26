using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameProfileDropdown : MonoBehaviour {

	public Dropdown dropdown;

	void Start () {
		dropdown.value = ApplicationModal.AudioGameProfile;
	}

	public void OnValueChanged () {
		ApplicationModal.AudioGameProfile = dropdown.value;
	}
}

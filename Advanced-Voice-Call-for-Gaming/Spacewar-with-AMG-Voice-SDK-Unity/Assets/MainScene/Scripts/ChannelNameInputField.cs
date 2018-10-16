using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ChannelNameInputField : MonoBehaviour {

	public InputField inputField;

	void Start () {
		inputField.text = ApplicationModal.ChannelName;
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class JoinButton : MonoBehaviour {

	public InputField channelInputField;

	public void JoinChannel () {
		string channelName = channelInputField.text;
		if (channelName == "" || channelName == null) {
			Debug.Log ("Empty channel name");
			return;
		}

		ApplicationModal.ChannelName = channelName;
		SceneManager.LoadScene ("GameScene");
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MessageText : MonoBehaviour {
	
	void Update () {
		CanvasGroup group = GetComponent<CanvasGroup>();
		float alpha = group.alpha - 0.3f * Time.deltaTime;

		if (alpha <= 0) {
			Destroy (gameObject);
		} else {
			group.alpha = alpha;
		}
	}

	public void SetupText (string text) {
		Text textLabel = GetComponent<Text> ();
		textLabel.text = text;
	}
}

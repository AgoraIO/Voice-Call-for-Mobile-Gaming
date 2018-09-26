using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VolumeCircle : MonoBehaviour {

	private float radiusTime = 1f;

	void Start () {
		
	}
	
	void Update () {
		if (radiusTime <= 1f) {
			return;
		}

		float currentScale = transform.localScale.x;
		if (currentScale >= radiusTime) {
			Destroy (gameObject);
		} else {
			float value = 0.75f * (float)Time.deltaTime;
			transform.localScale += new Vector3 (value, value, 0);
		}
	}

	public void AnimateWithVolume (int volume) {
		radiusTime = 1.2f + ((float)volume - 100f) / 200f;
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Star : MonoBehaviour {

	public float speed;

	private Rigidbody2D body;

	void Update () {
		transform.Rotate (new Vector3 (0, 0, 600) * Time.deltaTime);
	}

	public void MoveToPosition (Vector2 postion) {
		body = GetComponent<Rigidbody2D> ();
		body.velocity = postion * speed;
	}
}

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Spaceship : MonoBehaviour {

	public Star star;
	public Transform shotSpawn; 

	public void FireStar (Vector2 direction) {
		if (direction.y <= 0) {
			return;
		}

		Star cloneStar = Instantiate (star, shotSpawn.position, shotSpawn.rotation) as Star;
		cloneStar.MoveToPosition(direction);

		AudioSource shoot = GetComponent<AudioSource> ();
		shoot.Play ();
	}
}

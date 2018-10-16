//
//  MainViewController.swift
//  AMGVoice
//
//  Created by GongYuhua on 2017/3/2.
//  Copyright © 2017年 Agora. All rights reserved.
//

import UIKit

class MainViewController: UIViewController {
    
    @IBOutlet weak var channelNameTextFiled: UITextField!
    @IBOutlet weak var gameProfileButton: UIButton!
    @IBOutlet weak var versionLabel: UILabel!
    
    private var gameProfile = GameProfile.free() {
        didSet {
            gameProfileButton.setTitle(gameProfile.description(), for: .normal)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let sdkVersion = AgoraRtcEngineKit.getSdkVersion()
        versionLabel.text = sdkVersion
        
        gameProfile = GameProfile.free()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        guard let segueId = segue.identifier else {
            return
        }
        
        switch segueId {
        case "mainToGame":
            let gameVC = segue.destination as! GameViewController
            if let roomName = sender as? String {
                gameVC.roomName = roomName
            }
            gameVC.gameProfile = gameProfile
        default:
            break
        }
    }
    
    @IBAction func doProfilePressed(_ sender: UIButton) {
        let sheet = UIAlertController(title: nil, message: "Select Audio Profile", preferredStyle: .actionSheet)
        let allProfiles = GameProfile.all
        for profile in allProfiles {
            let action = UIAlertAction(title: profile.description(), style: .default, handler: { [unowned self] _ in
                self.gameProfile = profile
            })
            sheet.addAction(action)
        }
        sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        
        sheet.popoverPresentationController?.sourceView = sender
        sheet.popoverPresentationController?.sourceRect = sender.bounds
        present(sheet, animated: true, completion: nil)
    }
    
    @IBAction func doJoinPressed(_ sender: UIButton) {
        joinChannel(with: channelNameTextFiled.text)
    }
}

private extension MainViewController {
    func joinChannel(with channelName: String?) {
        guard let channelName = channelName, !channelName.isEmpty else {
            return
        }
        
        performSegue(withIdentifier: "mainToGame", sender: channelName)
    }
}

extension MainViewController: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        joinChannel(with: textField.text)
        return true
    }
}

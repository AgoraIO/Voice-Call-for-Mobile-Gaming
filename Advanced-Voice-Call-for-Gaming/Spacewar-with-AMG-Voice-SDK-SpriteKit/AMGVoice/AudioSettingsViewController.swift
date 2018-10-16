//
//  AudioSettingsViewController.swift
//  AMGVoice
//
//  Created by GongYuhua on 2017/3/15.
//  Copyright © 2017年 Agora. All rights reserved.
//

import UIKit

protocol AudioSettingsVCDelegate: NSObjectProtocol {
    func audioSettingsVC(audioSettingsVC: AudioSettingsViewController, didChangePitchValueTo pitch: CGFloat)
    func audioSettingsVC(audioSettingsVC: AudioSettingsViewController, didChangeVoiceValueTo voice: CGFloat)
    func audioSettingsVC(audioSettingsVC: AudioSettingsViewController, didChangeBgmValueTo bgm: CGFloat)
    func audioSettingsVC(audioSettingsVC: AudioSettingsViewController, didChangeEffectValueTo effect: CGFloat)
    func audioSettingsVC(audioSettingsVC: AudioSettingsViewController, didChangeUseAudioMixingTo useAudioMixing: Bool)
}

class AudioSettingsViewController: UIViewController {
    
    @IBOutlet weak var pitchSlider: UISlider!
    @IBOutlet weak var voiceSlider: UISlider!
    @IBOutlet weak var bgmSlider: UISlider!
    @IBOutlet weak var effectSlider: UISlider!
    
    @IBOutlet weak var pitchLabel: UILabel!
    @IBOutlet weak var voiceLabel: UILabel!
    @IBOutlet weak var bgmLabel: UILabel!
    @IBOutlet weak var effectLabel: UILabel!
    
    @IBOutlet weak var audioMixingSwitch: UISwitch!
    
    weak var delegate: AudioSettingsVCDelegate?
    
    var pitch: CGFloat = 1 {
        didSet {
            updateLabels()
        }
    }
    var voice: CGFloat = 100 {
        didSet {
            updateLabels()
        }
    }
    var bgm: CGFloat = 100 {
        didSet {
            updateLabels()
        }
    }
    var effect: CGFloat = 100 {
        didSet {
            updateLabels()
        }
    }
    var useAudioMixing = true
    var isSliderEnabled = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        preferredContentSize = CGSize(width: 300, height: 240)
        
        updateSliders()
        updateLabels()
        updateSwitchs()
    }
    
    @IBAction func doPitchChanged(_ sender: UISlider) {
        pitch = CGFloat(sender.value)
        delegate?.audioSettingsVC(audioSettingsVC: self, didChangePitchValueTo: pitch)
    }
    
    @IBAction func doVoiceChanged(_ sender: UISlider) {
        voice = CGFloat(sender.value)
        delegate?.audioSettingsVC(audioSettingsVC: self, didChangeVoiceValueTo: voice)
    }
    
    @IBAction func doBGMChanged(_ sender: UISlider) {
        bgm = CGFloat(sender.value)
        delegate?.audioSettingsVC(audioSettingsVC: self, didChangeBgmValueTo: bgm)
    }
    
    @IBAction func doEffectChanged(_ sender: UISlider) {
        effect = CGFloat(sender.value)
        delegate?.audioSettingsVC(audioSettingsVC: self, didChangeEffectValueTo: effect)
    }
    
    @IBAction func doAudioMixingSwitched(_ sender: UISwitch) {
        useAudioMixing = !useAudioMixing
        delegate?.audioSettingsVC(audioSettingsVC: self, didChangeUseAudioMixingTo: useAudioMixing)
    }
}

private extension AudioSettingsViewController {
    func updateSliders() {
        pitchSlider?.value = Float(pitch)
        voiceSlider?.value = Float(voice)
        bgmSlider?.value = Float(bgm)
        effectSlider?.value = Float(effect)
        
        pitchSlider?.isEnabled = isSliderEnabled
        voiceSlider?.isEnabled = isSliderEnabled
        bgmSlider?.isEnabled = isSliderEnabled
        effectSlider?.isEnabled = isSliderEnabled
    }
    
    func updateLabels() {
        pitchLabel?.text = pitch.displayString()
        voiceLabel?.text = voice.displayString()
        bgmLabel?.text = bgm.displayString()
        effectLabel?.text = effect.displayString()
    }
    
    func updateSwitchs() {
        audioMixingSwitch?.isOn = useAudioMixing
    }
}
